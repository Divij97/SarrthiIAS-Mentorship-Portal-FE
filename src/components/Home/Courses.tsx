'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMenteeStore } from '@/stores/mentee/store';
import CourseTile from '@/components/Courses/CourseTile';

export default function Courses() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { courses } = useMenteeStore();

  const handleCourseClick = (courseName: string) => {
    // Navigate to course-specific route
    router.push(`/home/courses/${encodeURIComponent(courseName)}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-600">Loading courses...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Enrolled Courses</h1>
        <p className="text-lg text-gray-600">Access your UPSC preparation courses</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(course => (
          <CourseTile 
            key={course.course.id} 
            enrolledCourseInfo={course} 
            onClick={handleCourseClick}
            assignedGroup={course.assignedGroup}
          />
        ))}
      </div>

      {courses.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-gray-600">Any courses you have enrolled in will appear here. Revisit this page after some time to access your subscribed courses.</p>
        </div>
      )}
    </div>
  );
} 