'use client';

import { useEffect, useState } from 'react';
import { useLoginStore } from '@/stores/auth/store';
import { useMentorStore } from '@/stores/mentor/store';
import { SessionCard } from '@/components/Sessions/SessionCard';
import { MentorshipSession } from '@/types/session';
import { combinedSessionsFromMentor } from '@/utils/session-utlis';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { XMarkIcon, ClockIcon, CalendarIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { DayOfWeek } from '@/types/mentor';

// First, let's update the SessionCard component to accept our new props
interface EnhancedSessionCardProps {
  date: string;
  sessions: MentorshipSession[];
  onEditSession?: (session: MentorshipSession) => void;
  onCancelSession?: (session: MentorshipSession) => void;
}

// Create an enhanced version of SessionCard that supports editing and cancellation
const EnhancedSessionCard = ({ date, sessions, onEditSession, onCancelSession }: EnhancedSessionCardProps) => {
  const SessionCardComponent = SessionCard as any; // Type cast to avoid prop type errors
  
  // Render the original SessionCard
  return (
    <div className="relative">
      <SessionCardComponent date={date} sessions={sessions} />
      
      {/* Add edit/cancel buttons for each session */}
      {(onEditSession || onCancelSession) && (
        <div className="mt-4 space-y-4">
          {sessions.map(session => (
            <div key={session.id} className="flex justify-end space-x-3 px-6 pb-4">
              {onEditSession && (
                <button
                  onClick={() => onEditSession(session)}
                  className="text-sm text-orange-600 hover:text-orange-800 font-medium"
                >
                  Edit Schedule
                </button>
              )}
              {onCancelSession && (
                <button
                  onClick={() => onCancelSession(session)}
                  className="text-sm text-red-600 hover:text-red-800 font-medium"
                >
                  Cancel Session
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Mock API functions - replace with actual API calls
const updateSessionSchedule = async (sessionId: string, startTime: string, endTime: string): Promise<MentorshipSession> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: sessionId,
        startTime,
        endTime,
        // Other fields would be returned by the API
      } as MentorshipSession);
    }, 1000);
  });
};

const cancelSession = async (sessionId: string): Promise<{ success: boolean }> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 1000);
  });
};

export default function MentorSessionsPage() {
  const { authHeader } = useLoginStore();
  const { mentor, mentorResponse, setMentorResponse } = useMentorStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [combinedSessions, setCombinedSessions] = useState<Record<string, MentorshipSession[]>>({});
  
  // Session editing state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<MentorshipSession | null>(null);
  const [editFormData, setEditFormData] = useState({ startTime: '', endTime: '' });
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    if (!mentor) {
      setError('Authentication required');
      setLoading(false);
      return;
    }
    
    if (!mentorResponse) {
      setError('No sessions data available');
      setLoading(false);
      return;
    }
    
    // Combine sessions from both sources
    const combined = combinedSessionsFromMentor(mentorResponse);
    setCombinedSessions(combined);
    setLoading(false);
  }, [mentor, mentorResponse]);

  const handleEditClick = (session: MentorshipSession) => {
    setSelectedSession(session);
    setEditFormData({
      startTime: session.startTime.substring(0, 5), // Extract HH:MM
      endTime: session.endTime.substring(0, 5), // Extract HH:MM
    });
    setIsEditModalOpen(true);
    setActionError(null);
  };

  const handleCancelClick = (session: MentorshipSession) => {
    setSelectedSession(session);
    setIsCancelModalOpen(true);
    setActionError(null);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedSession || !authHeader) return;
    
    setActionLoading(true);
    setActionError(null);
    
    try {
      // Call API to update session
      const updatedSession = await updateSessionSchedule(
        selectedSession.id,
        editFormData.startTime,
        editFormData.endTime
      );
      
      // Update local state
      const updatedSessions = { ...combinedSessions };
      
      // Find which date contains this session
      Object.entries(updatedSessions).forEach(([date, sessions]) => {
        const sessionIndex = sessions.findIndex(s => s.id === selectedSession.id);
        if (sessionIndex !== -1) {
          // Update the session in place
          updatedSessions[date][sessionIndex] = {
            ...sessions[sessionIndex],
            startTime: editFormData.startTime,
            endTime: editFormData.endTime
          };
        }
      });
      
      setCombinedSessions(updatedSessions);
      
      // Update in store (this would update localStorage)
      if (mentorResponse) {
        // Update in sessionsByDate
        const updatedMentorResponse = { ...mentorResponse };
        
        Object.entries(updatedMentorResponse.sessionsByDate).forEach(([date, sessions]) => {
          const sessionIndex = sessions.findIndex(s => s.id === selectedSession.id);
          if (sessionIndex !== -1) {
            updatedMentorResponse.sessionsByDate[date][sessionIndex] = {
              ...sessions[sessionIndex],
              startTime: editFormData.startTime,
              endTime: editFormData.endTime
            };
          }
        });
        
        // Update in sessionsByDayOfWeek if it exists
        if (updatedMentorResponse.sessionsByDayOfWeek) {
          Object.entries(updatedMentorResponse.sessionsByDayOfWeek).forEach(([day, sessions]) => {
            if (sessions) {
              const dayKey = day as DayOfWeek;
              const sessionIndex = updatedMentorResponse.sessionsByDayOfWeek[dayKey]?.findIndex(
                s => s.id === selectedSession.id
              );
              
              if (sessionIndex !== undefined && sessionIndex !== -1) {
                const updatedSessions = [...(updatedMentorResponse.sessionsByDayOfWeek[dayKey] || [])];
                updatedSessions[sessionIndex] = {
                  ...updatedSessions[sessionIndex],
                  startTime: editFormData.startTime,
                  endTime: editFormData.endTime
                };
                updatedMentorResponse.sessionsByDayOfWeek[dayKey] = updatedSessions;
              }
            }
          });
        }
        
        setMentorResponse(updatedMentorResponse);
      }
      
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Failed to update session:', error);
      setActionError('Failed to update session. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelSession = async () => {
    if (!selectedSession || !authHeader) return;
    
    setActionLoading(true);
    setActionError(null);
    
    try {
      // Call API to cancel session
      const result = await cancelSession(selectedSession.id);
      
      if (result.success) {
        // Remove session from local state
        const updatedSessions = { ...combinedSessions };
        
        // Find and remove the session
        Object.entries(updatedSessions).forEach(([date, sessions]) => {
          updatedSessions[date] = sessions.filter(s => s.id !== selectedSession.id);
        });
        
        setCombinedSessions(updatedSessions);
        
        // Update in store (this would update localStorage)
        if (mentorResponse) {
          const updatedMentorResponse = { ...mentorResponse };
          
          // Remove from sessionsByDate
          Object.entries(updatedMentorResponse.sessionsByDate).forEach(([date, sessions]) => {
            updatedMentorResponse.sessionsByDate[date] = sessions.filter(s => s.id !== selectedSession.id);
          });
          
          // Remove from sessionsByDayOfWeek if it exists
          if (updatedMentorResponse.sessionsByDayOfWeek) {
            Object.entries(updatedMentorResponse.sessionsByDayOfWeek).forEach(([day, sessions]) => {
              if (sessions) {
                const dayKey = day as DayOfWeek;
                if (updatedMentorResponse.sessionsByDayOfWeek[dayKey]) {
                  updatedMentorResponse.sessionsByDayOfWeek[dayKey] = 
                    updatedMentorResponse.sessionsByDayOfWeek[dayKey]?.filter(
                      s => s.id !== selectedSession.id
                    ) || [];
                }
              }
            });
          }
          
          setMentorResponse(updatedMentorResponse);
        }
        
        setIsCancelModalOpen(false);
      } else {
        throw new Error('Failed to cancel session');
      }
    } catch (error) {
      console.error('Failed to cancel session:', error);
      setActionError('Failed to cancel session. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading sessions...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900">Your Mentorship Schedule</h1>
          <p className="mt-2 text-gray-600">
            View and manage your upcoming mentorship sessions
          </p>
        </div>

        <div className="space-y-8">
          {Object.entries(combinedSessions).map(([date, dateSessions]) => (
            <EnhancedSessionCard 
              key={date} 
              date={date} 
              sessions={dateSessions} 
              onEditSession={handleEditClick}
              onCancelSession={handleCancelClick}
            />
          ))}

          {Object.keys(combinedSessions).length === 0 && (
            <div className="text-center text-gray-500">
              No upcoming sessions found
            </div>
          )}
        </div>
      </div>

      {/* Edit Session Modal */}
      <Transition appear show={isEditModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => !actionLoading && setIsEditModalOpen(false)}>
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
                      Edit Session Schedule
                    </Dialog.Title>
                    <button
                      type="button"
                      className="text-gray-400 hover:text-gray-500"
                      onClick={() => !actionLoading && setIsEditModalOpen(false)}
                      disabled={actionLoading}
                    >
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>

                  {selectedSession && (
                    <form onSubmit={handleEditSubmit}>
                      <div className="mt-2 space-y-4">
                        <div>
                          <label htmlFor="mentee-name" className="block text-sm font-medium text-gray-700">
                            Mentee
                          </label>
                          <div className="mt-1 p-2 bg-gray-50 rounded-md text-gray-700">
                            {selectedSession.menteeUsername}
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
                              value={editFormData.startTime}
                              onChange={(e) => setEditFormData({ ...editFormData, startTime: e.target.value })}
                              required
                              disabled={actionLoading}
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
                              value={editFormData.endTime}
                              onChange={(e) => setEditFormData({ ...editFormData, endTime: e.target.value })}
                              required
                              disabled={actionLoading}
                            />
                          </div>
                        </div>

                        {actionError && (
                          <div className="text-sm text-red-600 mt-2">
                            {actionError}
                          </div>
                        )}
                      </div>

                      <div className="mt-6 flex justify-end space-x-3">
                        <button
                          type="button"
                          className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                          onClick={() => setIsEditModalOpen(false)}
                          disabled={actionLoading}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className={`inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                            actionLoading 
                              ? 'bg-orange-400 cursor-not-allowed' 
                              : 'bg-orange-600 hover:bg-orange-700 focus:ring-orange-500'
                          }`}
                          disabled={actionLoading}
                        >
                          {actionLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                      </div>
                    </form>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Cancel Session Modal */}
      <Transition appear show={isCancelModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => !actionLoading && setIsCancelModalOpen(false)}>
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

                  {selectedSession && (
                    <div>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Are you sure you want to cancel your session with {selectedSession.menteeUsername}? This action cannot be undone.
                        </p>
                      </div>

                      {actionError && (
                        <div className="text-sm text-red-600 mt-4">
                          {actionError}
                        </div>
                      )}

                      <div className="mt-6 flex justify-end space-x-3">
                        <button
                          type="button"
                          className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                          onClick={() => setIsCancelModalOpen(false)}
                          disabled={actionLoading}
                        >
                          Go Back
                        </button>
                        <button
                          type="button"
                          className={`inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                            actionLoading 
                              ? 'bg-red-400 cursor-not-allowed' 
                              : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                          }`}
                          onClick={handleCancelSession}
                          disabled={actionLoading}
                        >
                          {actionLoading ? 'Cancelling...' : 'Cancel Session'}
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
    </div>
  );
} 