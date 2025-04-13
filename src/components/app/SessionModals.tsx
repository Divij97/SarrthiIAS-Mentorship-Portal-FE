import { useSessionStore } from '@/stores/session/store';
import AddSessionModal from '@/components/modals/AddSessionModal';
import CancelSessionModal from '@/components/modals/CancelSessionModal';
import { MentorResponse } from '@/types/mentor';
import { useRef } from 'react';
import { useMentorRefresh } from '@/hooks/useMentorRefresh';
import { useState } from 'react';
import { SessionManager } from '@/services/session-manager';
import { MentorshipSession } from '@/types/session';

interface SessionModalsProps {
  mentorResponse: MentorResponse | null;
  setMentorResponse: (response: MentorResponse) => void;
  isAddModalOpen: boolean;
  setIsAddModalOpen: (isOpen: boolean) => void;
  isCancelModalOpen: boolean;
  setIsCancelModalOpen: (isOpen: boolean) => void;
  selectedSession: MentorshipSession | null;
  setSelectedSession: (session: MentorshipSession | null) => void;
  cancelModalDate: string;
  setCancelModalDate: (date: string) => void;
  sessionManager: SessionManager | null;
}

function CancelSessionModalContainer({ 
  mentorResponse, 
  setMentorResponse,
  isCancelModalOpen,
  setIsCancelModalOpen,
  selectedSession,
  setSelectedSession,
  cancelModalDate,
  sessionManager
}: SessionModalsProps) {
  const handleCancel = async () => {
    if (mentorResponse && selectedSession && sessionManager) {
      try {
        await sessionManager.cancelSession(selectedSession.id, cancelModalDate, selectedSession.s);
        setIsCancelModalOpen(false);
        setSelectedSession(null);
      } catch (error) {
        console.error('Failed to cancel session:', error);
      }
    }
  };
  
  return (
    <CancelSessionModal 
      isOpen={isCancelModalOpen}
      session={selectedSession}
      isLoading={false}
      error={null}
      onClose={() => {
        setIsCancelModalOpen(false);
        setSelectedSession(null);
      }}
      onCancel={handleCancel}
    />
  );
}

function AddSessionModalContainer({ 
  mentorResponse, 
  setMentorResponse,
  isAddModalOpen,
  setIsAddModalOpen,
  sessionManager
}: SessionModalsProps) {
  // Form state
  const [formData, setFormData] = useState({
    date: '',
    startTime: '10:00',
    endTime: '11:00',
    menteeUsername: '',
    menteeFullName: ''
  });

  // Handle form field changes
  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mentorResponse && sessionManager) {
      try {
        const mentorUsername = mentorResponse.u || '';
        await sessionManager.addNewSession(
          mentorUsername,
          formData.date,
          formData.startTime,
          formData.endTime,
          formData.menteeUsername,
          formData.menteeFullName
        );

        // Close the modal and reset form
        setIsAddModalOpen(false);
        setFormData({
          date: '',
          startTime: '10:00',
          endTime: '11:00',
          menteeUsername: '',
          menteeFullName: ''
        });
      } catch (error) {
        console.error('Failed to add session:', error);
      }
    }
  };

  return (
    <AddSessionModal
      isOpen={isAddModalOpen}
      formData={formData}
      isLoading={false}
      error={null}
      onClose={() => setIsAddModalOpen(false)}
      onFormChange={handleFormChange}
      onSubmit={handleSubmit}
    />
  );
}

export default function SessionModals(props: SessionModalsProps) {
  return (
    <>
      <CancelSessionModalContainer {...props} />
      <AddSessionModalContainer {...props} />
    </>
  );
} 