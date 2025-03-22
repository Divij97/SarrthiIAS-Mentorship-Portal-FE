import { useSessionStore } from '@/stores/session/store';
import EditSessionModal from '@/components/modals/EditSessionModal';
import AddSessionModal from '@/components/modals/AddSessionModal';
import CancelSessionModal from '@/components/modals/CancelSessionModal';
import { MentorResponse } from '@/types/mentor';

interface SessionModalsProps {
  mentorResponse: MentorResponse | null;
  setMentorResponse: (response: MentorResponse) => void;
}

// Split into separate components for each modal to isolate state subscriptions
function EditSessionModalContainer({ mentorResponse, setMentorResponse }: SessionModalsProps) {
  const isOpen = useSessionStore(state => state.modals.edit.isOpen);
  const selectedSession = useSessionStore(state => state.modals.selectedSession);
  const formData = useSessionStore(state => state.modals.edit.formData);
  const actionLoading = useSessionStore(state => state.modals.actionLoading);
  const actionError = useSessionStore(state => state.modals.actionError);
  
  // Access functions directly from the store to avoid subscription issues
  const { closeEditModal, updateEditFormField, updateSession } = useSessionStore.getState();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mentorResponse) {
      await updateSession(mentorResponse, setMentorResponse);
    }
  };
  
  return (
    <EditSessionModal 
      isOpen={isOpen}
      session={selectedSession}
      formData={formData}
      isLoading={actionLoading}
      error={actionError}
      onClose={closeEditModal}
      onFormChange={updateEditFormField}
      onSubmit={handleSubmit}
    />
  );
}

function CancelSessionModalContainer({ mentorResponse, setMentorResponse }: SessionModalsProps) {
  const isOpen = useSessionStore(state => state.modals.cancel.isOpen);
  const selectedSession = useSessionStore(state => state.modals.selectedSession);
  const actionLoading = useSessionStore(state => state.modals.actionLoading);
  const actionError = useSessionStore(state => state.modals.actionError);
  
  // Access functions directly from the store to avoid subscription issues
  const { closeCancelModal, cancelSession } = useSessionStore.getState();
  
  const handleCancel = async () => {
    if (mentorResponse) {
      await cancelSession(mentorResponse, setMentorResponse);
    }
  };
  
  return (
    <CancelSessionModal 
      isOpen={isOpen}
      session={selectedSession}
      isLoading={actionLoading}
      error={actionError}
      onClose={closeCancelModal}
      onCancel={handleCancel}
    />
  );
}

function AddSessionModalContainer({ mentorResponse, setMentorResponse }: SessionModalsProps) {
  const isOpen = useSessionStore(state => state.modals.add.isOpen);
  const formData = useSessionStore(state => state.modals.add.formData);
  const actionLoading = useSessionStore(state => state.modals.actionLoading);
  const actionError = useSessionStore(state => state.modals.actionError);
  const menteeList = useSessionStore(state => state.menteeList);
  const loadingMentees = useSessionStore(state => state.loadingMentees);
  
  // Access functions directly from the store to avoid subscription issues
  const { closeAddModal, updateAddFormField, addNewSession } = useSessionStore.getState();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mentorResponse) {
      await addNewSession(mentorResponse, setMentorResponse);
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
      onClose={closeAddModal}
      onFormChange={updateAddFormField}
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