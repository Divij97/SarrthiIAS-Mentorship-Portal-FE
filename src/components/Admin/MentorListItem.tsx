'use client';

import { StrippedDownMentor } from '@/types/mentor';

interface MentorListItemProps {
  mentor: StrippedDownMentor;
}

export default function MentorListItem({ mentor }: MentorListItemProps) {
  return (
    <div className="flex flex-col">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">
          {mentor.name}
        </h3>
        <p className="text-sm text-gray-500">{mentor.email}</p>
      </div>
      
      <div className="mt-2">
        <p className="text-sm font-medium text-gray-500">Phone</p>
        <p className="text-sm text-gray-900">{mentor.phone}</p>
      </div>
    </div>
  );
} 