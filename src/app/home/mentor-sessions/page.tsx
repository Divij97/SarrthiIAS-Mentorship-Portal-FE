'use client';

import { useEffect, useState } from 'react';
import { useLoginStore } from '@/stores/auth/store';
import { useMentorStore } from '@/stores/mentor/store';
import { SessionCard } from '@/components/Sessions/SessionCard';
import { MentorshipSession } from '@/types/session';
import { DayOfWeek } from '@/types/mentor';

// Helper function to get the next occurrence of a day of week
const getNextDayOfWeek = (dayOfWeek: DayOfWeek): Date => {
  const today = new Date();
  const daysOfWeek = {
    [DayOfWeek.MONDAY]: 1,
    [DayOfWeek.TUESDAY]: 2,
    [DayOfWeek.WEDNESDAY]: 3,
    [DayOfWeek.THURSDAY]: 4,
    [DayOfWeek.FRIDAY]: 5,
    [DayOfWeek.SATURDAY]: 6,
    [DayOfWeek.SUNDAY]: 0
  };
  
  const targetDay = daysOfWeek[dayOfWeek];
  const currentDay = today.getDay();
  
  // Calculate days to add
  const daysToAdd = (targetDay + 7 - currentDay) % 7;
  
  // Create a new date for the next occurrence
  const nextDate = new Date(today);
  nextDate.setDate(today.getDate() + daysToAdd);
  
  return nextDate;
};

// Format date as DD/MM/YYYY
const formatDateKey = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export default function MentorSessionsPage() {
  const { mentor, mentorResponse } = useMentorStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [combinedSessions, setCombinedSessions] = useState<Record<string, MentorshipSession[]>>({});

  useEffect(() => {
    if (!mentor) {
      setError('Authentication required');
      setLoading(false);
      return;
    }
    
    if (!mentorResponse) {
      setError('No sessions data available');
      setLoading(false);
      return;
    }
    
    // Combine sessions from both sources
    const combined: Record<string, MentorshipSession[]> = { ...mentorResponse.sessionsByDate };
    
    // Process sessions by day of week
    if (mentorResponse.sessionsByDayOfWeek) {
      Object.entries(mentorResponse.sessionsByDayOfWeek).forEach(([day, sessions]) => {
        if (sessions && sessions.length > 0) {
          // Convert day of week to next occurrence date
          const nextDate = getNextDayOfWeek(day as DayOfWeek);
          const dateKey = formatDateKey(nextDate);
          
          // Add to combined sessions
          if (!combined[dateKey]) {
            combined[dateKey] = [];
          }
          
          // Add sessions that aren't already in the list (avoid duplicates)
          sessions.forEach(session => {
            const isDuplicate = combined[dateKey].some(existingSession => 
              existingSession.id === session.id
            );
            
            if (!isDuplicate) {
              combined[dateKey].push(session);
            }
          });
        }
      });
    }
    
    setCombinedSessions(combined);
    setLoading(false);
  }, [mentor, mentorResponse]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse flex justify-center">
            <div className="text-gray-500">Loading sessions...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-red-600">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900">Your Mentorship Schedule</h1>
          <p className="mt-2 text-gray-600">
            View and manage your upcoming mentorship sessions
          </p>
        </div>

        <div className="space-y-8">
          {Object.entries(combinedSessions)
            .sort(([dateA], [dateB]) => {
              // Sort dates in ascending order
              const [dayA, monthA, yearA] = dateA.split('/').map(Number);
              const [dayB, monthB, yearB] = dateB.split('/').map(Number);
              
              const dateObjA = new Date(yearA, monthA - 1, dayA);
              const dateObjB = new Date(yearB, monthB - 1, dayB);
              
              return dateObjA.getTime() - dateObjB.getTime();
            })
            .map(([date, dateSessions]) => (
              <SessionCard key={date} date={date} sessions={dateSessions} />
            ))}

          {Object.keys(combinedSessions).length === 0 && (
            <div className="text-center text-gray-500">
              No upcoming sessions found
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 