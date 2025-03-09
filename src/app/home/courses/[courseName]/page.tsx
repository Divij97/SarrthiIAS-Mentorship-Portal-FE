'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useMenteeStore } from '@/stores/mentee/store';
import { useLoginStore } from '@/stores/auth/store';
import { useSessionsStore } from '@/stores/sessions/store';
import { fetchSessions } from '@/services/sessions';
import SessionDetails from '@/components/Home/SessionDetails';

export default function CourseDetailsPage({
  params,
}: {
  params: Promise<{ courseName: string }>;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { courses } = useMenteeStore();
  const { authHeader, phone, userType } = useLoginStore();
  const { sessions, setSessions } = useSessionsStore();
  
  const { courseName } = use(params);
  const decodedCourseName = decodeURIComponent(courseName);
  const course = courses.find(c => c.name === decodedCourseName);

  useEffect(() => {
    const loadSessions = async () => {
      // If we already have sessions data, don't fetch again
      if (Object.keys(sessions.sessionsByDate).length > 0) return;
      
      // Check for required data
      if (!authHeader || !phone || !userType) {
        setError('Authentication details not found');
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetchSessions(phone, userType, authHeader);
        if (response) {
          setSessions(response);
        } else {
          setError('Sessions not found.');
        }
      } catch (err) {
        console.error('Failed to load sessions:', err);
        setError('Failed to load sessions. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    loadSessions();
  }, [authHeader, phone, userType, sessions.sessionsByDate.length, setSessions]);

  if (!course) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-red-600">Course not found</div>
      </div>
    );
  }

  const endDate = new Date(course.endDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handleBackToCourses = () => {
    router.push('/home/courses');
  };

  return (
    <div className="space-y-8">
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

      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Sessions</h2>
        {isLoading ? (
          <div className="text-center py-8">
            <div className="text-gray-600">Loading sessions...</div>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <div className="text-red-600">{error}</div>
          </div>
        ) : (
          <SessionDetails />
        )}
      </div>
    </div>
  );
} 