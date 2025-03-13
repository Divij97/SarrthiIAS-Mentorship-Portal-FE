import { MentorshipSession } from "@/types/session";
import { formatTimeDisplay } from "@/utils/date_time_utils";
import { ClockIcon, UserIcon, PhoneIcon } from '@heroicons/react/24/outline';

interface SessionCardProps {
    session: MentorshipSession;
  }
  
  export const SessionInfoCard = ({ session }: SessionCardProps) => {
    const startTime = formatTimeDisplay(session.startTime);
    const endTime = formatTimeDisplay(session.endTime);
  
    return (
      <div key={session.id} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-all duration-200">
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <UserIcon className="h-5 w-5 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900">{session.menteeFullName}</h3>
              </div>
              <div className="flex items-center space-x-2 text-gray-500">
                <PhoneIcon className="h-4 w-4" />
                <span className="text-sm">{session.menteeUsername}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-500">
                <ClockIcon className="h-4 w-4" />
                <span className="text-sm">{startTime} - {endTime}</span>
              </div>
            </div>
            {session.isZoomLinkGenerated || session.zoomLink ? (
              <a
                href={session.zoomLink || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Join Meeting
              </a>
            ) : (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                Link Pending
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };