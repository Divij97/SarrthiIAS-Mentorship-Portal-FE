import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { XMarkIcon, ClockIcon, CalendarIcon, UserIcon } from '@heroicons/react/24/outline';
import { MenteeIdentifier } from '@/types/mentor';
import { useMentorStore } from '@/stores/mentor/store';

interface AddSessionFormData {
  date: string;
  startTime: string;
  endTime: string;
  menteeUsername: string;
}

interface AddSessionModalProps {
  isOpen: boolean;
  formData: AddSessionFormData;
  isLoading: boolean;
  error: string | null;
  onClose: () => void;
  onFormChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

export default function AddSessionModal({
  isOpen,
  formData,
  isLoading,
  error,
  onClose,
  onFormChange,
  onSubmit
}: AddSessionModalProps) {
  const { mentorResponse } = useMentorStore();
  const assignedMentees = mentorResponse?.assignedMentees || [];
  
  console.log('AddSessionModal render with isOpen:', isOpen);
  console.log('AddSessionModal formData:', formData);
  
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => !isLoading && onClose()}>
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
                    Add New Session
                  </Dialog.Title>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500"
                    onClick={() => !isLoading && onClose()}
                    disabled={isLoading}
                  >
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <form onSubmit={onSubmit}>
                  <div className="mt-2 space-y-4">
                    <div>
                      <label htmlFor="mentee-username" className="block text-sm font-medium text-gray-700">
                        Mentee
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <UserIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </div>
                        <select
                          id="mentee-username"
                          className="focus:ring-orange-500 focus:border-orange-500 block w-full pl-10 pr-10 py-2 sm:text-sm border-gray-300 rounded-md"
                          value={formData.menteeUsername}
                          onChange={(e) => {
                            const mentee = assignedMentees.find((mentee) => mentee.phone === e.target.value);
                            onFormChange('menteeUsername', mentee?.phone || '');
                            onFormChange('menteeFullName', mentee?.name || '');
                          }}
                          required
                          disabled={isLoading}
                        >
                          <option value="">Select a mentee</option>
                          {assignedMentees.map((mentee) => (
                            <option key={mentee.phone} value={mentee.phone}>
                              {mentee.name} ({mentee.phone})
                            </option>
                          ))}
                        </select>
                      </div>
                      {assignedMentees.length === 0 && (
                        <p className="mt-1 text-xs text-gray-500">
                          No mentees available. Please check your mentor assignments.
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="session-date" className="block text-sm font-medium text-gray-700">
                        Session Date (This week or next week only)
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <CalendarIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </div>
                        <input
                          type="date"
                          id="session-date"
                          className="focus:ring-orange-500 focus:border-orange-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                          value={formData.date}
                          onChange={(e) => onFormChange('date', e.target.value)}
                          required
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="start-time" className="block text-sm font-medium text-gray-700">
                        Start Time
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <ClockIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </div>
                        <input
                          type="time"
                          id="start-time"
                          className="focus:ring-orange-500 focus:border-orange-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                          value={formData.startTime}
                          onChange={(e) => onFormChange('startTime', e.target.value)}
                          required
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="end-time" className="block text-sm font-medium text-gray-700">
                        End Time
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <ClockIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </div>
                        <input
                          type="time"
                          id="end-time"
                          className="focus:ring-orange-500 focus:border-orange-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                          value={formData.endTime}
                          onChange={(e) => onFormChange('endTime', e.target.value)}
                          required
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    {error && (
                      <div className="text-sm text-red-600 mt-2">
                        {error}
                      </div>
                    )}
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                      onClick={onClose}
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
                      {isLoading ? 'Adding...' : 'Add Session'}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
} 