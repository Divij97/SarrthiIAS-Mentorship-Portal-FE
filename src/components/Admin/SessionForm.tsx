'use client';

import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useAdminAuthStore } from '@/stores/auth/admin-auth-store';

interface SessionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: SessionFormData) => void;
}

export interface SessionFormData {
  name: string;
  description: string;
  date: string; // In dd/mm/yyyy format
  startTime: string;
  endTime: string;
  mentorId: string;
}

export default function SessionForm({ isOpen, onClose, onSubmit }: SessionFormProps) {
  // Get the current date in dd/mm/yyyy format
  const today = new Date();
  const formattedToday = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;
  
  const [formData, setFormData] = useState<SessionFormData>({
    name: 'Monthly Session',
    description: '',
    date: formattedToday,
    startTime: '10:00',
    endTime: '11:00',
    mentorId: ''
  });
  
  // Always call hooks at the top level, before any conditional returns
  const mentors = useAdminAuthStore((state) => state.adminData?.mentors);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate that name and description are not empty
    if (!formData.name.trim() || !formData.description.trim()) {
      return;
    }
    
    onSubmit(formData);
    onClose();
  };
  
  // Convert dd/mm/yyyy to YYYY-MM-DD for date input
  const getDateInputValue = (ddmmyyyy: string): string => {
    const [day, month, year] = ddmmyyyy.split('/');
    return `${year}-${month}-${day}`;
  };
  
  // Convert YYYY-MM-DD to dd/mm/yyyy for our form data
  const handleDateChange = (dateInput: string) => {
    const [year, month, day] = dateInput.split('-');
    const formattedDate = `${day}/${month}/${year}`;
    setFormData(prev => ({ ...prev, date: formattedDate }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Create New Session</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Session Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-gray-900"
              required
              minLength={1}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-gray-900"
              placeholder="Enter session description"
              required
              minLength={1}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Session Date (DD/MM/YYYY)
            </label>
            <input
              type="date"
              value={getDateInputValue(formData.date)}
              min={getDateInputValue(formattedToday)}
              onChange={(e) => handleDateChange(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-gray-900"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Time
            </label>
            <input
              type="time"
              value={formData.startTime}
              onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-gray-900"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Time
            </label>
            <input
              type="time"
              value={formData.endTime}
              onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-gray-900"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mentor
            </label>
            <select
              value={formData.mentorId}
              onChange={(e) => setFormData(prev => ({ ...prev, mentorId: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-gray-900"
              required
            >
              <option value="">Select a mentor</option>
              {mentors?.map((mentor) => (
                <option key={mentor.phone} value={mentor.phone}>
                  {mentor.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              Create Session
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 