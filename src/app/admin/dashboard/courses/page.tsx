'use client';

import { useState } from 'react';
import CourseForm from '@/components/Admin/CourseForm';
import ActiveCourses from '@/components/Admin/ActiveCourses';

export default function CoursesPage() {
  const [showActiveCourses, setShowActiveCourses] = useState(false);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900">Courses Management</h2>
      {showActiveCourses ? (
        <div>
          <button
            onClick={() => setShowActiveCourses(false)}
            className="mb-6 text-orange-600 hover:text-orange-700 font-medium flex items-center"
          >
            ← Back to Course Creation
          </button>
          <ActiveCourses />
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Create New Course</h3>
          <CourseForm onViewActiveCourses={() => setShowActiveCourses(true)} />
        </div>
      )}
    </div>
  );
} 