import { useState } from 'react';
import { Course } from '@/types/course';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import { RegisterMenteesToCourse } from '@/components/app/admin/mentees/register-multiple-mentees-modal';
import UpdateCourseModal from '@/components/Admin/courses/UpdateCourseModal';
import { updateCourseDetails } from '@/services/courses';
import { useAdminAuthStore } from '@/stores/auth/admin-auth-store';
import toast from 'react-hot-toast';

interface OneOnOneCourseListItemProps {
  course: Course;
}

export function OneOnOneCourseListItem({ course }: OneOnOneCourseListItemProps) {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const authHeader = useAdminAuthStore((state) => state.getAuthHeader)();

  const handleUpdateCourse = async (updatedCourse: Partial<Course>) => {
    if (!authHeader) {
      toast.error('Authentication required');
      return;
    }

    setIsUpdating(true);
    try {
      await updateCourseDetails(course.id, updatedCourse as Course, authHeader);
      
      // Update the course in the admin store
      useAdminAuthStore.getState().updateCourse(course.id, updatedCourse as Course);
      
      toast.success('Course updated successfully!');
      setIsUpdateModalOpen(false);
    } catch (error) {
      console.error('Error updating course:', error);
      toast.error('Failed to update course. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-medium text-gray-900">{course.name}</h3>
          <button
            onClick={() => setIsUpdateModalOpen(true)}
            className="p-1 text-gray-400 hover:text-orange-600 transition-colors duration-200"
            title="Edit course details"
          >
            <PencilSquareIcon className="h-5 w-5" />
          </button>
        </div>
        <RegisterMenteesToCourse 
          courseId={course.id} 
          onSuccess={() => {
            // You can add any success callback here if needed
          }}
        />
      </div>
      {course.description && (
        <p className="mt-2 text-sm text-gray-500">{course.description}</p>
      )}

      <UpdateCourseModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        onSubmit={handleUpdateCourse}
        course={course}
        isLoading={isUpdating}
      />
    </div>
  );
} 