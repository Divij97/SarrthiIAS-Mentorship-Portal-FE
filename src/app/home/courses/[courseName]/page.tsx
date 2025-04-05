'use client';

import { use, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMenteeStore } from '@/stores/mentee/store';
import { useLoginStore } from '@/stores/auth/store';
import { getGroupById, bookOnDemandSession } from '@/services/mentee';
import { GroupMentorshipSession } from '@/types/session';
import { VideoCameraIcon, ClockIcon } from '@heroicons/react/24/outline';
import MenteeSessions from '@/components/Courses/MenteeSessions';
import { toast } from 'react-hot-toast';
import CourseDocuments from '@/components/Courses/CourseDocuments';

export default function CourseDetailsPage({
  params,
}: {
  params: Promise<{ courseName: string }>;
}) {
  const router = useRouter();
  const { courseName } = use(params);
  const courseId = decodeURIComponent(courseName);
  const { getGroupIdByCourseName } = useMenteeStore();
  const authHeader = useLoginStore((state) => state.getAuthHeader());
  const [groupSessions, setGroupSessions] = useState<GroupMentorshipSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // First get the raw courses data from the store
  const rawCourses = useMenteeStore((state) => state.courses);
  const mentorshipSessions = useMenteeStore((state) => state.menteeResponse?.mentorshipSessions);
  const mentor = useMenteeStore((state) => state.menteeResponse?.assignedMentor);
  // Then memoize the transformation
  const courses = useMemo(() => 
    rawCourses.map(c => c.course),
    [rawCourses]
  );
  
  const course = courses.find(c => c.id === courseId);

  useEffect(() => {
    const fetchGroupSessions = async () => {
      if (!course || course.isOneOnOneMentorshipCourse || !authHeader) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const groupId = getGroupIdByCourseName(courseId);
        
        if (!groupId || groupId === "UNASSIGNED") {
          setLoading(false);
          return;
        }

        const groupData = await getGroupById(groupId, authHeader);
        console.log('groupData', groupData);
        setGroupSessions(groupData.sessions || []);
      } catch (err) {
        console.error('Error fetching group sessions:', err);
        setError('Failed to load group sessions');
      } finally {
        setLoading(false);
      }
    };

    fetchGroupSessions();
  }, [courseId, course, authHeader, getGroupIdByCourseName]);

  if (!course) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-red-600">Course not found</div>
      </div>
    );
  }

  const parseDate = (dateStr: string) => {
    const [day, month, year] = dateStr.split('/');
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  };

  const endDate = parseDate(course.endDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handleBackToCourses = () => {
    router.push('/home/courses');
  };

  const formatDate = (dayOfMonth: number) => {
    const today = new Date();
    const date = new Date(today.getFullYear(), today.getMonth(), dayOfMonth);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
            Course ends at: {endDate}
          </p>
        </div>

        {/* Course Documents Section */}
        {course.documents && <CourseDocuments documents={course.documents} />}

        {course.isOneOnOneMentorshipCourse && (
          <div className="mt-6">
            <button
              disabled={true}
              onClick={async () => {
                try {
                  await bookOnDemandSession(mentor||null, authHeader || '');
                  toast.success('Your request for on demand session is placed. Your mentor will update with session details soon. Kindly check the portal for updated session in a few minutes.', {
                    duration: 5000,
                    position: 'top-right',
                  });
                } catch (error) {
                  toast.error('Failed to book on demand session. Please try again.', {
                    duration: 3000,
                    position: 'top-right',
                  });
                }
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-gray-400 bg-gray-200 cursor-not-allowed"
            >
              Book On Demand Session with Mentor
            </button>
            <p className="mt-2 text-xs text-gray-500 italic">
              This feature is temporarily unavailable
            </p>
          </div>
        )}
      </div>

      {loading ? (
        <div className="bg-white rounded-lg shadow-lg p-8">
          <p className="text-gray-500">Loading sessions...</p>
        </div>
      ) : error ? (
        <div className="bg-white rounded-lg shadow-lg p-8">
          <p className="text-red-500">{error}</p>
        </div>
      ) : course.isOneOnOneMentorshipCourse ? (
        mentorshipSessions && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="border-b border-gray-200 pb-4 mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">Course Schedule</h2>
              <p className="mt-2 text-sm text-gray-500">
                You have {Object.keys(mentorshipSessions).length} mentorship sessions scheduled
              </p>
            </div>
            <MenteeSessions sessions={mentorshipSessions} />
          </div>
        )
      ) : groupSessions.length > 0 ? (
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="border-b border-gray-200 pb-4 mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Group Sessions</h2>
            <p className="mt-2 text-sm text-gray-500">
              You have {groupSessions.length} group sessions scheduled
            </p>
          </div>
          <div className="space-y-4">
            {groupSessions.map((session) => (
              <div key={session.sessionId} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Group Session</h3>
                    <p className="text-sm text-gray-500 mt-1">Mentor: {session.mentorUserName}</p>
                  </div>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Scheduled
                  </span>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <ClockIcon className="h-4 w-4 mr-2" />
                    <span>{formatDate(session.dateOfSession)} • {session.startTime} - {session.endTime}</span>
                  </div>
                  {session.zoomLink && (
                    <div className="flex items-center text-sm">
                      <VideoCameraIcon className="h-4 w-4 mr-2 text-gray-500" />
                      <a href={session.zoomLink} target="_blank" rel="noopener noreferrer" 
                        className="text-blue-600 hover:text-blue-800">
                        Join Meeting
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg p-8">
          <p className="text-gray-500">No sessions scheduled yet.</p>
        </div>
      )}
    </div>
  );
} 