import { MentorshipSession } from "@/types/session";
import { SessionInfoCard } from "./SessionInfoCard";
import { CalendarDaysIcon } from '@heroicons/react/24/outline';
import { formatDisplayDate } from "@/utils/date-time-utils";

interface SessionCardProps {
    date: string;
    sessions: MentorshipSession[];
  }
    
  export const SessionCard = ({ date, sessions }: SessionCardProps) => {
    const formattedDate = formatDisplayDate(date);
    
    return (
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-6 py-3 flex items-center space-x-2">
          <CalendarDaysIcon className="h-5 w-5 text-gray-500" />
          <h2 className="text-lg font-medium text-gray-900">{formattedDate}</h2>
        </div>
        <div className="p-6 space-y-4">
          {sessions.length > 0 ? (
            sessions.map(session => <SessionInfoCard key={session.id} session={session} />)
          ) : (
            <div className="text-center py-4 text-gray-500">
              No sessions scheduled for this day
            </div>
          )}
        </div>
      </div>
    );
  };