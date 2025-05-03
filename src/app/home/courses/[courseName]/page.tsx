'use client';

import { use, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMenteeStore } from '@/stores/mentee/store';
import { useLoginStore } from '@/stores/auth/store';
import { getGroupById, bookOnDemandSession, getPastSessions } from '@/services/mentee';
import { GroupMentorshipSession, RecurrenceType } from '@/types/session';
import { VideoCameraIcon, ClockIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import MenteeSessions from '@/components/Courses/MenteeSessions';
import { toast } from 'react-hot-toast';
import CourseDocuments from '@/components/Courses/CourseDocuments';
import { Tab } from '@headlessui/react';
import PastSessions from '@/components/Home/PastSessions';

export default function CourseDetailsPage({
  params,
}: {
  params: Promise<{ courseName: string }>;
}) {
  const router = useRouter();
  const { courseName } = use(params);
  const courseId = decodeURIComponent(courseName);
  const { getGroupIdByCourseName, refreshSessions, setPastSessions, pastSessions } = useMenteeStore();
  const authHeader = useLoginStore((state) => state.getAuthHeader());
  const [groupSessions, setGroupSessions] = useState<GroupMentorshipSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const [showFeedbackTooltip, setShowFeedbackTooltip] = useState(false);
  
  // First get the raw courses data from the store
  const rawCourses = useMenteeStore((state) => state.courses);
  const mentorshipSessions = useMenteeStore((state) => state.menteeResponse?.mentorshipSessions);
  const mentor = useMenteeStore((state) => state.menteeResponse?.assignedMentor);

  // Then memoize the transformation
  const courses = useMemo(() => 
    rawCourses.map(c => c.course),
    [rawCourses]
  );

  useEffect(() => {
    const fetchPastSessions = async () => {
      try {
        const pastSessionsResponse = await getPastSessions(authHeader || '');
        setPastSessions(pastSessionsResponse.sessionsByDate);
        console.log('pastSessions loaded', pastSessionsResponse.sessionsByDate);
      } catch (error) {
        console.error('Error fetching past sessions:', error);
      } finally {
        setLoading(false);
      }
    };

    if (course?.isOneOnOneMentorshipCourse) {
      fetchPastSessions();
    }
  }, [authHeader, setPastSessions]);

  const formatRecurrenceType = (type: RecurrenceType): string => {
    switch (type) {
      case RecurrenceType.WEEKLY:
        return 'Weekly';
      case RecurrenceType.BI_WEEKLY:
        return 'Bi-Weekly';
      default:
        return type;
    }
  };
  
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
    // Check if date is in dd/mm/yyyy format
    if (dateStr.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
      const [day, month, year] = dateStr.split('/').map(Number);
      return new Date(year, month - 1, day);
    }
    // Fallback to direct parsing for other formats
    return new Date(dateStr);
  };

  const endDate = parseDate(course.endDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handleBackToCourses = () => {
    router.push('/home/courses');
  };

  const formatDate = (dateStr: string) => {
    let date;
    
    // Check if it's in dd/mm/yyyy format
    if (dateStr.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
      const [day, month, year] = dateStr.split('/').map(Number);
      date = new Date(year, month - 1, day);
    } 
    // Check if it's in YYYY-MM-DD format
    else if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
      date = new Date(dateStr);
    }
    // Fallback to treating as ISO
    else {
      date = new Date(dateStr);
    }
    
    // Format the date
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleSessionsRefresh = async () => {
    try {
      await refreshSessions(authHeader || '');
    } catch (error) {
      console.error('Error refreshing sessions:', error);
    }
  };

  const handleSubmitFeedbackClick = () => {
    setSelectedTab(1); // Switch to Past Sessions tab
    setShowFeedbackTooltip(true);
    // Hide tooltip after 5 seconds
    setTimeout(() => setShowFeedbackTooltip(false), 5000);
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
            Course Type: {course.isOneOnOneMentorshipCourse ? 'One-on-One Mentorship' : 'Group Mentorship'} {course.recurrenceType ? `(Sessions held: ${formatRecurrenceType(course.recurrenceType)})` : ''}
            {course.isOneOnOneMentorshipCourse && (
              <span className="block mt-1">
                {mentor != null && (mentor.name !== undefined || mentor.email !== undefined)? `Your Mentor: ${mentor.name} (${mentor.email})` : `You'll be assigned a mentor shortly.`}
              </span>
            )}
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
        mentorshipSessions ? (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="border-b border-gray-200 pb-4 mb-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">Course Schedule</h2>
                  <p className="mt-2 text-sm text-gray-500">
                    You have {Object.keys(mentorshipSessions).length} mentorship sessions scheduled
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleSubmitFeedbackClick}
                    className="flex items-center px-3 py-2 text-sm font-medium rounded-md bg-orange-100 text-orange-700 hover:bg-orange-200"
                  >
                    Submit Feedback
                  </button>
                  <button
                    onClick={handleSessionsRefresh}
                    className="flex items-center px-3 py-2 text-sm font-medium rounded-md bg-orange-100 text-orange-700 hover:bg-orange-200"
                  >
                    <ArrowPathIcon className="h-4 w-4 mr-2" />
                    Refresh
                  </button>
                </div>
              </div>
            </div>
            <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
              <Tab.List className="flex space-x-1 rounded-xl bg-orange-100/20 p-1 mb-6">
                <Tab
                  className={({ selected }) =>
                    `w-full rounded-lg py-2.5 text-sm font-medium leading-5
                    ${selected
                      ? 'bg-white text-orange-700 shadow'
                      : 'text-gray-600 hover:bg-white/[0.12] hover:text-orange-600'
                    }`
                  }
                >
                  Upcoming Sessions
                </Tab>
                <Tab
                  className={({ selected }) =>
                    `w-full rounded-lg py-2.5 text-sm font-medium leading-5
                    ${selected
                      ? 'bg-white text-orange-700 shadow'
                      : 'text-gray-600 hover:bg-white/[0.12] hover:text-orange-600'
                    }`
                  }
                >
                  Past Sessions
                </Tab>
              </Tab.List>
              <Tab.Panels>
                <Tab.Panel>
                  <MenteeSessions 
                    sessions={mentorshipSessions} 
                    mentor={mentor}
                  />
                </Tab.Panel>
                <Tab.Panel>
                  <div className="relative">
                    {showFeedbackTooltip && (
                      <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-white p-4 rounded-lg shadow-lg border border-orange-200 z-10">
                        <div className="text-sm text-gray-700">
                          Click on the "Submit Feedback" button next to any past session to provide your feedback.
                        </div>
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-3 h-3 bg-white border-r border-b border-orange-200"></div>
                      </div>
                    )}
                    <PastSessions 
                      courseName={courseId} 
                      pastSessions={pastSessions}
                    />
                  </div>
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </div>
        ) : (
          <div className="flex justify-between items-center bg-white rounded-lg shadow-lg p-8">
            <p className="text-gray-500">No sessions scheduled yet.</p>
            <button
              onClick={handleSessionsRefresh}
              className="flex items-center px-3 py-2 text-sm font-medium rounded-md bg-orange-100 text-orange-700 hover:bg-orange-200"
            >
              <ArrowPathIcon className="h-4 w-4 mr-2" />
              Refresh
            </button>
          </div>
        )
      ) : getGroupIdByCourseName(courseId) === "UNASSIGNED" ? (
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="border-b border-gray-200 pb-4 mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Group Sessions</h2>
          </div>
          <p className="text-gray-600">You will be assigned a group shortly.</p>
        </div>
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
                    <p className="text-sm text-gray-500 mt-1">Mentor Email: {session.mentorName}</p>
                  </div>
                  {/* <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Scheduled
                  </span> */}
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <ClockIcon className="h-4 w-4 mr-2" />
                    <span>{formatDate(session.date)} • {session.startTime} - {session.endTime}</span>
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