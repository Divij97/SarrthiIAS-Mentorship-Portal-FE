'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { XMarkIcon, ClockIcon, CalendarIcon, UserGroupIcon, AcademicCapIcon, VideoCameraIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { Meeting } from '@/types/meeting';
import { formatTimeDisplay } from '@/utils/date-time-utils';

interface MeetingDetailProps {
  meeting: Meeting | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (meeting: Meeting) => void;
  onCancel?: (meeting: Meeting) => void;
}

export default function MeetingDetail({ meeting, isOpen, onClose, onEdit, onCancel }: MeetingDetailProps) {
  if (!meeting) return null;

  const formattedDate = meeting.date ? format(new Date(meeting.date), 'EEEE, MMMM d, yyyy') : '';
  
  return (
    <Transition appear show={isOpen} as={Fragment}>
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
                    Meeting Details
                  </Dialog.Title>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500"
                    onClick={onClose}
                  >
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 break-words">{meeting.title}</h4>
                  </div>

                  {meeting.description && (
                    <div>
                      <p className="text-sm text-gray-600 break-words">{meeting.description}</p>
                    </div>
                  )}

                  <div className="flex items-center text-sm text-gray-600">
                    <CalendarIcon className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                    <span className="break-words">{formattedDate}</span>
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <ClockIcon className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                    <span className="break-words">{formatTimeDisplay(meeting.startTime)} - {formatTimeDisplay(meeting.endTime)}</span>
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <VideoCameraIcon className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                    {meeting.zoomLink ? (
                      <a 
                        href={meeting.zoomLink} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-blue-600 hover:text-blue-800 hover:underline break-words"
                      >
                        Join Zoom Meeting
                      </a>
                    ) : (
                      <span className="text-amber-600 flex items-center">
                        <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                        Zoom link pending
                      </span>
                    )}
                  </div>

                  {(meeting.menteeFullName || meeting.menteeUsername) && (
                    <div className="flex items-center text-sm text-gray-600">
                      <UserGroupIcon className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                      <span className="break-words">Mentee: {meeting.menteeFullName || meeting.menteeUsername}</span>
                    </div>
                  )}

                  {meeting.courseId && (
                    <div className="flex items-center text-sm text-gray-600">
                      <AcademicCapIcon className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                      <span className="break-words">Course ID: {meeting.courseId}</span>
                    </div>
                  )}

                  {meeting.groupId && (
                    <div className="flex items-center text-sm text-gray-600">
                      <UserGroupIcon className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                      <span className="break-words">Group ID: {meeting.groupId}</span>
                    </div>
                  )}
                </div>

                {(onEdit || onCancel) && (
                  <div className="mt-6 flex justify-end space-x-3">
                    {onEdit && (
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-orange-100 px-4 py-2 text-sm font-medium text-orange-900 hover:bg-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                        onClick={() => onEdit(meeting)}
                      >
                        Edit Meeting
                      </button>
                    )}
                    {onCancel && (
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        onClick={() => onCancel(meeting)}
                      >
                        Cancel Meeting
                      </button>
                    )}
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