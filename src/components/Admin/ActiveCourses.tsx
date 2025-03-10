'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Course, sampleCourses } from '@/types/course';
import CourseListItem from './CourseListItem';

export default function ActiveCourses() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API call with a slight delay
    const loadCourses = async () => {
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setCourses(sampleCourses);
        setLoading(false);
      } catch (err) {
        setError('Failed to load courses');
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  const handleCourseSelect = (course: Course) => {
    router.push(`/admin/dashboard/courses/${encodeURIComponent(course.name)}/details`);
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">Active Courses</h3>
        <div className="text-sm text-gray-500">
          {courses.length} course{courses.length !== 1 ? 's' : ''}
        </div>
      </div>
      
      {loading ? (
        <div className="text-center py-8">
          <div className="text-gray-500">Loading courses...</div>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <div className="text-red-500">{error}</div>
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-500">No active courses found</div>
        </div>
      ) : (
        <div className="space-y-4">
          {courses.map((course) => (
            <CourseListItem
              key={course.name}
              course={course}
              onSelect={handleCourseSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
} 