'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { Course, CourseGroup } from '@/types/course';
import { MentorshipGroup, MentorshipGroupsResponse } from '@/types/session';
import { UserGroupIcon, ArrowLeftIcon, UserIcon, CheckCircleIcon, XCircleIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { fetchCourseGroups } from '@/services/courses';
import { useLoginStore } from '@/stores/auth/store';
import { useAdminStore } from '@/stores/admin/store';

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
  const { authHeader, setCourseGroups, getCourseGroups } = useAdminStore();

  useEffect(() => {
    const fetchGroups = async () => {
      if (!authHeader) {
        setError('Authentication required');
        setLoading(false);
        return;
      }

      // First, check if we already have the groups in the store
      const cachedGroups = getCourseGroups(decodedCourseName);
      if (cachedGroups && cachedGroups.length > 0) {
        console.log('Using cached mentorship groups for:', decodedCourseName);
        setGroups(cachedGroups);
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

    fetchGroups();
  }, [decodedCourseName, authHeader, setCourseGroups, getCourseGroups]);

  const handleBackToCourses = () => {
    router.push('/admin/dashboard/courses/active');
  };

  const handleGroupClick = (groupId: string) => {
    // Navigate to group details page
    router.push(`/admin/dashboard/courses/${encodeURIComponent(decodedCourseName)}/groups/${groupId}`);
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
        </div>
        <button
          onClick={() => {/* Handle creating new group */}}
          className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors duration-200"
        >
          Create New Group
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <p className="text-gray-500">Loading groups...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <XCircleIcon className="mx-auto h-12 w-12 text-red-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Error</h3>
          <p className="mt-1 text-sm text-red-500">{error}</p>
        </div>
      ) : (
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
                Get started by creating a new group.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
} 