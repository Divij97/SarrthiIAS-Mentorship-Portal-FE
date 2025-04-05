'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Course } from '@/types/course';
import CourseListItem from './CourseListItem';
import { fetchCourses } from '@/services/courses';
import { useAdminAuthStore } from '@/stores/auth/admin-auth-store';

export default function ActiveCourses() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addCourse } = useAdminAuthStore();
  const adminData = useAdminAuthStore.getState().adminData;
  const authHeader = useAdminAuthStore((state) => state.getAuthHeader)();
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    // If we already have courses in the admin store, use those
    if (adminData?.courses?.length) {
      // Filter out retired courses
      const activeCourses = adminData.courses.filter(course => !course.retired && !course.isOneOnOneMentorshipCourse);
      setCourses(activeCourses);
      setLoading(false);
      return;
    }

    const loadCourses = async () => {
      if (!authHeader) {
        setError('Authentication required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Fetch courses from the backend API
        const coursesData = await fetchCourses('admin', authHeader);
        console.log('Fetched courses data:', coursesData);
        
        // Ensure coursesData is an array and filter out retired courses
        const validCoursesData = Array.isArray(coursesData) 
          ? coursesData.filter(course => !course.retired)
          : [];
        
        // Update local state
        setCourses(validCoursesData);
        
        // Update admin store if needed
        if (!adminData || !adminData.courses) {
          // Add each course to the admin store
          validCoursesData.forEach(course => {
            addCourse(course);
          });
        }
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to load courses. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, [authHeader, adminData, addCourse]);

  const handleCourseSelect = (course: Course) => {
    router.push(`/admin/dashboard/courses/${encodeURIComponent(course.id)}/details`);
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

  if (!courses.length) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">No active courses found</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {courses.map((course) => (
        <CourseListItem
          key={course.id || Math.random().toString()}
          course={course}
          onSelect={() => handleCourseSelect(course)}
        />
      ))}
    </div>
  );
} 