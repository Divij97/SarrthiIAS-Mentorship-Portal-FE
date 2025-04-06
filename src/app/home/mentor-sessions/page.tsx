'use client';

import { useEffect, useMemo, useState, useRef } from 'react';
import { useLoginStore } from '@/stores/auth/store';
import { useMentorStore } from '@/stores/mentor/store';
import { PlusIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import CalendarView from '@/components/Calendar/CalendarView';
import { SessionManager } from '@/services/session-manager';
import { useSessionStore } from '@/stores/session/store';
import { Meeting, GroupMeeting } from '@/types/meeting';
import SessionModals from '@/components/app/SessionModals';
import { convertDateFormat } from '@/utils/date-time-utils';
import { MentorshipSession, SessionType, GroupMentorshipSession } from '@/types/session';
import { useAdminAuthStore } from '@/stores/auth/admin-auth-store';
import { getGroupSessionForMentor } from '@/services/mentors';
import NotifyMenteeModal from '@/components/app/NotifyMenteeModal';

export default function MentorSessionsPage() {
  // Create a local state for found sessions to avoid unnecessary recomputation
  const [sessionManager, setSessionManagerState] = useState<SessionManager | null>(null);
  
  // Store references to avoid recreating functions on each render
  const sessionStoreRef = useRef(useSessionStore.getState());

  // Access auth state
  const { getAuthHeader } = useAdminAuthStore();
  
  // Access mentor state directly
  const mentor = useMentorStore(state => state.mentor);
  const mentorResponse = useMentorStore((state) => state.mentorResponse);
  const setMentorResponse = useMentorStore(state => state.setMentorResponse);
  
  // Access session state with individual primitive selectors
  const loading = useSessionStore(state => state.loading);
  const error = useSessionStore(state => state.error);
  const calendarMeetings = useSessionStore(state => state.calendarMeetings);
  const sessionsByDate = useSessionStore(state => state.sessionsByDate);
  const authHeader = useLoginStore(state => state.getAuthHeader());
  const [isNotifyModalOpen, setIsNotifyModalOpen] = useState(false);
  const [groupSessions, setGroupSessions] = useState<GroupMentorshipSession[] | null>(null);
  const [isLoadingGroupSessions, setIsLoadingGroupSessions] = useState(false);
  const groupSessionsRef = useRef<boolean>(false);
  
  // Initialize the session manager when authHeader is available
  useEffect(() => {
    if (authHeader) {
      const manager = new SessionManager(authHeader);
      setSessionManagerState(manager);
      sessionStoreRef.current.setSessionManager(manager);
    }
  }, [authHeader]);

  // Fetch group sessions when mentor is available - using ref to prevent multiple calls
  useEffect(() => {
    const fetchGroupSessions = async () => {
      // Return early if required data is missing
      if (!mentor?.phone || !authHeader || !mentorResponse?.groups) {
        setGroupSessions(null);
        return;
      }
      
      // Return early if we're already loading or have loaded the data
      if (isLoadingGroupSessions || groupSessionsRef.current) {
        return;
      }
      
      setIsLoadingGroupSessions(true);
      groupSessionsRef.current = true;
      
      try {
        const response = await getGroupSessionForMentor(mentor.phone, mentorResponse.groups, authHeader);
        
        // Check if response and response.groupSessions are valid
        if (response && Array.isArray(response.groupSessions)) {
          setGroupSessions(response.groupSessions);
        } else {
          console.warn('Received invalid group sessions response:', response);
          setGroupSessions(null);
        }
      } catch (error) {
        console.error('Error fetching group sessions:', error);
        setGroupSessions(null);
      } finally {
        setIsLoadingGroupSessions(false);
      }
    };

    fetchGroupSessions();
  }, [mentor?.phone, mentorResponse?.groups, authHeader, isLoadingGroupSessions]);

  // Convert group sessions to meetings format
  const groupMeetings = useMemo(() => {
    if (!groupSessions) return [];
    
    // Since groupSessions is now GroupMentorshipSession[] directly (not nested)
    return groupSessions.map((session: GroupMentorshipSession) => {
      // Safe date conversion - handle potential errors
      let formattedDate = '';
      try {
        formattedDate = session.date ? convertDateFormat(session.date) : '';
      } catch (error) {
        console.error('Error converting date format:', error);
        formattedDate = '';
      }
      
      // Create a meeting object from the session
      const meeting: GroupMeeting = {
        id: `${session.sessionId || 'unknown-session'}`,
        title: session.name || `Group Session`,
        date: formattedDate,
        startTime: session.startTime || '00:00',
        endTime: session.endTime || '00:00',
        isGroupSession: true,
        groupId: '',
        courseId: '',
        courseName: 'Group Session',
        groupFriendlyName: '',
        zoomLink: session.zoomLink || undefined,
        sessionType: SessionType.SCHEDULED
      };
      
      return meeting;
    });
  }, [groupSessions]);

  // Combine individual and group meetings
  const allMeetings = useMemo(() => {
    const individualMeetings = Array.isArray(calendarMeetings) ? calendarMeetings : [];
    const groupMeetingsArray = Array.isArray(groupMeetings) ? groupMeetings : [];
    
    // Filter out any potentially invalid meetings
    const validMeetings = [...individualMeetings, ...groupMeetingsArray].filter(
      meeting => meeting && typeof meeting === 'object'
    );
    
    return validMeetings;
  }, [calendarMeetings, groupMeetings]);

  // Load sessions when mentorResponse changes
  useEffect(() => {
    if (!mentor || !mentorResponse) {
      return;
    }
    
    sessionStoreRef.current.loadSessions(mentorResponse);
    
  }, [mentor, mentorResponse]);
  
  // Use useMemo to find sessions only when necessary
  const findSession = useMemo(() => {
    return (meetingId: string | number): MentorshipSession | null => {
      let foundSession: MentorshipSession | null = null;
      
      // Remove the 'session-' prefix if it exists
      const cleanId = typeof meetingId === 'string' && meetingId.startsWith('session-') 
        ? meetingId.replace('session-', '') 
        : meetingId;
      
      // First try to find in sessionsByDate
      Object.values(sessionsByDate).forEach(sessions => {
        const session = sessions.find(s => s.id === cleanId);
        if (session) {
          foundSession = {
            ...session,
            sessionType: session.sessionType || 'AD_HOC' // Ensure sessionType is set
          };
        }
      });
      
      // If not found, try to find in mentorResponse
      if (!foundSession && mentorResponse) {
        Object.values(mentorResponse.sessionsByDate).forEach(sessions => {
          const session = sessions.find(s => s.id === cleanId);
          if (session) {
            foundSession = {
              ...session,
              sessionType: session.sessionType || 'AD_HOC' // Ensure sessionType is set
            };
          }
        });
      }
      
      return foundSession;
    };
  }, [sessionsByDate, mentorResponse]);
  
  
  const handleCancelClick = useMemo(() => {
    return (meeting: Meeting) => {
      const session = findSession(meeting.id);
      if (session) {
        console.log('Opening cancel modal with session:', session);
        console.log('Meeting date:', meeting.originalDate || meeting.date);
        console.log('Session type:', session.sessionType);
        sessionStoreRef.current.openCancelModal(session, meeting.originalDate || meeting.date);
      }
    };
  }, [findSession]);

  // Handler for Add Session button click
  const handleAddSessionClick = useMemo(() => {
    return () => {
      sessionStoreRef.current.openAddModal();
    };
  }, []);

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
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="text-center mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Your Mentorship Schedule</h1>
          <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600">
            View and manage your upcoming mentorship sessions
          </p>
        </div>

        <div className="flex justify-end space-x-3 mb-3 sm:mb-4">
          <button
            onClick={() => setIsNotifyModalOpen(true)}
            className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            <EnvelopeIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
            <span className="whitespace-nowrap">Remind Mentee about Absenteeism</span>
          </button>
          <button
            onClick={handleAddSessionClick}
            className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            <PlusIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
            <span className="whitespace-nowrap">Add Session</span>
          </button>
        </div>

        <div className="space-y-4 sm:space-y-8">
          {allMeetings.length > 0 ? (
            <CalendarView 
              meetings={allMeetings}
              onCancelMeeting={handleCancelClick}
            />
          ) : (
            <div className="text-center text-gray-500 bg-white p-4 sm:p-8 rounded-lg shadow">
              <div className="py-8">
                <svg 
                  className="mx-auto h-12 w-12 text-gray-300" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900">No upcoming sessions</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Click "Add Session" to schedule a new mentorship session.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* All modals are now managed in the SessionModals component */}
      <SessionModals 
        mentorResponse={mentorResponse} 
        setMentorResponse={setMentorResponse} 
      />

      <NotifyMenteeModal
        isOpen={isNotifyModalOpen}
        onClose={() => setIsNotifyModalOpen(false)}
        mentees={mentorResponse?.assignedMentees || []}
        authHeader={authHeader || ''}
      />
    </div>
  );
} 