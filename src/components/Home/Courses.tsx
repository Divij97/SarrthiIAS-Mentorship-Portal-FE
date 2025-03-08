'use client';

import { useState, useEffect } from 'react';
import { useLoginStore } from '@/stores/auth/store';
import { useMenteeStore } from '@/stores/mentee/store';
import { fetchCourses } from '@/services/courses';
import CourseTile from '@/components/Courses/CourseTile';

export default function Courses() {
  const [selectedCourseName, setSelectedCourseName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
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
    setSelectedCourseName(courseName);
  };

  const handleBackToCourses = () => {
    setSelectedCourseName(null);
  };

  const renderCourseDetail = () => {
    const course = courses.find(c => c.name === selectedCourseName);
    if (!course) return null;

    const endDate = new Date(course.endDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return (
      <div className="bg-white rounded-lg shadow-lg p-8">
        <button
          onClick={handleBackToCourses}
          className="mb-6 text-orange-600 hover:text-orange-700 font-medium flex items-center"
        >
          ← Back to Courses
        </button>
        <h1 className="text-3xl font-bold text-gray-900">{course.name}</h1>
        <p className="mt-4 text-gray-600">{course.description}</p>
        <div className="mt-6 space-y-2">
          <p className="text-sm text-gray-500">
            Course Type: {course.isOneOnOneMentorshipCourse ? 'One-on-One Mentorship' : 'Group Mentorship'}
          </p>
          <p className="text-sm text-gray-500">
            End Date: {endDate}
          </p>
        </div>
      </div>
    );
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

  if (selectedCourseName) {
    return renderCourseDetail();
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