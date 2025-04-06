'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createCourse } from '@/services/courses';
import { CreateCourseRequest, CreateDocumentRequest } from '@/types/course';
import { useAdminAuthStore } from '@/stores/auth/admin-auth-store';
import { toast } from 'react-hot-toast';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

interface CourseFormData {
  title: string;
  description: string;
  endDate: string;
  isOneOnOneMentorship: boolean;
  isGroupMentorshipEnabled: boolean;
  documents: CreateDocumentRequest[];
}

interface DocumentFormData {
  name: string;
  description: string;
  url: string;
  disclaimer: string;
}

export default function CourseForm() {
  const [formData, setFormData] = useState<CourseFormData>({
    title: '',
    description: '',
    endDate: '',
    isOneOnOneMentorship: true,
    isGroupMentorshipEnabled: false,
    documents: []
  });

  const [documentForm, setDocumentForm] = useState<DocumentFormData>({
    name: '',
    description: '',
    url: '',
    disclaimer: ''
  });

  const [isAddingDocument, setIsAddingDocument] = useState(false);

  const router = useRouter();
  const { getAuthHeader, addCourse } = useAdminAuthStore();

  const handleOneOnOneChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      isOneOnOneMentorship: checked,
      isGroupMentorshipEnabled: !checked ? true : prev.isGroupMentorshipEnabled
    }));
  };

  const handleGroupMentorshipChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      isGroupMentorshipEnabled: checked
    }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = new Date(e.target.value);
    const today = new Date();
    
    if (selectedDate > today) {
      // Format the date as dd/mm/yyyy
      const day = selectedDate.getDate().toString().padStart(2, '0');
      const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
      const year = selectedDate.getFullYear();
      const formattedDate = `${day}/${month}/${year}`;
      
      setFormData(prev => ({
        ...prev,
        endDate: formattedDate
      }));
    }
  };

  const handleDocumentInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDocumentForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddDocument = () => {
    if (!documentForm.name || !documentForm.url) {
      toast.error('Document name and URL are required', {
        duration: 3000,
        position: 'top-right',
      });
      return;
    }

    // Validate URL format
    if (!documentForm.url.startsWith('http://') && !documentForm.url.startsWith('https://')) {
      toast.error('URL must start with http:// or https://', {
        duration: 3000,
        position: 'top-right',
      });
      return;
    }

    try {
      new URL(documentForm.url);
    } catch (err) {
      toast.error('Please enter a valid URL', {
        duration: 3000,
        position: 'top-right',
      });
      return;
    }

    setFormData(prev => ({
      ...prev,
      documents: [...prev.documents, { ...documentForm }]
    }));

    setDocumentForm({
      name: '',
      description: '',
      url: '',
      disclaimer: ''
    });
    setIsAddingDocument(false);
  };

  const handleRemoveDocument = (index: number) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    const authHeader = getAuthHeader();
    
    const course: CreateCourseRequest = {
      name: formData.title,
      description: formData.description,
      endDate: formData.endDate,
      isOneOnOneMentorshipCourse: formData.isOneOnOneMentorship,
      startDate: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }),
      documents: formData.documents
    };

    try {
      const createdCourse = await createCourse(course, authHeader || "");

      console.log("Created course", createdCourse)
      // Add the new course to the admin store
      addCourse(createdCourse);
      toast.success('Course created successfully!', {
        duration: 3000,
        position: 'top-right',
      });
      
      router.push('/admin/dashboard/courses/active');
    } catch (error) {
      console.error('Error creating course:', error);
      toast.error(
        error instanceof Error 
          ? error.message 
          : 'Failed to create course. Please try again.',
        {
          duration: 4000,
          position: 'top-right',
        }
      );
    }
  };

  const isSubmitDisabled = () => {
    return (
      !formData.title ||
      !formData.description ||
      !formData.endDate ||
      (!formData.isOneOnOneMentorship && !formData.isGroupMentorshipEnabled)
    );
  };

  const getDateInputValue = (ddmmyyyy: string): string => {
    // If the date is empty or not in dd/mm/yyyy format, return empty string
    if (!ddmmyyyy || !ddmmyyyy.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
      return '';
    }
    
    // Convert from dd/mm/yyyy to YYYY-MM-DD for the date input
    const [day, month, year] = ddmmyyyy.split('/');
    return `${year}-${month}-${day}`;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Course Title
        </label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-black"
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
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-black"
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
          value={getDateInputValue(formData.endDate)}
          onChange={handleDateChange}
          min={new Date().toISOString().split('T')[0]}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-black"
          required
        />
        <p className="mt-1 text-sm text-gray-500">
          Course end date must be today or later (DD/MM/YYYY)
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Course Documents</h3>
          <button
            type="button"
            onClick={() => setIsAddingDocument(true)}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-orange-700 bg-orange-100 hover:bg-orange-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Document
          </button>
        </div>

        {formData.documents.length > 0 && (
          <div className="space-y-3">
            {formData.documents.map((doc, index) => (
              <div key={index} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">{doc.name}</h4>
                  <p className="text-sm text-gray-500">{doc.description}</p>
                  <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-sm text-orange-600 hover:text-orange-800">
                    View Document
                  </a>
                  {doc.disclaimer && (
                    <p className="text-xs text-gray-500 mt-1">{doc.disclaimer}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveDocument(index)}
                  className="ml-4 text-gray-400 hover:text-red-500"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {isAddingDocument && (
          <div className="p-4 bg-gray-50 rounded-lg space-y-4">
            <div>
              <label htmlFor="docName" className="block text-sm font-medium text-gray-700">
                Document Name
              </label>
              <input
                type="text"
                id="docName"
                name="name"
                value={documentForm.name}
                onChange={handleDocumentInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-black"
                required
              />
            </div>

            <div>
              <label htmlFor="docDescription" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="docDescription"
                name="description"
                value={documentForm.description}
                onChange={handleDocumentInputChange}
                rows={2}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-black"
              />
            </div>

            <div>
              <label htmlFor="docUrl" className="block text-sm font-medium text-gray-700">
                Document URL
              </label>
              <input
                type="url"
                id="docUrl"
                name="url"
                value={documentForm.url}
                onChange={handleDocumentInputChange}
                pattern="^https?:\/\/.*"
                title="URL must start with http:// or https://"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-black"
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                URL must start with http:// or https://
              </p>
            </div>

            <div>
              <label htmlFor="docDisclaimer" className="block text-sm font-medium text-gray-700">
                Disclaimer (Optional)
              </label>
              <textarea
                id="docDisclaimer"
                name="disclaimer"
                value={documentForm.disclaimer}
                onChange={handleDocumentInputChange}
                rows={2}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-black"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsAddingDocument(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddDocument}
                className="px-4 py-2 text-sm font-medium text-white bg-orange-600 border border-transparent rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Add Document
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="oneOnOne"
            checked={formData.isOneOnOneMentorship}
            onChange={(e) => handleOneOnOneChange(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
          />
          <label htmlFor="oneOnOne" className="ml-2 block text-sm text-gray-900">
            Enable One-on-One Mentorship
          </label>
        </div>

        {!formData.isOneOnOneMentorship && (
          <div className="flex items-center">
            <input
              type="checkbox"
              id="groupMentorship"
              checked={formData.isGroupMentorshipEnabled}
              onChange={(e) => handleGroupMentorshipChange(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
            />
            <label htmlFor="groupMentorship" className="ml-2 block text-sm text-gray-900">
              Enable Group Mentorship
            </label>
          </div>
        )}
      </div>

      <div>
        <button
          type="submit"
          disabled={isSubmitDisabled()}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
            ${isSubmitDisabled() 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500'
            }`}
        >
          Create Course
        </button>
      </div>
      
      {!formData.isOneOnOneMentorship && !formData.isGroupMentorshipEnabled && (
        <p className="text-red-500 text-sm mt-2">
          At least one type of mentorship must be enabled
        </p>
      )}
    </form>
  );
} 