import { DayOfWeek } from '@/types/mentor';
import { MentorshipSession } from '@/types/session';
import { RecurringSessionCard } from './RecurringSessionCard';

interface WeekDayScheduleCardProps {
  day: DayOfWeek;
  sessions: MentorshipSession[];
  date: string; // Format: dd/mm/yyyy
}

export function WeekDayScheduleCard({ day, sessions, date }: WeekDayScheduleCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">
        {day.charAt(0) + day.slice(1).toLowerCase()}
      </h2>
      {sessions.length > 0 ? (
        <div className="space-y-4">
          {sessions.map((session) => (
            <RecurringSessionCard 
              key={session.id} 
              session={session} 
              dayOfWeek={day}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No sessions scheduled</p>
      )}
    </div>
  );
} 