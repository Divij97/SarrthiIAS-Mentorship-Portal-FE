import { useSessionStore } from '@/stores/session/store';
import AddSessionModal from '@/components/modals/AddSessionModal';
import CancelSessionModal from '@/components/modals/CancelSessionModal';
import { MentorResponse } from '@/types/mentor';
import { useRef } from 'react';
import { useMentorRefresh } from '@/hooks/useMentorRefresh';

interface SessionModalsProps {
  mentorResponse: MentorResponse | null;
  setMentorResponse: (response: MentorResponse) => void;
}

function CancelSessionModalContainer({ mentorResponse, setMentorResponse }: SessionModalsProps) {
  // Store references to avoid recreating functions on each render
  const sessionStoreRef = useRef(useSessionStore.getState());
  const { refreshMentorData } = useMentorRefresh();
  
  // Use primitive selectors
  const isOpen = useSessionStore(state => state.modals.cancel.isOpen);
  const selectedSession = useSessionStore(state => state.modals.selectedSession);
  const actionLoading = useSessionStore(state => state.modals.actionLoading);
  const actionError = useSessionStore(state => state.modals.actionError);
  
  const handleCancel = async () => {
    if (mentorResponse && selectedSession) {
      const { date } = sessionStoreRef.current.modals.cancel;
      await sessionStoreRef.current.cancelSession(mentorResponse, setMentorResponse, date, refreshMentorData);
    }
  };
  
  return (
    <CancelSessionModal 
      isOpen={isOpen}
      session={selectedSession}
      isLoading={actionLoading}
      error={actionError}
      onClose={sessionStoreRef.current.closeCancelModal}
      onCancel={handleCancel}
    />
  );
}

function AddSessionModalContainer({ mentorResponse, setMentorResponse }: SessionModalsProps) {
  // Store references to avoid recreating functions on each render
  const sessionStoreRef = useRef(useSessionStore.getState());
  const { refreshMentorData } = useMentorRefresh();
  
  // Use primitive selectors
  const isOpen = useSessionStore(state => state.modals.add.isOpen);
  const formData = useSessionStore(state => state.modals.add.formData);
  const actionLoading = useSessionStore(state => state.modals.actionLoading);
  const actionError = useSessionStore(state => state.modals.actionError);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mentorResponse) {
      await sessionStoreRef.current.addNewSession(mentorResponse, setMentorResponse, refreshMentorData);
    }
  };
  
  return (
    <AddSessionModal 
      isOpen={isOpen}
      formData={formData}
      isLoading={actionLoading}
      error={actionError}
      onClose={sessionStoreRef.current.closeAddModal}
      onFormChange={sessionStoreRef.current.updateAddFormField}
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