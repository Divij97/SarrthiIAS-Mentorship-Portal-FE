import { useState } from 'react';
import { Course, CourseDocuments, CreateDocumentRequest } from '@/types/course';
import { MinusCircleIcon, PlusIcon } from '@heroicons/react/24/outline';
import AddDocumentModal from './AddDocumentModal';

interface UpdateCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (updatedCourse: Partial<Course>) => Promise<void>;
  course: Course;
  isLoading: boolean;
}

// Helper function to convert dd/mm/yyyy to yyyy-mm-dd
const formatDateForInput = (dateString: string): string => {
  const [day, month, year] = dateString.split('/');
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};

// Helper function to convert yyyy-mm-dd to dd/mm/yyyy
const formatDateForSubmission = (dateString: string): string => {
  const [year, month, day] = dateString.split('-');
  return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
};

export default function UpdateCourseModal({
  isOpen,
  onClose,
  onSubmit,
  course,
  isLoading,
}: UpdateCourseModalProps) {
  const [formData, setFormData] = useState({
    name: course.name,
    description: course.description,
    startDate: formatDateForInput(course.startDate),
    endDate: formatDateForInput(course.endDate),
  });

  const [documents, setDocuments] = useState<CourseDocuments[]>(course.documents || []);
  const [isAddDocumentModalOpen, setIsAddDocumentModalOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      ...course,
      name: formData.name,
      description: formData.description,
      startDate: formatDateForSubmission(formData.startDate),
      endDate: formatDateForSubmission(formData.endDate),
      documents: documents,
    });
  };

  const handleAddDocument = (document: CreateDocumentRequest) => {
    setDocuments(prev => [...prev, document]);
  };

  const handleRemoveDocument = (index: number) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Update Course Details</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Course Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                rows={4}
                required
              />
            </div>

            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                End Date
              </label>
              <input
                type="date"
                id="endDate"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                required
              />
            </div>

            {/* Documents Section */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-700">Course Documents</h3>
                <button
                  type="button"
                  onClick={() => setIsAddDocumentModalOpen(true)}
                  className="p-1.5 bg-purple-100 text-purple-600 rounded-md hover:bg-purple-200 transition-colors duration-200"
                  title="Add document"
                >
                  <PlusIcon className="h-4 w-4" />
                </button>
              </div>

              {/* Existing Documents */}
              {documents.length > 0 && (
                <div className="space-y-1 mb-3">
                  {documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-700">{doc.name}</span>
                        <a 
                          href={doc.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-purple-600 hover:text-purple-800 text-xs"
                        >
                          {doc.url}
                        </a>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveDocument(index)}
                        className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                        title="Remove document"
                      >
                        <MinusCircleIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-orange-600 border border-transparent rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
            >
              {isLoading ? 'Updating...' : 'Update Course'}
            </button>
          </div>
        </form>

        <AddDocumentModal
          isOpen={isAddDocumentModalOpen}
          onClose={() => setIsAddDocumentModalOpen(false)}
          onAddDocument={handleAddDocument}
        />
      </div>
    </div>
  );
} 