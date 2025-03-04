'use client';

import { useState } from 'react';
import { sampleMentors } from '@/data/mentors';
import { Mentor } from '@/types/mentor';

interface CourseFormData {
  title: string;
  description: string;
  endDate: string;
  isOneOnOneMentorship: boolean;
  isGroupMentorshipEnabled: boolean;
  mentorId: string;
}

export default function CourseForm() {
  const [formData, setFormData] = useState<CourseFormData>({
    title: '',
    description: '',
    endDate: '',
    isOneOnOneMentorship: true,
    isGroupMentorshipEnabled: false,
    mentorId: ''
  });

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
      setFormData(prev => ({
        ...prev,
        endDate: e.target.value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // TODO: Implement API call
  };

  const isSubmitDisabled = () => {
    return (
      !formData.title ||
      !formData.description ||
      !formData.endDate ||
      !formData.mentorId ||
      (!formData.isOneOnOneMentorship && !formData.isGroupMentorshipEnabled)
    );
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
        <label htmlFor="mentor" className="block text-sm font-medium text-gray-700">
          Select Mentor
        </label>
        <select
          id="mentor"
          value={formData.mentorId}
          onChange={(e) => setFormData(prev => ({ ...prev, mentorId: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-black"
          required
        >
          <option value="">Choose a mentor</option>
          {sampleMentors.map((mentor) => (
            <option key={mentor.phone} value={mentor.phone}>
              {mentor.name} - {mentor.optionalSubject.split('_').join(' ')}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
          End Date
        </label>
        <input
          type="date"
          id="endDate"
          value={formData.endDate}
          onChange={handleDateChange}
          min={new Date().toISOString().split('T')[0]}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-black"
          required
        />
        <p className="mt-1 text-sm text-gray-500">
          Course end date must be today or later
        </p>
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