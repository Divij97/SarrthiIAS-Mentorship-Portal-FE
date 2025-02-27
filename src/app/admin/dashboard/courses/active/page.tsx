'use client';

import ActiveCourses from '@/components/Admin/ActiveCourses';

export default function ActiveCoursesPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900">Active Courses</h2>
      <ActiveCourses />
    </div>
  );
} 