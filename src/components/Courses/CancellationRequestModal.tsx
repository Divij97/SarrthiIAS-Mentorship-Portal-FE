import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { MenteeSession } from '@/types/mentee';
import { requestSessionCancellation } from '@/services/mentee';
import { toast } from 'react-hot-toast';
import { StrippedDownMentor } from '@/types/mentor';

interface CancellationRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: { [date: string]: MenteeSession[] };
  authHeader: string;
  mentor?: StrippedDownMentor | null;
}

export default function CancellationRequestModal({
  isOpen,
  onClose,
  sessions,
  authHeader,
  mentor
}: CancellationRequestModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState('');
  const [subject, setSubject] = useState('Request to Cancel Mentorship Session');
  const [eligibleSessions, setEligibleSessions] = useState<Array<{ id: string; displayText: string }>>([]);

  useEffect(() => {
    // Function to check if a session is at least 48 hours in the future
    const isSessionEligible = (sessionDate: string, startTime: string) => {
      // Parse the date string (assuming format DD/MM/YYYY)
      const [day, month, year] = sessionDate.split('/');
      const dateStr = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      
      // Create date object from session date and time
      const sessionDateTime = new Date(`${dateStr}T${startTime}`);
      
      // Check if it's at least 48 hours from now
      const now = new Date();
      const hoursDifference = (sessionDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
      
      return hoursDifference >= 48;
    };

    // Filter eligible sessions and format them for the dropdown
    const filteredSessions = Object.entries(sessions).flatMap(([date, sessionsForDate]) => 
      sessionsForDate
        .filter(session => isSessionEligible(date, session.startTime))
        .map(session => {
          const [day, month, year] = date.split('/');
          const formattedDate = new Date(
            parseInt(year), 
            parseInt(month) - 1, 
            parseInt(day)
          ).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });
          
          return {
            id: session.id,
            displayText: `${formattedDate} | ${session.startTime} - ${session.endTime}`
          };
        })
    );
    
    setEligibleSessions(filteredSessions);
    // Reset selected session if the modal reopens or sessions change
    setSelectedSessionId('');
  }, [sessions, isOpen]);

  const handleSubmit = async () => {
    if (!selectedSessionId || !mentor) return;
    
    try {
      setIsLoading(true);
      await requestSessionCancellation(selectedSessionId, subject, mentor, authHeader);
      toast.success('Cancellation request has been sent successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to send cancellation request');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                
                <div>
                  <div className="mt-3 text-center sm:mt-0 sm:text-left">
                    <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                      Request Session Cancellation
                    </Dialog.Title>
                    <div className="mt-4">
                      <p className="text-sm text-gray-500">
                        Fill out this form to request cancellation of an upcoming mentorship session.
                        Only sessions scheduled at least 48 hours in the future are eligible for cancellation.
                      </p>
                    </div>
                  </div>
                </div>

                {!mentor ? (
                  <div className="mt-6 p-4 bg-yellow-50 rounded-md">
                    <p className="text-sm text-yellow-700">
                      You don't have a mentor assigned yet. Once a mentor is assigned, you'll be able to request session cancellations.
                    </p>
                  </div>
                ) : (
                  <div className="mt-6 space-y-4">
                    <div>
                      <label htmlFor="to" className="block text-sm font-medium leading-6 text-gray-900">
                        To
                      </label>
                      <input
                        type="email"
                        name="to"
                        id="to"
                        value={mentor.email}
                        disabled
                        className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6 bg-gray-50"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium leading-6 text-gray-900">
                        Subject
                      </label>
                      <input
                        type="text"
                        name="subject"
                        id="subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="session" className="block text-sm font-medium leading-6 text-gray-900">
                        Session to Cancel
                      </label>
                      <select
                        id="session"
                        name="session"
                        value={selectedSessionId}
                        onChange={(e) => setSelectedSessionId(e.target.value)}
                        className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6"
                        required
                      >
                        <option value="">Select a session</option>
                        {eligibleSessions.map((session) => (
                          <option key={session.id} value={session.id}>
                            {session.displayText}
                          </option>
                        ))}
                        {eligibleSessions.length === 0 && (
                          <option value="" disabled>
                            No eligible sessions found
                          </option>
                        )}
                      </select>
                      {eligibleSessions.length === 0 && (
                        <p className="mt-1 text-xs text-red-600">
                          No sessions available for cancellation. Only sessions scheduled at least 48 hours in the future can be cancelled.
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!mentor || !selectedSessionId || isLoading}
                    className="inline-flex justify-center rounded-md border border-transparent bg-orange-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Sending...' : 'Send Request'}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
} 