'use client';

import { Mentor } from '@/types/mentor';
import { PencilIcon } from '@heroicons/react/24/outline';

interface MentorListItemProps {
  mentor: Mentor;
  onSelect?: (mentor: Mentor) => void;
  onEdit?: (mentor: Mentor) => void;
  isSelected?: boolean;
}

export default function MentorListItem({ mentor, onSelect, onEdit, isSelected }: MentorListItemProps) {
  const formatOptionalSubject = (subject: string | null) => {
    if (!subject) return 'Not specified';
    return subject.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(mentor);
  };

  return (
    <div 
      className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer border ${isSelected ? 'border-orange-500' : 'border-gray-200'} h-full relative`}
      onClick={() => onSelect?.(mentor)}
    >
      <button
        onClick={handleEditClick}
        className="absolute top-3 right-3 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-200"
      >
        <PencilIcon className="h-4 w-4" />
      </button>

      <div className="p-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 pr-8">
            {mentor.name}
          </h3>
          <p className="text-sm text-gray-500 mb-4">{mentor.email}</p>
        </div>
        
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-sm font-medium text-gray-500">Phone</p>
              <p className="text-sm text-gray-900">{mentor.phone}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Region</p>
              <p className="text-sm text-gray-900">{mentor.region}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Optional Subject</p>
              <p className="text-sm text-gray-900">{formatOptionalSubject(mentor.optionalSubject)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Interview</p>
              <p className="text-sm text-gray-900">{mentor.givenInterview ? 'Yes' : 'No'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">UPSC Attempts</p>
              <p className="text-sm text-gray-900">{mentor.numberOfAttemptsInUpsc}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Mains</p>
              <p className="text-sm text-gray-900">{mentor.numberOfMainsAttempts}</p>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Off Days</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {mentor.offDaysOfWeek?.length ? (
                mentor.offDaysOfWeek.map((day) => (
                  <span
                    key={day}
                    className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs"
                  >
                    {day}
                  </span>
                ))
              ) : (
                <span className="text-sm text-gray-400">No off days specified</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 