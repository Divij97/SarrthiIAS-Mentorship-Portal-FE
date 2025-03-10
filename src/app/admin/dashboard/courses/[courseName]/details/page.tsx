'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Course, CourseGroup, sampleCourseGroups } from '@/types/course';
import { UserGroupIcon, ArrowLeftIcon, UserIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

interface GroupCardProps {
  group: CourseGroup;
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
            <h3 className="text-lg font-medium text-gray-900">{group.name}</h3>
          </div>
          <div className="flex items-center space-x-2 text-gray-500">
            <UserIcon className="h-4 w-4" />
            <span className="text-sm">{group.menteeCount} mentees</span>
          </div>
        </div>
        {group.mentorAssigned ? (
          <div className="flex items-center text-green-600">
            <CheckCircleIcon className="h-5 w-5" />
            <span className="ml-1 text-sm">Mentor Assigned</span>
          </div>
        ) : (
          <div className="flex items-center text-red-600">
            <XCircleIcon className="h-5 w-5" />
            <span className="ml-1 text-sm">No Mentor</span>
          </div>
        )}
      </div>
    </div>
  </div>
);

export default function CourseDetailsPage({
  params,
}: {
  params: { courseName: string };
}) {
  const router = useRouter();
  const courseName = decodeURIComponent(params.courseName);
  const [groups, setGroups] = useState<CourseGroup[]>([]);

  useEffect(() => {
    // In a real app, this would be an API call
    const courseGroups = sampleCourseGroups[courseName] || [];
    setGroups(courseGroups);
  }, [courseName]);

  const handleBackToCourses = () => {
    router.push('/admin/dashboard/courses/active');
  };

  const handleGroupClick = (groupId: string) => {
    // Navigate to group details page
    router.push(`/admin/dashboard/courses/${encodeURIComponent(courseName)}/groups/${groupId}`);
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
          <h1 className="text-3xl font-bold text-gray-900">{courseName}</h1>
        </div>
        <button
          onClick={() => {/* Handle creating new group */}}
          className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors duration-200"
        >
          Create New Group
        </button>
      </div>

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
    </div>
  );
} 