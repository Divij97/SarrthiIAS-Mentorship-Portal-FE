import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useRouter } from 'next/navigation';
import { MentorshipSession } from '@/types/session';
import { useMenteeStore } from '@/stores/mentee/store';
import { useLoginStore } from '@/stores/auth/store';
import { SubmitFeedbackRequest } from '@/types/mentee';
import { submitFeedback } from '@/services/mentee';
import { toast } from 'react-hot-toast';
import { StrippedDownMentor } from '@/types/mentor';

interface PendingFeedbackModalProps {
  isOpen: boolean;
  pendingFeedbacks: MentorshipSession[];
  courseName: string;
}

export default function PendingFeedbackModal({
  isOpen,
  pendingFeedbacks,
  courseName,
}: PendingFeedbackModalProps) {
  const router = useRouter();
  const pastSessions = useMenteeStore((state) => state.pastSessions);
  const dismissedSessions = useMenteeStore((state) => state.dismissedSessions);
  const dismissSession = useMenteeStore((state) => state.dismissSession);
  const menteeResponse = useMenteeStore((state) => state.menteeResponse);
  const authHeader = useLoginStore((state) => state.getAuthHeader());

  const handleFeedbackClick = (sessionDate: string) => {
    router.push(`/home/courses/${courseName}/session-feedback?sessionDate=${sessionDate}&courseName=${courseName}`);
  };

  const handleDismissSession = async (sessionId: string) => {
    if (!menteeResponse) {
      toast.error('Unable to submit feedback. Please try again later.');
      return;
    }

    try {
      const sessionDate = getSessionDate(sessionId);
      const submitFeedbackRequest: SubmitFeedbackRequest = {
        mentor: menteeResponse.assignedMentor,
        mentee: {
          n: menteeResponse.mentee.n,
          p: menteeResponse.mentee.p,
          e: menteeResponse.mentee.e,
          iu: menteeResponse.mentee.iu,
        },
        feedback: {
          sessionDate,
          rating: 0,
          additionalComments: 'Session not attended',
          satisfied: false,
          examKnowledge: 0,
          politeness: 'Polite',
          delayed: false,
          attended: false
        }
      };

      await submitFeedback(submitFeedbackRequest, authHeader || '');
      dismissSession(sessionId);
      toast.success('Session marked as not attended');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('Failed to mark session as not attended. Please try again.');
    }
  };

  // Helper function to parse dd/mm/yyyy date string to Date object
  const parseDate = (dateStr: string): Date => {
    const [day, month, year] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day); // month is 0-based in JavaScript Date
  };

  // Helper function to find session date from past sessions
  const getSessionDate = (sessionId: string): string => {
    // Search through all dates in pastSessions
    for (const [date, sessions] of Object.entries(pastSessions)) {
      const session = sessions.find(s => s.id === sessionId);
      if (session) {
        console.log("Found session with date ", date);
        return date;
      }
    }
    // Fallback to session's own date if not found in past sessions
    return sessionId;
  };

  // Helper function to format date for display
  const formatDate = (dateStr: string): string => {
    try {
      const date = parseDate(dateStr);
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error parsing date:', dateStr, error);
      return dateStr; // Return original string if parsing fails
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => {}}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-75" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-xl font-semibold leading-6 text-gray-900 mb-4"
                >
                  Pending Session Feedbacks Required
                </Dialog.Title>

                <div className="mt-4">
                  <p className="text-gray-600 mb-6">
                    You have pending feedback submissions for your past sessions. Please provide feedback for these sessions before proceeding.
                  </p>

                  <div className="space-y-4">
                    {pendingFeedbacks
                      .filter(session => !dismissedSessions.has(session.id))
                      .map((session) => {
                      const sessionDate = getSessionDate(session.id);
                      return (
                        <div
                          key={session.id}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                        >
                          <div>
                            <p className="font-medium text-gray-900">
                              Session Date: {formatDate(sessionDate)}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              {session.st} - {session.et}
                            </p>
                          </div>
                          <div className="flex gap-3">
                            <button
                              onClick={() => handleDismissSession(session.id)}
                              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                            >
                              I haven't attended
                            </button>
                            <button
                              onClick={() => handleFeedbackClick(sessionDate)}
                              className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                            >
                              Submit Feedback
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {pendingFeedbacks.filter(session => !dismissedSessions.has(session.id)).length === 0 && (
                    <p className="mt-6 text-sm text-gray-500">
                      All sessions have been handled. You can now proceed with the course.
                    </p>
                  )}

                  {pendingFeedbacks.filter(session => !dismissedSessions.has(session.id)).length > 0 && (
                    <p className="mt-6 text-sm text-gray-500 italic">
                      Note: You must either submit feedback or mark sessions as not attended before you can access the course content.
                    </p>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
} 