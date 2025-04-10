import { UserGroupIcon, CalendarIcon, UserIcon, CheckCircleIcon, XCircleIcon, TrashIcon } from '@heroicons/react/24/outline';
import { MentorshipGroup } from '@/types/session';

interface GroupCardProps {
  group: MentorshipGroup;
  onClick?: () => void;
  isSelected?: boolean;
  onDelete?: () => void;
}

export default function GroupCard({ group, onClick, isSelected, onDelete }: GroupCardProps) {
  const handleClick = (e: React.MouseEvent) => {
    // Prevent click event from bubbling up when clicking the delete button
    if ((e.target as HTMLElement).closest('.delete-button')) {
      e.stopPropagation();
      return;
    }
    
    if (onClick) {
      onClick();
    }
  };

  return (
    <div 
      className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer ${
        isSelected ? 'ring-2 ring-orange-500' : ''
      }`}
      onClick={handleClick}
    >
      <div className="p-6">
        <div className="flex flex-col space-y-4">
          {/* Group Name Section */}
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-2 min-w-0">
              <UserGroupIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
              <h3 className="text-lg font-medium text-gray-900 truncate" title={group.groupFriendlyName}>
                {group.groupFriendlyName}
              </h3>
            </div>
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="delete-button p-1 text-gray-400 hover:text-red-600 transition-colors duration-200 flex-shrink-0"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Stats Section */}
          <div className="flex items-center space-x-4 text-gray-500">
            <div className="flex items-center space-x-2">
              <CalendarIcon className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm">{group.sessions?.length || "No"} sessions</span>
            </div>
            <div className="flex items-center space-x-2">
              <UserIcon className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm">{group.menteeCount || 0} mentees</span>
            </div>
          </div>

          {/* Status Section */}
          <div className="flex items-center">
            {group.sessions?.length || 0 > 0 ? (
              <div className="flex items-center text-green-600">
                <CheckCircleIcon className="h-5 w-5 flex-shrink-0" />
                <span className="ml-1 text-sm">Sessions Scheduled</span>
              </div>
            ) : (
              <div className="flex items-center text-red-600">
                <XCircleIcon className="h-5 w-5 flex-shrink-0" />
                <span className="ml-1 text-sm">No Sessions</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 