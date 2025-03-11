'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Course } from '@/types/course';
import CourseListItem from './CourseListItem';
import { useAdminStore } from '@/stores/admin/store';

export default function ActiveCourses() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { adminData } = useAdminStore();

  useEffect(() => {
    // Short delay to show loading state
    const timer = setTimeout(() => {
      setLoading(false);
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  const handleCourseSelect = (course: Course) => {
    router.push(`/admin/dashboard/courses/${encodeURIComponent(course.name)}/details`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading courses...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!adminData?.courses?.length) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">No active courses found</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {adminData.courses.map((course) => (
        <CourseListItem
          key={course.name}
          course={course}
          onSelect={() => handleCourseSelect(course)}
        />
      ))}
    </div>
  );
} 