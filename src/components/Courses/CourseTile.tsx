import { Course } from '@/types/course';

interface CourseTileProps {
  course: Course;
  onClick: (courseName: string) => void;
}

export default function CourseTile({ course, onClick }: CourseTileProps) {
  const endDate = new Date(course.endDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div 
      onClick={() => onClick(course.name)}
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
    >
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