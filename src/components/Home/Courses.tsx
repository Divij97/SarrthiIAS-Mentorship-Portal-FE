'use client';

import { useState } from 'react';
import { sampleCourses } from '@/types/course';
import CourseTile from '@/components/Courses/CourseTile';

export default function Courses() {
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  const handleCourseClick = (courseId: string) => {
    setSelectedCourseId(courseId);
  };

  const handleBackToCourses = () => {
    setSelectedCourseId(null);
  };

  const renderCourseDetail = () => {
    const course = sampleCourses.find(c => c.id === selectedCourseId);
    if (!course) return null;

    return (
      <div className="bg-white rounded-lg shadow-lg p-8">
        <button
          onClick={handleBackToCourses}
          className="mb-6 text-orange-600 hover:text-orange-700 font-medium flex items-center"
        >
          ← Back to Courses
        </button>
        <h1 className="text-3xl font-bold text-gray-900">{course.name}</h1>
      </div>
    );
  };

  if (selectedCourseId) {
    return renderCourseDetail();
  }

  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Enrolled Courses</h1>
        <p className="text-lg text-gray-600">Access your UPSC preparation courses</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sampleCourses.map(course => (
          <CourseTile 
            key={course.id} 
            course={course} 
            onClick={handleCourseClick}
          />
        ))}
      </div>

      {sampleCourses.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">You haven't enrolled in any courses yet.</p>
        </div>
      )}
    </div>
  );
} 