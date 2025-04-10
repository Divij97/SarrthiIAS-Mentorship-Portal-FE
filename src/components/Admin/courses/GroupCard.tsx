import { UserGroupIcon, CalendarIcon, CheckCircleIcon, XCircleIcon, UserIcon } from '@heroicons/react/24/outline';
import { MentorshipGroup } from '@/types/session';

interface GroupCardProps {
  group: MentorshipGroup;
  onClick?: () => void;
  isSelected?: boolean;
  onSelect?: () => void;
}

export default function GroupCard({ group, onClick, isSelected, onSelect }: GroupCardProps) {
  const handleClick = () => {
    // If onSelect is provided and the card is selected, use onSelect
    if (onSelect && isSelected) {
      onSelect();
    } 
    // Otherwise use onClick
    else if (onClick) {
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
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <UserGroupIcon className="h-5 w-5 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900">{group.groupFriendlyName}</h3>
            </div>
            <div className="flex items-center space-x-4 text-gray-500">
              <div className="flex items-center space-x-2">
                <CalendarIcon className="h-4 w-4" />
                <span className="text-sm">{group.sessions?.length || "No"} sessions</span>
              </div>
              <div className="flex items-center space-x-2">
                <UserIcon className="h-4 w-4" />
                <span className="text-sm">{group.menteeCount || 0} mentees</span>
              </div>
            </div>
          </div>
          {group.sessions?.length || 0 > 0 ? (
            <div className="flex items-center text-green-600">
              <CheckCircleIcon className="h-5 w-5" />
              <span className="ml-1 text-sm">Sessions Scheduled</span>
            </div>
          ) : (
            <div className="flex items-center text-red-600">
              <XCircleIcon className="h-5 w-5" />
              <span className="ml-1 text-sm">No Sessions</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 