import { ClockIcon, VideoCameraIcon, DocumentIcon } from '@heroicons/react/24/outline';
import { Session } from '@/types/session';

interface SessionCardProps {
  session: Session;
}

export default function SessionCard({ session }: SessionCardProps) {
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

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{session.title}</h3>
          <p className="text-sm text-gray-500 mt-1">{session.description}</p>
        </div>
        {/* <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
          {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
        </span> */}
      </div>

      <div className="space-y-2">
        <div className="flex items-center text-sm text-gray-600">
          <ClockIcon className="h-4 w-4 mr-2" />
          <span>{formatDate(session.date)} • {session.startTime} - {session.endTime}</span>
        </div>

        <div className="flex items-center text-sm">
          <VideoCameraIcon className="h-4 w-4 mr-2 text-gray-500" />
          {session.meetingLink ? (
            <a href={session.meetingLink} target="_blank" rel="noopener noreferrer" 
              className="text-blue-600 hover:text-blue-800">
              Join Meeting
            </a>
          ) : (
            <span className="text-gray-500 cursor-help" title="Zoom meeting link will be updated shortly">
              Link not available
            </span>
          )}
        </div>

        {session.recordingLink && (
          <div className="flex items-center text-sm">
            <DocumentIcon className="h-4 w-4 mr-2 text-gray-500" />
            <a href={session.recordingLink} target="_blank" rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800">
              View Recording
            </a>
          </div>
        )}
      </div>
    </div>
  );
} 