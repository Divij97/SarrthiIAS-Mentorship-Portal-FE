import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { MentorshipSession } from '@/types/session';

interface CancelSessionModalProps {
  isOpen: boolean;
  session: MentorshipSession | null;
  isLoading: boolean;
  error: string | null;
  onClose: () => void;
  onCancel: () => Promise<void>;
}

export default function CancelSessionModal({
  isOpen,
  session,
  isLoading,
  error,
  onClose,
  onCancel
}: CancelSessionModalProps) {
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
                <div className="flex items-center mb-4">
                  <ExclamationTriangleIcon className="h-6 w-6 text-red-600 mr-3" aria-hidden="true" />
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    Cancel Session
                  </Dialog.Title>
                </div>

                {session && (
                  <div>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to cancel your session with {session.menteeUsername || 'this mentee'}? This action cannot be undone.
                      </p>
                    </div>

                    {error && (
                      <div className="text-sm text-red-600 mt-4">
                        {error}
                      </div>
                    )}

                    <div className="mt-6 flex justify-end space-x-3">
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                        onClick={onClose}
                        disabled={isLoading}
                      >
                        Go Back
                      </button>
                      <button
                        type="button"
                        className={`inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                          isLoading 
                            ? 'bg-red-400 cursor-not-allowed' 
                            : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                        }`}
                        onClick={onCancel}
                        disabled={isLoading}
                      >
                        {isLoading ? 'Cancelling...' : 'Cancel Session'}
                      </button>
                    </div>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
} 