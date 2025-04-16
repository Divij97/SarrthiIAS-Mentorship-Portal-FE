'use client';

import { useState } from 'react';
import { useMentorStore } from '@/stores/mentor/store';
import { MenteeScheduleTile } from '@/components/Home/MenteeScheduleTile';
import { StrippedDownMentee } from '@/types/mentee';
import { DateFormatDDMMYYYY, RecurringMentorshipSchedule } from '@/types/session';
import { createRecurringSchedule, sendOnBoardingEmail } from '@/services/mentors';
import { toast } from 'react-hot-toast';
import { useLoginStore } from '@/stores/auth/store';
import { DayOfWeek } from '@/types/mentor';
import { WeekDayScheduleCard } from '@/components/Home/WeekDayScheduleCard';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import AddScheduleForMentee from '@/components/Home/AddScheduleForMentee';


const DAY_ORDER = [
  DayOfWeek.MONDAY,
  DayOfWeek.TUESDAY,
  DayOfWeek.WEDNESDAY,
  DayOfWeek.THURSDAY,
  DayOfWeek.FRIDAY,
  DayOfWeek.SATURDAY,
  DayOfWeek.SUNDAY
];

// Helper function to get date for a specific day of week
const getDateForDay = (day: DayOfWeek): string => {
  const today = new Date();
  const currentDay = today.getDay();
  const targetDay = DAY_ORDER.indexOf(day);
  
  // Calculate days to add to get to target day
  let daysToAdd = targetDay - currentDay;
  if (daysToAdd <= 0) daysToAdd += 7; // If target day is earlier in week, move to next week
  
  const targetDate = new Date(today);
  targetDate.setDate(today.getDate() + daysToAdd);
  
  // Format as dd/mm/yyyy
  return targetDate.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

export default function MentorSchedulesPage() {
  const { mentorResponse, addToSessionsByDayOfWeek, removeFromSessionsByDayOfWeek, addToSessionsByDate, setMentorResponse, onMenteeScheduled } = useMentorStore();
  const authHeader = useLoginStore((state) => state.getAuthHeader());
  const [selectedMentee, setSelectedMentee] = useState<StrippedDownMentee | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [sendingEmail, setSendingEmail] = useState<string | null>(null);

  const handleScheduleClick = (mentee: StrippedDownMentee) => {
    setSelectedMentee(mentee);
    setIsModalOpen(true);
  };

  const handleScheduleSubmit = async (schedule: Omit<RecurringMentorshipSchedule, 'sessionId'>) => {
    if (!authHeader) {
      toast.error('Authentication error. Please try logging in again.');
      return;
    }

    try {
      const createdSession = await createRecurringSchedule(schedule, authHeader);
      
      // Show success message with session details
      toast.success(
        `Schedule created successfully for ${createdSession.mn}`,
        {
          duration: 3000,
          position: 'top-right',
        }
      );
      console.log("Schedule created successfully: ", createdSession);

      addToSessionsByDayOfWeek(schedule.firstSessionDate as DateFormatDDMMYYYY, createdSession);
      addToSessionsByDate(schedule.firstSessionDate as DateFormatDDMMYYYY, createdSession)

      // Get the day of week from firstSessionDate
      const [day, month, year] = schedule.firstSessionDate.split('/');
      const firstSessionDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      const dayOfWeek = firstSessionDate.getDay();
      
      // Create dates for this week and next week
      const today = new Date();
      const daysUntilNextSession = (dayOfWeek - today.getDay() + 7) % 7;
      const nextSessionDate = new Date(today);
      nextSessionDate.setDate(today.getDate() + daysUntilNextSession);
      
      const nextWeekSessionDate = new Date(nextSessionDate);
      nextWeekSessionDate.setDate(nextSessionDate.getDate() + 7);
      
      // Format dates as DD/MM/YYYY
      const formatDate = (date: Date): DateFormatDDMMYYYY => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}` as DateFormatDDMMYYYY;
      };
      
      // Add sessions to sessionsByDate for both dates
      addToSessionsByDate(formatDate(nextSessionDate), createdSession);
      addToSessionsByDate(formatDate(nextWeekSessionDate), createdSession);
      onMenteeScheduled(createdSession.mu);

    } catch (error) {
      console.error('Failed to create schedule:', error);
      toast.error(
        error instanceof Error 
          ? error.message 
          : 'Failed to create schedule. Please try again.',
        {
          duration: 4000,
          position: 'top-right',
        }
      );
    }
  };

  const handleSendOnboardingEmail = async (mentee: StrippedDownMentee) => {
    if (!authHeader || sendingEmail) return;

    setSendingEmail(mentee.p);

    try {
      await sendOnBoardingEmail(mentee, authHeader, 'MENTOR_ASSIGNED');
      toast.success(`Onboarding email sent to ${mentee.n}`, {
        duration: 3000,
        position: 'top-right',
      });
    } catch (error) {
      console.error('Failed to send onboarding email:', error);
      toast.error(
        error instanceof Error 
          ? error.message 
          : `Failed to send email to ${mentee.n}`,
        {
          duration: 4000,
          position: 'top-right',
        }
      );
    } finally {
      setSendingEmail(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Send Onboarding Email button */}
      <div className="max-w-7xl mx-auto pt-6 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Mentor Schedules</h1>
          <button
            onClick={() => setIsEmailModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            Email Mentee about new scheduled session
          </button>
        </div>
      </div>

      {/* Unscheduled Mentees Section */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex flex-col space-y-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Mentees with no assigned schedule
              </h1>
              <p className="mt-2 text-sm text-gray-500">
                Create schedules for your mentees to start mentoring sessions.
              </p>
            </div>

            {mentorResponse?.um?.strippedDownMentees?.length ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mentorResponse.um.strippedDownMentees.map((mentee: StrippedDownMentee) => (
                  <MenteeScheduleTile
                    key={mentee.p}
                    mentee={mentee}
                    onScheduleClick={() => handleScheduleClick(mentee)}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-500">
                Schedules for all mentees are assigned. Kindly check back later.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Scheduled Sessions Section */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex flex-col space-y-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Your scheduled sessions
              </h1>
              <p className="mt-2 text-sm text-gray-500">
                View and manage your scheduled mentoring sessions.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {DAY_ORDER.map((day) => {
                const sessions = mentorResponse?.sw?.[day] || [];
                // Sort sessions by startTime
                const sortedSessions = [...sessions].sort((a, b) => {
                  const timeA = a.st.split(':').map(Number);
                  const timeB = b.st.split(':').map(Number);
                  return timeA[0] * 60 + timeA[1] - (timeB[0] * 60 + timeB[1]);
                });
                const date = getDateForDay(day);
                return (
                  <WeekDayScheduleCard
                    key={day}
                    day={day}
                    sessions={sortedSessions}
                    date={date}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Send Onboarding Email Modal */}
      <Dialog
        open={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        className="fixed inset-0 z-10 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <div
            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
            aria-hidden="true"
          />

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>

          <div className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="flex justify-between items-center mb-4">
                <Dialog.Title className="text-lg font-medium text-gray-900">
                  Email Mentee
                </Dialog.Title>
                <button
                  onClick={() => setIsEmailModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                {mentorResponse?.am?.length ? (
                  mentorResponse.am.map((mentee) => (
                    <div
                      key={mentee.p}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">{mentee.n}</h3>
                        <p className="text-sm text-gray-500">{mentee.e}</p>
                      </div>
                      <button
                        onClick={() => handleSendOnboardingEmail(mentee)}
                        disabled={sendingEmail === mentee.p}
                        className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md ${
                          sendingEmail === mentee.p
                            ? 'bg-orange-100 text-orange-400 cursor-not-allowed'
                            : 'text-orange-700 bg-orange-100 hover:bg-orange-200'
                        }`}
                      >
                        {sendingEmail === mentee.p ? 'Sending...' : 'Send Email'}
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-4">No assigned mentees found.</p>
                )}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setIsEmailModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </Dialog>

      {selectedMentee && (
        <AddScheduleForMentee
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedMentee(null);
          }}
          onSubmit={handleScheduleSubmit}
          mentee={selectedMentee}
          mentor={{name: mentorResponse?.m?.name, phone: mentorResponse?.u, email: mentorResponse?.m?.email}}
        />
      )}
    </div>
  );
} 