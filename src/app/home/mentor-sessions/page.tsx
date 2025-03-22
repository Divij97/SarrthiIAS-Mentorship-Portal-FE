'use client';

import { useEffect, useMemo, useState } from 'react';
import { useLoginStore } from '@/stores/auth/store';
import { useMentorStore } from '@/stores/mentor/store';
import { PlusIcon } from '@heroicons/react/24/outline';
import CalendarView from '@/components/Calendar/CalendarView';
import { SessionManager } from '@/services/session-manager';
import { useSessionStore } from '@/stores/session/store';
import { Meeting } from '@/types/meeting';
import SessionModals from '@/components/app/SessionModals';

export default function MentorSessionsPage() {
  // Create a local state for found sessions to avoid unnecessary recomputation
  const [sessionManager, setSessionManagerState] = useState<SessionManager | null>(null);

  // Access auth state
  const authHeader = useLoginStore(state => state.authHeader);
  
  // Access mentor state directly
  const mentor = useMentorStore(state => state.mentor);
  const mentorResponse = useMentorStore(state => state.mentorResponse);
  const setMentorResponse = useMentorStore(state => state.setMentorResponse);
  
  // Access session state directly with primitive selectors
  const loading = useSessionStore(state => state.loading);
  const error = useSessionStore(state => state.error);
  const calendarMeetings = useSessionStore(state => state.calendarMeetings);
  const sessionsByDate = useSessionStore(state => state.sessionsByDate);
  
  // Get essential store functions only once
  const sessionStore = useSessionStore.getState();
  
  // Initialize the session manager when authHeader is available
  useEffect(() => {
    if (authHeader) {
      const manager = new SessionManager(authHeader);
      setSessionManagerState(manager);
      sessionStore.setSessionManager(manager);
    }
  }, [authHeader]);

  // Load sessions when mentorResponse changes
  useEffect(() => {
    if (!mentor || !mentorResponse) {
      return;
    }
    
    sessionStore.loadSessions(mentorResponse);
  }, [mentor, mentorResponse]);
  
  // Use useMemo to find sessions only when necessary
  const findSession = useMemo(() => {
    return (meetingId: string | number) => {
      let foundSession = null;
      
      Object.values(sessionsByDate).forEach(sessions => {
        const session = sessions.find(s => s.id === meetingId);
        if (session) {
          foundSession = session;
        }
      });
      
      return foundSession;
    };
  }, [sessionsByDate]);
  
  // Handle calendar meeting actions with memoized functions
  const handleEditClick = (meeting: Meeting) => {
    const session = findSession(meeting.id);
    if (session) {
      sessionStore.openEditModal(session);
    }
  };

  const handleCancelClick = (meeting: Meeting) => {
    const session = findSession(meeting.id);
    if (session) {
      sessionStore.openCancelModal(session);
    }
  };

  // Handler for Add Session button click
  const handleAddSessionClick = () => {
    sessionStore.openAddModal();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading sessions...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-600">{error}</div>
      </div>
    );
  }

  // Ensure we have unique IDs for meetings
  const meetingsWithUniqueIds = calendarMeetings.map(meeting => ({
    ...meeting,
    id: typeof meeting.id === 'string' && meeting.id.includes('session-') 
      ? meeting.id 
      : `session-${meeting.id}`
  }));

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Your Mentorship Schedule</h1>
          <p className="mt-2 text-gray-600">
            View and manage your upcoming mentorship sessions
          </p>
        </div>

        <div className="flex justify-end mb-4">
          <button
            onClick={handleAddSessionClick}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Session
          </button>
        </div>

        <div className="space-y-8">
          {meetingsWithUniqueIds.length > 0 ? (
            <CalendarView 
              meetings={meetingsWithUniqueIds}
              onEditMeeting={handleEditClick}
              onCancelMeeting={handleCancelClick}
            />
          ) : (
            <div className="text-center text-gray-500 bg-white p-8 rounded-lg shadow">
              No upcoming sessions found
            </div>
          )}
        </div>
      </div>

      {/* All modals are now managed in the SessionModals component */}
      <SessionModals 
        mentorResponse={mentorResponse} 
        setMentorResponse={setMentorResponse} 
      />
    </div>
  );
} 