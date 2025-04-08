'use client';

import { useState } from 'react';
import { useMentorStore } from '@/stores/mentor/store';
import { MenteeScheduleTile } from '@/components/Home/MenteeScheduleTile';
import { AddScheduleForMentee } from '@/components/Home/AddScheduleForMentee';
import { StrippedDownMentee } from '@/types/mentee';
import { DateFormatDDMMYYYY, RecurringMentorshipSchedule } from '@/types/session';
import { createRecurringSchedule } from '@/services/mentors';
import { toast } from 'react-hot-toast';
import { useLoginStore } from '@/stores/auth/store';
import { DayOfWeek } from '@/types/mentor';
import { WeekDayScheduleCard } from '@/components/Home/WeekDayScheduleCard';


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
  const { mentorResponse, addToSessionsByDayOfWeek, removeFromSessionsByDayOfWeek } = useMentorStore();
  const authHeader = useLoginStore((state) => state.getAuthHeader());
  const [selectedMentee, setSelectedMentee] = useState<StrippedDownMentee | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        `Schedule created successfully for ${createdSession.menteeFullName}`,
        {
          duration: 3000,
          position: 'top-right',
        }
      );
      console.log("Schedule created successfully: ", createdSession);

      addToSessionsByDayOfWeek(schedule.firstSessionDate as DateFormatDDMMYYYY, createdSession);
      
      // Get the updated mentor response and update local state

      // Close the modal
      setIsModalOpen(false);
      setSelectedMentee(null);
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

  return (
    <div className="min-h-screen bg-gray-50">
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

            {mentorResponse?.unscheduledMenteeDetails?.strippedDownMentees?.length ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mentorResponse.unscheduledMenteeDetails.strippedDownMentees.map((mentee: StrippedDownMentee) => (
                  <MenteeScheduleTile
                    key={mentee.phone}
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
                const sessions = mentorResponse?.sessionsByDayOfWeek?.[day] || [];
                const date = getDateForDay(day);
                return (
                  <WeekDayScheduleCard
                    key={day}
                    day={day}
                    sessions={sessions}
                    date={date}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {selectedMentee && (
        <AddScheduleForMentee
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedMentee(null);
          }}
          onSubmit={handleScheduleSubmit}
          mentee={selectedMentee}
        />
      )}
    </div>
  );
} 