'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLoginStore } from '@/stores/auth/store';
import { useMenteeStore } from '@/stores/mentee/store';
import { fetchCourses } from '@/services/courses';
import CourseTile from '@/components/Courses/CourseTile';

export default function Courses() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  
  const { authHeader, phone } = useLoginStore();
  const { courses, setCourses } = useMenteeStore();

  useEffect(() => {
    const loadCourses = async () => {
      // Early return conditions
      if (courses.length > 0) return; // Don't fetch if we already have courses
      if (!authHeader || !phone) {
        setError('Please log in to view your courses.');
        return;
      }
      
      try {
        setIsLoading(true);
        setError(null);
        
        console.log('Fetching courses with phone:', phone);
        const response = await fetchCourses(phone, authHeader);
        console.log('Courses data:', response);
        setCourses(response);
      } catch (err) {
        console.error('Failed to load courses:', err);
        setError('Failed to load courses. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    loadCourses();
  }, [authHeader, phone, courses.length, setCourses]);

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
            key={course.name} 
            course={course} 
            onClick={handleCourseClick}
          />
        ))}
      </div>

      {courses.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-gray-600">You haven't enrolled in any courses yet.</p>
        </div>
      )}
    </div>
  );
} 