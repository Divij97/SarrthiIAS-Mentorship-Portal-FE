'use client';

import { useEffect, useState } from 'react';
import { useLoginStore } from '@/stores/auth/store';
import { useMentorStore } from '@/stores/mentor/store';
import { getMentorSessions } from '@/services/mentors';
import { MentorSessionsResponse, MentorshipSession, formatTime } from '@/types/session';
import { CalendarDaysIcon, ClockIcon, UserIcon, PhoneIcon } from '@heroicons/react/24/outline';

export default function MentorSessionsPage() {
  const { authHeader } = useLoginStore();
  const { mentor } = useMentorStore();
  const [sessions, setSessions] = useState<MentorSessionsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSessions = async () => {
      if (!mentor?.phone || !authHeader) {
        setError('Authentication required');
        setLoading(false);
        return;
      }

      try {
        const response = await getMentorSessions(mentor.phone, authHeader);
        setSessions(response);
      } catch (error) {
        console.error('Error fetching sessions:', error);
        setError('Failed to fetch sessions');
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [mentor?.phone, authHeader]);

  const renderSession = (session: MentorshipSession) => {
    const startTime = formatTime(session.startTime);
    const endTime = formatTime(session.endTime);

    return (
      <div key={session.id} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-all duration-200">
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <UserIcon className="h-5 w-5 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900">{session.menteeFullName}</h3>
              </div>
              <div className="flex items-center space-x-2 text-gray-500">
                <PhoneIcon className="h-4 w-4" />
                <span className="text-sm">{session.menteeUsername}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-500">
                <ClockIcon className="h-4 w-4" />
                <span className="text-sm">{startTime} - {endTime}</span>
              </div>
            </div>
            {session.isZoomLinkGenerated ? (
              <a
                href={session.zoomLink || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Join Meeting
              </a>
            ) : (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                Link Pending
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

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
          {sessions && Object.entries(sessions.sessionsByDate).map(([date, dateSessions]) => (
            <div key={date} className="bg-white shadow-sm rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-6 py-3 flex items-center space-x-2">
                <CalendarDaysIcon className="h-5 w-5 text-gray-500" />
                <h2 className="text-lg font-medium text-gray-900">{date}</h2>
              </div>
              <div className="p-6 space-y-4">
                {dateSessions.length > 0 ? (
                  dateSessions.map(session => renderSession(session))
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    No sessions scheduled for this day
                  </div>
                )}
              </div>
            </div>
          ))}

          {sessions && Object.keys(sessions.sessionsByDate).length === 0 && (
            <div className="text-center text-gray-500">
              No upcoming sessions found
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 