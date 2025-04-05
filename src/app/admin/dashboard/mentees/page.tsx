'use client';

import { useAdminAuthStore } from '@/stores/auth/admin-auth-store';
import { RegisterMenteeModal } from '@/components/app/admin/mentees/register-mentee-modal';
import MenteesList from '@/components/Admin/mentees/MenteesList';

export default function MenteesPage() {
  const { adminData, getCourseGroups } = useAdminAuthStore();

  if (!adminData) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  // Extract courses from adminData
  const courses = adminData.courses?.map(course => ({
    id: course.id,
    name: course.name
  })) || [];

  // Get all groups from all courses
  const groups = courses.flatMap(course => {
    const courseGroups = getCourseGroups(course.id) || [];
    return courseGroups.map(group => ({
      groupId: group.groupId,
      groupFriendlyName: group.groupFriendlyName,
      course: course.id
    }));
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-900">Mentees Management</h2>
        <RegisterMenteeModal />
      </div>
      
      <MenteesList courses={courses} groups={groups} />
    </div>
  );
} 