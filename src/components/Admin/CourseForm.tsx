'use client';

import { useState } from 'react';

interface CourseFormData {
  title: string;
  description: string;
  endDate: string;
  isOneOnOneMentorship: boolean;
  isGroupMentorshipEnabled: boolean;
}

interface CourseFormProps {
  onViewActiveCourses: () => void;
}

export default function CourseForm({ onViewActiveCourses }: CourseFormProps) {
  const [formData, setFormData] = useState<CourseFormData>({
    title: '',
    description: '',
    endDate: '',
    isOneOnOneMentorship: true, // Default to true
    isGroupMentorshipEnabled: false,
  });

  // Get today's date in YYYY-MM-DD format for the min attribute
  const today = new Date().toISOString().split('T')[0];

  const handleOneOnOneChange = (checked: boolean) => {
    if (!checked) {
      // When one-on-one is unchecked, automatically enable group mentorship
      setFormData({
        ...formData,
        isOneOnOneMentorship: false,
        isGroupMentorshipEnabled: true
      });
    } else {
      setFormData({
        ...formData,
        isOneOnOneMentorship: true,
        isGroupMentorshipEnabled: false
      });
    }
  };

  const handleGroupMentorshipChange = (checked: boolean) => {
    setFormData({
      ...formData,
      isGroupMentorshipEnabled: checked
    });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;
    // Additional validation to ensure date is not before today
    if (selectedDate < today) {
      return; // Don't update if selected date is before today
    }
    setFormData({ ...formData, endDate: selectedDate });
  };

  const isSubmitDisabled = !formData.isOneOnOneMentorship && !formData.isGroupMentorshipEnabled;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // TODO: Implement API call to create course
      console.log('Course creation data:', formData);
    } catch (error) {
      console.error('Error creating course:', error);
    }
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
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-black"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          rows={4}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-black"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      <div>
        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
          End Date
        </label>
        <input
          type="date"
          id="endDate"
          required
          min={today}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-black"
          value={formData.endDate}
          onChange={handleDateChange}
        />
        <p className="mt-1 text-sm text-gray-500">
          Course end date must be today or later
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isOneOnOneMentorship"
            className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
            checked={formData.isOneOnOneMentorship}
            onChange={(e) => handleOneOnOneChange(e.target.checked)}
          />
          <label htmlFor="isOneOnOneMentorship" className="ml-2 block text-sm text-gray-900">
            Enable One-on-One Mentorship
          </label>
        </div>

        {/* Only show group mentorship option when one-on-one is disabled */}
        {!formData.isOneOnOneMentorship && (
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isGroupMentorshipEnabled"
              className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
              checked={formData.isGroupMentorshipEnabled}
              onChange={(e) => handleGroupMentorshipChange(e.target.checked)}
            />
            <label htmlFor="isGroupMentorshipEnabled" className="ml-2 block text-sm text-gray-900">
              Enable Group Mentorship
            </label>
          </div>
        )}
      </div>

      <div className="flex flex-col space-y-4">
        <button
          type="submit"
          disabled={isSubmitDisabled}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            isSubmitDisabled
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500'
          }`}
        >
          Create Course
        </button>
        
        <button
          type="button"
          onClick={onViewActiveCourses}
          className="w-full flex justify-center py-2 px-4 border border-orange-300 rounded-md shadow-sm text-sm font-medium text-orange-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        >
          See currently active courses
        </button>
      </div>
      
      {isSubmitDisabled && (
        <p className="text-red-500 text-sm mt-2">
          At least one type of mentorship must be enabled
        </p>
      )}
    </form>
  );
} 