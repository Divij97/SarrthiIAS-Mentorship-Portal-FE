import { CourseGroupInfo } from '@/types/mentee';
import { UserGroupIcon } from '@heroicons/react/24/outline';

interface CourseTileProps {
  enrolledCourseInfo: CourseGroupInfo;
  onClick: (courseId: string) => void;
  assignedGroup: string | null;
}

export default function CourseTile({ enrolledCourseInfo, onClick, assignedGroup }: CourseTileProps) {
  const course = enrolledCourseInfo.course;
  const groupFriendlyName = assignedGroup && assignedGroup === "UNASSIGNED" 
    ? "Unassigned"
    : null;

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
      onClick={() => onClick(course.id)}
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer relative"
    >
      {assignedGroup && (
        <div className="absolute top-4 right-4">
          {!course.isOneOnOneMentorshipCourse && assignedGroup === "UNASSIGNED" && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
              <UserGroupIcon className="h-3 w-3 mr-1" />
              Unassigned
            </span>
          )}
        </div>
      )}
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{course.name}</h3>
      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{course.description}</p>
      <div className="space-y-1">
        <p className="text-xs text-gray-500">
          Type: {course.isOneOnOneMentorshipCourse ? 'One-on-One Mentorship' : 'Group Mentorship'}
        </p>
        <p className="text-xs text-gray-500">
          End Date: {endDate}
        </p>
      </div>
    </div>
  );
} 