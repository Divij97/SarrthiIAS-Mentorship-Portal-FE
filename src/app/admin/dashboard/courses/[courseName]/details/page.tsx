'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { MentorshipGroup, MentorshipGroupsResponse } from '@/types/session';
import { UserGroupIcon, ArrowLeftIcon, UserIcon, CheckCircleIcon, XCircleIcon, CalendarIcon, UserPlusIcon, UsersIcon } from '@heroicons/react/24/outline';
import { fetchCourseGroups, createMentorshipGroup } from '@/services/courses';
import { useAdminStore } from '@/stores/admin/store';
import GroupForm, { GroupFormData } from '@/components/Admin/GroupForm';
import { Course } from '@/types/course';

interface GroupCardProps {
  group: MentorshipGroup;
  onClick: () => void;
}

const GroupCard = ({ group, onClick }: GroupCardProps) => (
  <div 
    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
    onClick={onClick}
  >
    <div className="p-6">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <UserGroupIcon className="h-5 w-5 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900">Group {group.id}</h3>
          </div>
          <div className="flex items-center space-x-2 text-gray-500">
            <CalendarIcon className="h-4 w-4" />
            <span className="text-sm">{group.sessions.length} sessions</span>
          </div>
        </div>
        {group.sessions.length > 0 ? (
          <div className="flex items-center text-green-600">
            <CheckCircleIcon className="h-5 w-5" />
            <span className="ml-1 text-sm">Sessions Scheduled</span>
          </div>
        ) : (
          <div className="flex items-center text-red-600">
            <XCircleIcon className="h-5 w-5" />
            <span className="ml-1 text-sm">No Sessions</span>
          </div>
        )}
      </div>
    </div>
  </div>
);

export default function CourseDetailsPage({
  params,
}: {
  params: Promise<{ courseName: string }>;
}) {
  const router = useRouter();
  const { courseName } = use(params);
  const decodedCourseName = decodeURIComponent(courseName);
  const [groups, setGroups] = useState<MentorshipGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createGroupLoading, setCreateGroupLoading] = useState(false);
  const [createGroupError, setCreateGroupError] = useState<string | null>(null);
  const [assigningGroups, setAssigningGroups] = useState(false);
  const [groupsAssigned, setGroupsAssigned] = useState(false);
  const { authHeader, setCourseGroups, getCourseGroups, adminData, assignGroupsToCourse } = useAdminStore();
  
  // Find the current course to check its type
  const currentCourse = adminData?.courses?.find(course => course.name === decodedCourseName);
  const isOneOnOneCourse = currentCourse?.isOneOnOneMentorshipCourse || false;

  const fetchGroups = async () => {
    // If this is a one-on-one course, we don't need to fetch groups
    if (isOneOnOneCourse) {
      setLoading(false);
      return;
    }
    
    if (!authHeader) {
      setError('Authentication required');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching mentorship groups for:', decodedCourseName);
      const response = await fetchCourseGroups(decodedCourseName, authHeader);
      const mentorshipGroups = response.mentorshipGroups || [];
      
      // Store the groups in the admin store
      setCourseGroups(decodedCourseName, mentorshipGroups);
      
      // Update local state
      setGroups(mentorshipGroups);
    } catch (err) {
      console.error('Error fetching groups:', err);
      setError('Failed to load groups. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, [decodedCourseName, authHeader, setCourseGroups, getCourseGroups, isOneOnOneCourse]);

  const handleBackToCourses = () => {
    router.push('/admin/dashboard/courses/active');
  };

  const handleGroupClick = (groupId: string) => {
    // Navigate to group details page
    router.push(`/admin/dashboard/courses/${encodeURIComponent(decodedCourseName)}/groups/${groupId}`);
  };

  const handleCreateGroup = () => {
    setIsCreateModalOpen(true);
  };

  const handleAssignGroups = async () => {
    setAssigningGroups(true);
    try {
      if (!currentCourse) {
        throw new Error('Course information not available');
      }
      
      const response = await assignGroupsToCourse(decodedCourseName, authHeader!, currentCourse);
      console.log("Response from assignGroupsToCourse: ", response);
      // Notify user about successful request
      setError(null); // Clear any previous errors
      setGroupsAssigned(true);
      alert("Group assignment request has been received. Please check back after a few minutes about your request.");
    } catch (error) {
      console.error('Error assigning groups to course:', error);
      setError('Failed to assign groups. Please try again.');
    } finally {
      setAssigningGroups(false);
    }
  };

  const handleGroupFormSubmit = async (formData: GroupFormData) => {
    if (!authHeader) {
      setCreateGroupError('Authentication required');
      return;
    }

    try {
      setCreateGroupLoading(true);
      setCreateGroupError(null);
      
      // Call the API to create a new group
      await createMentorshipGroup(decodedCourseName, formData.groupId, authHeader);
      
      // Create a new group object
      const newGroup: MentorshipGroup = {
        id: formData.groupId,
        sessions: []
      };
      
      // Update local state
      const updatedGroups = [...groups, newGroup];
      setGroups(updatedGroups);
      
      // Update the store
      setCourseGroups(decodedCourseName, updatedGroups);
      
      // Close the modal
      setIsCreateModalOpen(false);
      
      console.log('Group created successfully:', formData.groupId);
    } catch (err) {
      console.error('Error creating group:', err);
      setCreateGroupError('Failed to create group. Please try again.');
    } finally {
      setCreateGroupLoading(false);
    }
  };

  // Render function to display one-on-one mentorship content
  const renderOneOnOneContent = () => {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-sm">
        <UsersIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">One-on-One Mentorship Course</h3>
        <p className="mt-1 text-sm text-gray-500">
          This is a one-on-one mentorship course. Group management is not available.
        </p>
        <p className="mt-3 text-sm text-gray-500">
          Mentors and mentees are matched individually for this course.
        </p>
      </div>
    );
  };

  // Render function to display group mentorship content
  const renderGroupContent = () => {
    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <GroupCard
              key={group.id}
              group={group}
              onClick={() => handleGroupClick(group.id)}
            />
          ))}
        </div>

        {groups.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No Groups</h3>
            <p className="mt-1 text-sm text-gray-500">
              Click "Assign Groups" to automatically create mentorship groups for this course.
            </p>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={handleBackToCourses}
            className="flex items-center text-orange-600 hover:text-orange-700 font-medium mb-4"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back to Courses
          </button>
          <h1 className="text-3xl font-bold text-gray-900">{decodedCourseName}</h1>
          {isOneOnOneCourse && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-2">
              One-on-One Course
            </span>
          )}
        </div>
        
        {/* Only show Assign Groups button for group courses with no groups */}
        {!loading && !error && !isOneOnOneCourse && groups.length === 0 && !groupsAssigned && (
          <button
            onClick={handleAssignGroups}
            className={`flex items-center px-4 py-2 ${assigningGroups || groupsAssigned ? 'bg-gray-400' : 'bg-orange-600 hover:bg-orange-700'} text-white rounded-md transition-colors duration-200`}
            disabled={assigningGroups || groupsAssigned}
          >
            <UserPlusIcon className="h-5 w-5 mr-2" />
            {assigningGroups ? 'Assigning...' : 'Assign Groups'}
          </button>
        )}
        
        {/* Show a message when groups have been assigned but not yet loaded */}
        {!loading && !error && !isOneOnOneCourse && groups.length === 0 && groupsAssigned && (
          <div className="text-sm text-green-600 font-medium">
            Assignment request received. Please refresh after a few minutes.
          </div>
        )}
        
        {/* Only show Create New Group button for group courses with existing groups */}
        {!loading && !error && !isOneOnOneCourse && groups.length > 0 && (
          <button
            onClick={handleCreateGroup}
            className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors duration-200"
            disabled={createGroupLoading}
          >
            {createGroupLoading ? 'Creating...' : 'Create New Group'}
          </button>
        )}
      </div>

      {createGroupError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {createGroupError}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <p className="text-gray-500">Loading course details...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <XCircleIcon className="mx-auto h-12 w-12 text-red-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Error</h3>
          <p className="mt-1 text-sm text-red-500">{error}</p>
        </div>
      ) : (
        // Conditionally render based on course type
        isOneOnOneCourse ? renderOneOnOneContent() : renderGroupContent()
      )}

      {!isOneOnOneCourse && (
        <GroupForm
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleGroupFormSubmit}
          courseName={decodedCourseName}
        />
      )}
    </div>
  );
} 