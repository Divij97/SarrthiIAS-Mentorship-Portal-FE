import { useSessionStore } from '@/stores/session/store';
import EditSessionModal from '@/components/modals/EditSessionModal';
import AddSessionModal from '@/components/modals/AddSessionModal';
import CancelSessionModal from '@/components/modals/CancelSessionModal';
import { MentorResponse } from '@/types/mentor';
import { useRef } from 'react';

interface SessionModalsProps {
  mentorResponse: MentorResponse | null;
  setMentorResponse: (response: MentorResponse) => void;
}

// Split into separate components for each modal to isolate state subscriptions
function EditSessionModalContainer({ mentorResponse, setMentorResponse }: SessionModalsProps) {
  // Store references to avoid recreating functions on each render
  const sessionStoreRef = useRef(useSessionStore.getState());
  
  // Use primitive selectors
  const isOpen = useSessionStore(state => state.modals.edit.isOpen);
  const selectedSession = useSessionStore(state => state.modals.selectedSession);
  const formData = useSessionStore(state => state.modals.edit.formData);
  const actionLoading = useSessionStore(state => state.modals.actionLoading);
  const actionError = useSessionStore(state => state.modals.actionError);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mentorResponse) {
      await sessionStoreRef.current.updateSession(mentorResponse, setMentorResponse);
    }
  };
  
  return (
    <EditSessionModal 
      isOpen={isOpen}
      session={selectedSession}
      formData={formData}
      isLoading={actionLoading}
      error={actionError}
      onClose={sessionStoreRef.current.closeEditModal}
      onFormChange={sessionStoreRef.current.updateEditFormField}
      onSubmit={handleSubmit}
    />
  );
}

function CancelSessionModalContainer({ mentorResponse, setMentorResponse }: SessionModalsProps) {
  // Store references to avoid recreating functions on each render
  const sessionStoreRef = useRef(useSessionStore.getState());
  
  // Use primitive selectors
  const isOpen = useSessionStore(state => state.modals.cancel.isOpen);
  const selectedSession = useSessionStore(state => state.modals.selectedSession);
  const actionLoading = useSessionStore(state => state.modals.actionLoading);
  const actionError = useSessionStore(state => state.modals.actionError);
  
  const handleCancel = async () => {
    if (mentorResponse) {
      await sessionStoreRef.current.cancelSession(mentorResponse, setMentorResponse);
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
  
  // Use primitive selectors
  const isOpen = useSessionStore(state => state.modals.add.isOpen);
  const formData = useSessionStore(state => state.modals.add.formData);
  const actionLoading = useSessionStore(state => state.modals.actionLoading);
  const actionError = useSessionStore(state => state.modals.actionError);
  const menteeList = useSessionStore(state => state.menteeList);
  const loadingMentees = useSessionStore(state => state.loadingMentees);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mentorResponse) {
      await sessionStoreRef.current.addNewSession(mentorResponse, setMentorResponse);
    }
  };
  
  return (
    <AddSessionModal 
      isOpen={isOpen}
      formData={formData}
      menteeList={menteeList}
      loadingMentees={loadingMentees}
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
      <EditSessionModalContainer {...props} />
      <CancelSessionModalContainer {...props} />
      <AddSessionModalContainer {...props} />
    </>
  );
} 