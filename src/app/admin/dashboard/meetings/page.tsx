'use client';

import { useState, useEffect } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useLoginStore } from '@/stores/auth/store';
import { config } from '@/config/env';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import CalendarView from '@/components/Calendar/CalendarView';
import { Meeting } from '@/types/meeting';

interface MeetingFormData {
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  courseId: string;
  groupId: string;
}

export default function MeetingsPage() {
  const { authHeader } = useLoginStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isLoadingMeetings, setIsLoadingMeetings] = useState(true);
  const [meetingsError, setMeetingsError] = useState<string | null>(null);
  const [formData, setFormData] = useState<MeetingFormData>({
    title: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    courseId: '',
    groupId: ''
  });

  // Fetch meetings
  useEffect(() => {
    const fetchMeetings = async () => {
      if (!authHeader) {
        setMeetingsError('Authentication required');
        setIsLoadingMeetings(false);
        return;
      }

      try {
        let apiUrl = config.api.url;
        apiUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
        
        const response = await fetch(`${apiUrl}/v1/meetings`, {
          headers: {
            'Authorization': authHeader,
            'Accept': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        setMeetings(data);
      } catch (error) {
        console.error('Failed to fetch meetings:', error);
        setMeetingsError('Failed to load meetings');
      } finally {
        setIsLoadingMeetings(false);
      }
    };

    fetchMeetings();
  }, [authHeader]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!authHeader) {
      setError('Authentication required');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Clean up the API URL to prevent double slashes
      let apiUrl = config.api.url;
      apiUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
      
      const response = await fetch(`${apiUrl}/v1/meetings`, {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Meeting created successfully:', data);
      
      // Add the new meeting to the state
      setMeetings(prevMeetings => [...prevMeetings, data]);
      
      setSuccess('Meeting created successfully!');
      setFormData({
        title: '',
        description: '',
        date: '',
        startTime: '',
        endTime: '',
        courseId: '',
        groupId: ''
      });
      
      // Close the modal after a short delay
      setTimeout(() => {
        setIsCreateModalOpen(false);
        setSuccess(null);
      }, 2000);
      
    } catch (error) {
      console.error('Failed to create meeting:', error);
      setError(error instanceof Error ? error.message : 'Failed to create meeting');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditMeeting = (meeting: Meeting) => {
    // Implement edit functionality
    console.log('Edit meeting:', meeting);
    // This would open an edit modal or navigate to an edit page
  };

  const handleCancelMeeting = (meeting: Meeting) => {
    // Implement cancel functionality
    console.log('Cancel meeting:', meeting);
    // This would show a confirmation dialog and then make an API call to cancel
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Meetings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage group mentorship sessions and meetings
        </p>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-8">
        <div className="bg-white shadow-sm rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-gray-900">Meeting Calendar</h2>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Create Meeting
            </button>
          </div>
          
          {isLoadingMeetings ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading meetings...</p>
            </div>
          ) : meetingsError ? (
            <div className="text-center py-12">
              <p className="text-red-500">{meetingsError}</p>
            </div>
          ) : meetings.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No meetings found</p>
              <p className="mt-1 text-sm text-gray-400">
                Get started by creating your first meeting
              </p>
            </div>
          ) : (
            <CalendarView 
              meetings={meetings}
              onEditMeeting={handleEditMeeting}
              onCancelMeeting={handleCancelMeeting}
            />
          )}
        </div>
      </div>
      
      {/* Create Meeting Modal */}
      <Transition appear show={isCreateModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => !isLoading && setIsCreateModalOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <div className="flex justify-between items-center mb-4">
                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                      Create New Meeting
                    </Dialog.Title>
                    <button
                      type="button"
                      className="text-gray-400 hover:text-gray-500"
                      onClick={() => !isLoading && setIsCreateModalOpen(false)}
                      disabled={isLoading}
                    >
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>

                  <form onSubmit={handleCreateMeeting}>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                          Title
                        </label>
                        <input
                          type="text"
                          name="title"
                          id="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                          required
                          disabled={isLoading}
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                          Description
                        </label>
                        <textarea
                          name="description"
                          id="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          rows={3}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                          required
                          disabled={isLoading}
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                          Date
                        </label>
                        <input
                          type="date"
                          name="date"
                          id="date"
                          value={formData.date}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                          required
                          disabled={isLoading}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
                            Start Time
                          </label>
                          <input
                            type="time"
                            name="startTime"
                            id="startTime"
                            value={formData.startTime}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                            required
                            disabled={isLoading}
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
                            End Time
                          </label>
                          <input
                            type="time"
                            name="endTime"
                            id="endTime"
                            value={formData.endTime}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                            required
                            disabled={isLoading}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="courseId" className="block text-sm font-medium text-gray-700">
                          Course ID
                        </label>
                        <input
                          type="text"
                          name="courseId"
                          id="courseId"
                          value={formData.courseId}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                          required
                          disabled={isLoading}
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="groupId" className="block text-sm font-medium text-gray-700">
                          Group ID
                        </label>
                        <input
                          type="text"
                          name="groupId"
                          id="groupId"
                          value={formData.groupId}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                          required
                          disabled={isLoading}
                        />
                      </div>
                      
                      {error && (
                        <div className="text-sm text-red-600 mt-2">
                          {error}
                        </div>
                      )}
                      
                      {success && (
                        <div className="text-sm text-green-600 mt-2">
                          {success}
                        </div>
                      )}
                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                        onClick={() => setIsCreateModalOpen(false)}
                        disabled={isLoading}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className={`inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                          isLoading 
                            ? 'bg-orange-400 cursor-not-allowed' 
                            : 'bg-orange-600 hover:bg-orange-700 focus:ring-orange-500'
                        }`}
                        disabled={isLoading}
                      >
                        {isLoading ? 'Creating...' : 'Create Meeting'}
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
} 