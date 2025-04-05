'use client';

import { StrippedDownMentor } from '@/types/mentor';

interface MentorListItemProps {
  mentor: StrippedDownMentor;
  onSelect?: (mentor: StrippedDownMentor) => void;
  isSelected?: boolean;
}

export default function MentorListItem({ mentor, onSelect, isSelected }: MentorListItemProps) {
  return (
    <div 
      className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer border ${isSelected ? 'border-orange-500' : 'border-gray-200'} h-full relative`}
      onClick={() => onSelect?.(mentor)}
    >
      <div className="p-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {mentor.name}
          </h3>
          <p className="text-sm text-gray-500 mb-4">{mentor.email}</p>
        </div>
        
        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium text-gray-500">Phone</p>
            <p className="text-sm text-gray-900">{mentor.phone}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 