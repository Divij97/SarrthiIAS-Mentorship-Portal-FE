'use client';

import { Course } from '@/types/course';

interface CourseListItemProps {
  course: Course;
  onSelect?: (course: Course) => void;
}

export default function CourseListItem({ course, onSelect }: CourseListItemProps) {
  // Parse dd/mm/yyyy format
  let endDate: string;
  
  if (course.endDate.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
    // Parse date in dd/mm/yyyy format
    const [day, month, year] = course.endDate.split('/').map(Number);
    const date = new Date(year, month - 1, day);
    
    endDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } else {
    // Fallback for any other format
    endDate = new Date(course.endDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  return (
    <div 
      className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
      onClick={() => onSelect?.(course)}
    >
      <div className="p-6">
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-gray-900">
            {course.name}
          </h3>
          <p className="text-gray-600 line-clamp-2">
            {course.description || 'No description available'}
          </p>
          <div className="mt-4 space-y-2">
            <p className="text-sm text-gray-500">
              Course Type: {course.isOneOnOneMentorshipCourse ? 'One-on-One Mentorship' : 'Group Mentorship'}
            </p>
            <p className="text-sm text-gray-500">
              End Date: {endDate}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 