import { useState } from 'react';
import { MenteesForCsvExport } from '@/types/mentee';
import { Course } from '@/types/course';
import { updateMenteesEnrolledInCourse } from '@/services/admin';
import { toast } from 'react-hot-toast';

interface AssignToCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  mentee: MenteesForCsvExport;
  courses: Course[];
  authHeader: string;
  onSuccess: () => void;
}

export default function AssignToCourseModal({
  isOpen,
  onClose,
  mentee,
  courses,
  authHeader,
  onSuccess
}: AssignToCourseModalProps) {
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!selectedCourse) {
      toast.error('Please select a course');
      return;
    }

    try {
      setLoading(true);
      await updateMenteesEnrolledInCourse(
        selectedCourse,
        {
          menteesToAdd: [mentee.phone],
          menteesToRemove: []
        },
        authHeader
      );
      toast.success(`Successfully assigned ${mentee.name} to course`);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error assigning mentee to course:', error);
      toast.error('Failed to assign mentee to course');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Assign {mentee.name} to Course
        </h2>
        
        <div className="mb-4">
          <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-1">
            Select Course
          </label>
          <select
            id="course"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="">Select a course</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !selectedCourse}
            className={`px-4 py-2 text-sm font-medium text-white bg-orange-600 border border-transparent rounded-md ${
              loading || !selectedCourse
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500'
            }`}
          >
            {loading ? 'Assigning...' : 'Assign'}
          </button>
        </div>
      </div>
    </div>
  );
} 