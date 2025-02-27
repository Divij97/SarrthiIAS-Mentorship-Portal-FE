'use client';

import CourseForm from '@/components/Admin/CourseForm';

export default function CreateCoursePage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900">Create New Course</h2>
      <div className="bg-white shadow rounded-lg p-6">
        <CourseForm />
      </div>
    </div>
  );
} 