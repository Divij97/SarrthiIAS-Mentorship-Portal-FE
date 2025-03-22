'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Session, GroupMentorshipSession } from '@/types/session';
import { ArrowLeftIcon, PlusIcon, VideoCameraIcon, DocumentIcon, ClockIcon } from '@heroicons/react/24/outline';
import SessionForm, { SessionFormData } from '@/components/Admin/SessionForm';
import { useAdminStore } from '@/stores/admin/store';

interface SessionCardProps {
  session: Session;
  onEdit: (session: Session) => void;
}

// Helper function to convert GroupMentorshipSession to Session
const convertToSession = (groupSession: GroupMentorshipSession): Session => {
  return {
    id: groupSession.sessionId,
    title: `Group Session ${groupSession.dateOfSession}`,
    description: `Group mentorship session with ${groupSession.mentorName}`,
    date: new Date().toISOString().split('T')[0], // This would need to be calculated based on dateOfSession
    startTime: groupSession.startTime,
    endTime: groupSession.endTime,
    status: 'scheduled',
    meetingLink: groupSession.zoomLink || undefined,
  };
};

function SessionCard({ session, onEdit }: SessionCardProps) {
  const getStatusColor = (status: Session['status']) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-50 text-blue-700';
      case 'completed':
        return 'bg-green-50 text-green-700';
      case 'cancelled':
        return 'bg-red-50 text-red-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{session.title}</h3>
          <p className="text-sm text-gray-500 mt-1">{session.description}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
          {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center text-sm text-gray-600">
          <ClockIcon className="h-4 w-4 mr-2" />
          <span>{formatDate(session.date)} • {session.startTime} - {session.endTime}</span>
        </div>

        {session.meetingLink && (
          <div className="flex items-center text-sm">
            <VideoCameraIcon className="h-4 w-4 mr-2 text-gray-500" />
            <a href={session.meetingLink} target="_blank" rel="noopener noreferrer" 
              className="text-blue-600 hover:text-blue-800">
              Join Meeting
            </a>
          </div>
        )}

        {session.recordingLink && (
          <div className="flex items-center text-sm">
            <DocumentIcon className="h-4 w-4 mr-2 text-gray-500" />
            <a href={session.recordingLink} target="_blank" rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800">
              View Recording
            </a>
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100">
        <button
          onClick={() => onEdit(session)}
          className="text-sm text-gray-600 hover:text-gray-900 font-medium"
        >
          Edit Session
        </button>
      </div>
    </div>
  );
}

export default function GroupDetailsPage({
  params,
}: {
  params: Promise<{ courseName: string; groupId: string }>;
}) {
  const router = useRouter();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Unwrap params using React.use()
  const { courseName, groupId } = use(params);
  const decodedCourseName = decodeURIComponent(courseName);
  const decodedGroupId = decodeURIComponent(groupId);
  const { getGroupSessions, getMentorUserNameByPhone } = useAdminStore();

  useEffect(() => {
    const loadGroupSessions = () => {
      setLoading(true);
      setError(null);
      const groupSessions = getGroupSessions(decodedCourseName, decodedGroupId);
      if (groupSessions && groupSessions.length > 0) {
          console.log('Using cached group sessions for:', decodedGroupId);
          const convertedSessions = groupSessions.map(convertToSession);
          setSessions(convertedSessions);
          setLoading(false);
          return;
      }
      
      console.log('No cached sessions found for group:', decodedGroupId);
      setLoading(false);
    };

    loadGroupSessions();
  }, [decodedGroupId, decodedCourseName, getGroupSessions]);

  const handleBackClick = () => {
    router.push(`/admin/dashboard/courses/${encodeURIComponent(decodedCourseName)}/details`);
  };

  const handleEditSession = (session: Session) => {
    // TODO: Implement edit session functionality
    console.log('Edit session:', session);
  };

  const handleCreateSession = () => {
    setIsCreateModalOpen(true);
  };

  const handleSessionFormSubmit = (formData: SessionFormData) => {
    const newSession: GroupMentorshipSession = {
      sessionId: `session-${Date.now()}`,
      groupFriendlyName: decodedGroupId,
      mentorName: formData.mentorId,
      mentorUserName: getMentorUserNameByPhone(formData.mentorId) || formData.mentorId,
      dateOfSession: formData.dayOfMonth, // This would be calculated based on the next occurrence
      startTime: formData.startTime,
      endTime: formData.endTime,
      zoomLink: ''
    };

    setSessions(prev => [...prev, convertToSession(newSession)]);
    console.log('Creating session with data:', formData);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Loading sessions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleBackClick}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-1" />
            Back to Course
          </button>
          <h1 className="text-2xl font-semibold text-gray-900">
            {decodedGroupId} Sessions
          </h1>
        </div>
        <button
          onClick={handleCreateSession}
          className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Create Session
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sessions.map((session) => (
          <SessionCard
            key={session.id}
            session={session}
            onEdit={handleEditSession}
          />
        ))}
      </div>

      {sessions.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <h3 className="mt-2 text-sm font-medium text-gray-900">No Sessions</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new session for this group.
          </p>
          <div className="mt-6">
            <button
              onClick={handleCreateSession}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Create Session
            </button>
          </div>
        </div>
      )}

      <SessionForm
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleSessionFormSubmit}
      />
    </div>
  );
} 