'use client';

import { useState } from 'react';
import { Course } from '@/types/course';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

interface CourseListItemProps {
  course: Course;
  onSelect?: (course: Course) => void;
}

export default function CourseListItem({ course, onSelect }: CourseListItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer border border-gray-200"
      onClick={() => onSelect?.(course)}
    >
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-900 flex-grow">
            {course.name}
          </h3>
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
          <div className="mt-2">
            <div className="text-sm text-gray-600">
              {course.description || 'No description available'}
            </div>
            <div className="mt-2 text-xs text-gray-500">
              {course.groups.length} group(s)
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 