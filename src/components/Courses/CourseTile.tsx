import { Course } from '@/types/course';

interface CourseTileProps {
  course: Course;
  onClick: (courseId: string) => void;
}

export default function CourseTile({ course, onClick }: CourseTileProps) {
  return (
    <div 
      onClick={() => onClick(course.id)}
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
    >
      <h3 className="text-xl font-semibold text-gray-900">{course.name}</h3>
    </div>
  );
} 