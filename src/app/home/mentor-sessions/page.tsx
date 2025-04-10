'use client';

import { useEffect, useMemo, useState } from 'react';
import { useLoginStore } from '@/stores/auth/store';
import { useMentorStore } from '@/stores/mentor/store';
import { PlusIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import CalendarView from '@/components/Calendar/CalendarView';
import { Meeting, GroupMeeting } from '@/types/meeting';
import { convertDateFormat } from '@/utils/date-time-utils';
import { 
  MentorshipSession, 
  SessionType, 
  GroupMentorshipSession,
  UpdateType,
  DateFormatDDMMYYYY 
} from '@/types/session';

import { getGroupSessionForMentor, addNewAdHocSession, cancelSession, getMentorByPhone } from '@/services/mentors';
import NotifyMenteeModal from '@/components/app/NotifyMenteeModal';
import AddSessionModal from '@/components/modals/AddSessionModal';
import CancelSessionModal from '@/components/modals/CancelSessionModal';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function MentorSessionsPage() {
  // State for modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isNotifyModalOpen, setIsNotifyModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<(MentorshipSession & { originalDate?: DateFormatDDMMYYYY }) | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const addToSessionsByDate = useMentorStore(state => state.addToSessionsByDate);
  const removeFromSessionsByDate = useMentorStore(state => state.removeFromSessionsByDate);
  const router = useRouter();
  // Form state for add session
  const [addFormData, setAddFormData] = useState({
    date: '',
    startTime: '10:00',
    endTime: '11:00',
    menteeUsername: '',
    menteeFullName: ''
  });

  // Group sessions state
  const [groupSessions, setGroupSessions] = useState<GroupMentorshipSession[] | null>(null);
  const [isLoadingGroupSessions, setIsLoadingGroupSessions] = useState(false);

  // State for meetings
  const [groupMeetings, setGroupMeetings] = useState<GroupMeeting[]>([]);
  const [allMeetings, setAllMeetings] = useState<Meeting[]>([]);

  // Access store state
  const mentorResponse = useMentorStore((state) => state.mentorResponse);
  const setMentorResponse = useMentorStore(state => state.setMentorResponse);
  const authHeader = useLoginStore(state => state.getAuthHeader)();

  // Fetch group sessions when component mounts
  useEffect(() => {
    const fetchGroupSessions = async () => {
      if (!mentorResponse?.username || !authHeader || !mentorResponse?.groups) {
        return;
      }

      setIsLoadingGroupSessions(true);
      try {
        const response = await getGroupSessionForMentor(
          mentorResponse.username,
          mentorResponse.groups,
          authHeader
        );
        setGroupSessions(response.groupSessions);
      } catch (error) {
        toast.error('Failed to fetch group sessions. Please try again.');
        setGroupSessions(null);
      } finally {
        setIsLoadingGroupSessions(false);
      }
    };

    fetchGroupSessions();
  }, [mentorResponse?.username, mentorResponse?.groups]);

  // Convert group sessions to meetings format and update state
  useEffect(() => {
    if (!groupSessions) {
      setGroupMeetings([]);
      return;
    }
    
    const meetings = groupSessions.map((session: GroupMentorshipSession) => {
      let formattedDate = '';
      try {
        formattedDate = session.date ? convertDateFormat(session.date) : '';
      } catch (error) {
        toast.error('Error processing session date. Please try again.');
        formattedDate = '';
      }
      
      return {
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
    });

    setGroupMeetings(meetings);
  }, [groupSessions]);

  // Combine all meetings and update state when either individual or group meetings change
  useEffect(() => {
    const individualMeetings = mentorResponse?.sessionsByDate 
      ? Object.entries(mentorResponse.sessionsByDate).flatMap(([date, sessions]) =>
          sessions.map(session => ({
            id: session.id,
            title: `Session with ${session.menteeFullName || session.menteeUsername}`,
            date: convertDateFormat(date),
            startTime: session.startTime,
            endTime: session.endTime,
            menteeUsername: session.menteeUsername,
            zoomLink: session.zoomMeetingInfo?.joinUrl,
            originalDate: date,
            sessionType: session.sessionType
          }))
        )
      : [];

    const meetings = [...individualMeetings, ...groupMeetings].filter(
      meeting => meeting && typeof meeting === 'object'
    );

    setAllMeetings(meetings);
  }, [mentorResponse?.sessionsByDate, groupMeetings, setMentorResponse]);

  // Handlers
  const handleAddSessionClick = () => {
    setIsAddModalOpen(true);
  };

  const handleCancelClick = (meeting: Meeting) => {
    if (!mentorResponse?.sessionsByDate || !meeting.originalDate) return;
    
    const session = mentorResponse.sessionsByDate[meeting.originalDate]
      .find((s: MentorshipSession) => s.id === meeting.id);
      
    if (session) {
      setSelectedSession({
        ...session,
        originalDate: meeting.originalDate as DateFormatDDMMYYYY
      });
      setIsCancelModalOpen(true);
    }
  };

  const handleAddSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mentorResponse?.username || !authHeader) return;

    setIsLoading(true);
    setError(null);

    try {
      // Convert date from yyyy-mm-dd to dd/mm/yyyy
      const [year, month, day] = addFormData.date.split('-');
      const formattedDate = `${day}/${month}/${year}` as DateFormatDDMMYYYY;

      const newSession = await addNewAdHocSession(
        {
          id: '', // Will be generated by the server
          date: formattedDate,
          menteeUsername: addFormData.menteeUsername,
          menteeFullName: addFormData.menteeFullName,
          startTime: addFormData.startTime,
          endTime: addFormData.endTime,
          updateType: UpdateType.ADD,
          isPermanentUpdate: true,
          sessionType: SessionType.AD_HOC,
          mentorEmail: mentorResponse.mentor?.email
        },
        authHeader,
        mentorResponse.username
      );
      const updatedSession: MentorshipSession = {
        id: newSession.id,
        menteeUsername: addFormData.menteeUsername,
        menteeFullName: addFormData.menteeFullName,
        mentorUsername: mentorResponse.username,
        mentorName: mentorResponse.mentor?.name || 'Mentor',
        startTime: addFormData.startTime,
        endTime: addFormData.endTime,
        sessionType: SessionType.AD_HOC,
        zoomLink: newSession.zoomLink,
        zoomMeetingInfo: newSession.zoomMeetingInfo
      }

      addToSessionsByDate(formattedDate, updatedSession);
      
      setIsAddModalOpen(false);
      setAddFormData({
        date: '',
        startTime: '10:00',
        endTime: '11:00',
        menteeUsername: '',
        menteeFullName: ''
      });
      router.refresh();
    } catch (error) {
      toast.error('Failed to add session. Please try again.');
      setError('Failed to add session. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelSession = async () => {
    if (!selectedSession || !authHeader || !mentorResponse?.username || !selectedSession.originalDate) return;

    setIsLoading(true);
    setError(null);

    try {
      await cancelSession(
        {
          id: selectedSession.id,
          date: selectedSession.originalDate,
          updateType: UpdateType.DELETE,
          isPermanentUpdate: true,
          sessionType: selectedSession.sessionType,
          menteeUsername: selectedSession.menteeUsername,
          menteeFullName: selectedSession.menteeFullName
        },
        authHeader
      );

      // Remove from local state using the same date
      removeFromSessionsByDate(selectedSession.originalDate, selectedSession.id);

      setIsCancelModalOpen(false);
      setSelectedSession(null);
    } catch (error) {
      toast.error('Failed to cancel session. Please try again.');
      setError('Failed to cancel session. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormChange = (field: string, value: string) => {
    setAddFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (isLoadingGroupSessions) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading sessions...</div>
      </div>
    );
  }

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

        <AddSessionModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddSession}
          formData={addFormData}
          onFormChange={handleFormChange}
          isLoading={isLoading}
          error={error}
        />

        <CancelSessionModal
          isOpen={isCancelModalOpen}
          onClose={() => {
            setIsCancelModalOpen(false);
            setSelectedSession(null);
          }}
          onCancel={handleCancelSession}
          session={selectedSession}
          isLoading={isLoading}
          error={error}
        />

        <NotifyMenteeModal
          isOpen={isNotifyModalOpen}
          onClose={() => setIsNotifyModalOpen(false)}
          mentees={mentorResponse?.assignedMentees || []}
          authHeader={authHeader || ''}
        />
      </div>
    </div>
  );
} 