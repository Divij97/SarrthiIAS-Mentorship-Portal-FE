import { Course } from '@/types/course';
import { Button } from '@/components/ui/Button';
import { RegisterMenteesToCourse } from '@/components/app/admin/mentees/register-multiple-mentees-modal';

interface OneOnOneCourseListItemProps {
  course: Course;
}

export function OneOnOneCourseListItem({ course }: OneOnOneCourseListItemProps) {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium text-gray-900">{course.name}</h3>
          <p className="mt-1 text-sm text-gray-500">
            One-on-One Mentorship Course
          </p>
        </div>
        <RegisterMenteesToCourse 
          courseId={course.id} 
          onSuccess={() => {
            // You can add any success callback here if needed
          }}
        />
      </div>
    </div>
  );
} 