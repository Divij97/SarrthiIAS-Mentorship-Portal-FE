'use client';

import { useState } from 'react';
import { Mentor } from '@/types/mentor';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

interface MentorListItemProps {
  mentor: Mentor;
  onSelect?: (mentor: Mentor) => void;
}

export default function MentorListItem({ mentor, onSelect }: MentorListItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const formatOptionalSubject = (subject: string) => {
    return subject.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer border border-gray-200"
      onClick={() => onSelect?.(mentor)}
    >
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {mentor.name}
            </h3>
            <p className="text-sm text-gray-500">{mentor.email}</p>
          </div>
          <button
            onClick={toggleExpand}
            className="ml-2 p-1 text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            {isExpanded ? (
              <ChevronUpIcon className="h-5 w-5" />
            ) : (
              <ChevronDownIcon className="h-5 w-5" />
            )}
          </button>
        </div>
        
        {isExpanded && (
          <div className="mt-4 space-y-3">
            <div className="grid grid-cols-2 gap-4">
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
                <p className="text-sm font-medium text-gray-500">Interview Experience</p>
                <p className="text-sm text-gray-900">{mentor.givenInterview ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">UPSC Attempts</p>
                <p className="text-sm text-gray-900">{mentor.numberOfAttemptsInUpsc}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Mains Attempts</p>
                <p className="text-sm text-gray-900">{mentor.numberOfMainsAttempts}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Off Days</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {mentor.offDaysOfWeek.map((day) => (
                  <span
                    key={day}
                    className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                  >
                    {day}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 