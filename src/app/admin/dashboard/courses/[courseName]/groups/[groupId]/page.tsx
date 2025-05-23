'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Session, GroupMentorshipSession, MentorshipGroup } from '@/types/session';
import { ArrowLeftIcon, PlusIcon, VideoCameraIcon, DocumentIcon, ClockIcon, PencilIcon, TrashIcon, CheckIcon, XMarkIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import SessionForm, { SessionFormData } from '@/components/Admin/SessionForm';
import { convertToSession } from '@/utils/session-utils';
import { useAdminAuthStore } from '@/stores/auth/admin-auth-store';
import { getGroupById } from '@/services/mentee';
import { useSessionStore } from '@/stores/session/store';
import { BulkMentorshipGroupCreateOrUpdateRequest, DeleteGroupSessionsRequest } from '@/types/admin';
import { SessionManager } from '@/services/session-manager';
import SessionCard from '@/components/app/SessionCard';
import { toast } from 'react-hot-toast';
import { formatTimeToHHMM } from '@/utils/date-time-utils';

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
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedSessions, setEditedSessions] = useState<GroupMentorshipSession[]>([]);
  const { getAuthHeader } = useAdminAuthStore();
  const { sessionManager, setSessionManager } = useSessionStore();
  
  // Initialize session manager
  useEffect(() => {
    const authHeader = getAuthHeader();
    if (authHeader && !sessionManager) {
      setSessionManager(new SessionManager(authHeader));
    }
  }, [getAuthHeader, sessionManager, setSessionManager]);

  // Unwrap params using React.use()
  const { courseName: courseId, groupId } = use(params);
  const decodedCourseId = decodeURIComponent(courseId);
  const decodedGroupId = decodeURIComponent(groupId);
  const { getGroupSessions, getMentorUserNameByPhone, getMentorEmailByPhone } = useAdminAuthStore();
  // const [course, setCourse] = useState<Course | null>(null);
  const [group, setGroup] = useState<MentorshipGroup | null>(null);
  const [groupSessions, setGroupSessions] = useState<GroupMentorshipSession[]>([]);

  // State to track sessions marked for deletion
  const [sessionsToDelete, setSessionsToDelete] = useState<string[]>([]);

  useEffect(() => {
    const loadGroupSessions = () => {
      setLoading(true);
      setError(null);
      const groupSessions = getGroupSessions(decodedCourseId, decodedGroupId);
      if (groupSessions && groupSessions.length > 0) {
        setGroupSessions(groupSessions);
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
  }, [decodedGroupId, decodedCourseId, getGroupSessions]);

  useEffect(() => {
    const fetchCurrentGroup = async () => {
      const group = await getGroupById(decodedGroupId, getAuthHeader()||'');
      setGroup(group);
    };
    fetchCurrentGroup();
  }, [decodedGroupId]);

  const handleBackClick = () => {
    router.push(`/admin/dashboard/courses/${encodeURIComponent(decodedCourseId)}/details`);
  };

  const handleEditModeToggle = () => {
    if (!isEditMode) {
      // Entering edit mode - initialize edited sessions
      setEditedSessions(groupSessions);
      // Reset sessions to delete
      setSessionsToDelete([]);
    }
    setIsEditMode(!isEditMode);
  };

  const handleAddSession = () => {
    // Adding sessions only allowed when not in edit mode
    if (!isEditMode) {
      setIsCreateModalOpen(true);
    }
  };

  const handleDeleteSession = (sessionId: string) => {
    // Delete operation only works in edit mode
    if (isEditMode) {
      // Add session ID to the list of sessions to delete
      setSessionsToDelete(prev => [...prev, sessionId]);
      
      // Remove the session from the edited sessions displayed in UI
      setEditedSessions(prev => prev.filter(session => session.sessionId !== sessionId));
    }
  };

  const handleSessionFormSubmit = async (formData: SessionFormData) => {
    
    const newSession: GroupMentorshipSession = {
      sessionId: '',
      mentorName: getMentorUserNameByPhone(formData.mentorId) || formData.mentorId,
      mentorUserName: formData.mentorId,
      mentorEmail: getMentorEmailByPhone(formData.mentorId) || formData.mentorId,
      date: formData.date,
      startTime: formatTimeToHHMM(formData.startTime),
      endTime: formatTimeToHHMM(formData.endTime),
      name: formData.name,
      description: formData.description
    };

    try {
      const request: BulkMentorshipGroupCreateOrUpdateRequest = {
        sessions: [newSession]
      };
      const response = await sessionManager?.addCourseGroupSessions(decodedCourseId, decodedGroupId, request);
      if (response) {
        setGroupSessions(prev => [...prev, ...response.sessions]);
        setSessions(sessions => [...sessions, ...response.sessions.map(convertToSession)]);
      }
      
      toast.success('Session created successfully');
    } catch (error) {
      console.error('Error creating session:', error);
      toast.error('Failed to create session');
    }
    
    setIsCreateModalOpen(false);
  };

  const handleSaveChanges = async () => {
    try {
      // Only proceed if there are sessions to delete
      if (sessionsToDelete.length > 0) {
        const request: DeleteGroupSessionsRequest = {
          sessionIds: sessionsToDelete
        };
        
        await sessionManager?.deleteGroupSessions(decodedGroupId, request);
        
        // Update local state after successful deletion
        // Filter out deleted sessions from the original groupSessions
        const updatedGroupSessions = groupSessions.filter(
          session => !sessionsToDelete.includes(session.sessionId)
        );
        
        setGroupSessions(updatedGroupSessions);
        setSessions(updatedGroupSessions.map(convertToSession));
        
        toast.success(`${sessionsToDelete.length} sessions deleted successfully`);
      } else {
        toast.success('No sessions were marked for deletion');
      }
      
      // Reset edit mode and clear deletion tracking
      setIsEditMode(false);
      setSessionsToDelete([]);
    } catch (error) {
      console.error('Error saving changes:', error);
      toast.error('Failed to delete sessions');
    }
  };

  const handleCancelEdit = () => {
    setEditedSessions(groupSessions);
    setSessionsToDelete([]);
    setIsEditMode(false);
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
            {group?.groupFriendlyName} Sessions
          </h1>
        </div>
        <div className="flex items-center space-x-3">
          {isEditMode ? (
            <>
              <button
                onClick={handleCancelEdit}
                className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                <XMarkIcon className="h-5 w-5 mr-2" />
                Cancel
              </button>
              <button
                onClick={handleSaveChanges}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                <CheckIcon className="h-5 w-5 mr-2" />
                Save Changes
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleAddSession}
                className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Add Session
              </button>
              <button
                onClick={handleEditModeToggle}
                className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
              >
                <PencilIcon className="h-5 w-5 mr-2" />
                Edit Sessions
              </button>
            </>
          )}
        </div>
      </div>

      {isEditMode && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <InformationCircleIcon className="h-5 w-5 text-blue-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                You are in edit mode. Click the trash icon to delete sessions, then save your changes.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(isEditMode ? editedSessions.map(convertToSession) : sessions).map((session) => (
          <div key={session.id} className="relative">
            <SessionCard session={session} />
            {isEditMode && (
              <button
                onClick={() => handleDeleteSession(session.id)}
                className="absolute top-2 right-2 p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            )}
          </div>
        ))}
      </div>

      {sessions.length === 0 && !isEditMode && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <h3 className="mt-2 text-sm font-medium text-gray-900">No Sessions</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new session for this group.
          </p>
          <div className="mt-6">
            <button
              onClick={handleAddSession}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Session
            </button>
          </div>
        </div>
      )}
      
      {editedSessions.length === 0 && isEditMode && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <h3 className="mt-2 text-sm font-medium text-gray-900">No Sessions</h3>
          <p className="mt-1 text-sm text-gray-500">
            You have deleted all sessions. Click "Save Changes" to confirm deletion or "Cancel" to revert.
          </p>
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