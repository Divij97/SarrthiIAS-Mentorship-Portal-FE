'use client';

import { useEffect, useState } from 'react';
import { useMentorStore } from '@/stores/mentor/store';
import { SessionCard } from '@/components/Sessions/SessionCard';
import { MentorshipSession } from '@/types/session';
import { getCombinedSessionsFromMentor } from '@/utils/session-utlis';

export default function MentorSessionsPage() {
  const { mentor, mentorResponse } = useMentorStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [combinedSessions, setCombinedSessions] = useState<Record<string, MentorshipSession[]>>({});

  useEffect(() => {
    if (!mentor) {
      setError('Authentication required. Kindly login again.');
      setLoading(false);
      return;
    }
    
    if (!mentorResponse) {
      setError('No sessions data available');
      setLoading(false);
      return;
    }
    
    // Combine sessions from both sources
    const combined: Record<string, MentorshipSession[]> = getCombinedSessionsFromMentor(mentorResponse);
    
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
          {combinedSessions && Object.entries(combinedSessions)
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