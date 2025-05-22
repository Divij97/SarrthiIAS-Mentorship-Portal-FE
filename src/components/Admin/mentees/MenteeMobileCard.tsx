import { MenteesForCsvExport, StrippedDownMentee } from '@/types/mentee';
import { UserPlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useAdminAuthStore } from '@/stores/auth/admin-auth-store';
import { useState } from 'react';
import { sendOnBoardingEmail } from '@/services/mentors';
import { toast } from 'react-hot-toast';
import { BackendError, FetchError } from '@/types/error';

interface MenteeMobileCardProps {
  mentee: MenteesForCsvExport;
  assigningMentor: string | null;
  onAssignMentor: (mentee: MenteesForCsvExport) => void;
  onDeleteMentee: (menteePhone: string) => Promise<void>;
  deletingMentee: string | null;
  getCourseNames: (courseIds: string[]) => string;
}

export default function MenteeMobileCard({
  mentee,
  assigningMentor,
  onAssignMentor,
  onDeleteMentee,
  deletingMentee,
  getCourseNames
}: MenteeMobileCardProps) {
  const authHeader = useAdminAuthStore.getState().getAuthHeader();
  const [sendingEmail, setSendingEmail] = useState<string|null>(null);

  // Get the mentee's ID from the parent component
  const menteeId = (mentee as any).id;  // Type assertion since we know the parent is passing MenteeWithId
  const isAssigning = assigningMentor === menteeId;
  const isDeleting = deletingMentee === menteeId;
  const isSendingEmail = sendingEmail === menteeId;

  const handleSendOnboardingEmail = async (mentee: MenteesForCsvExport) => {
    if (!authHeader || sendingEmail) return;

    setSendingEmail(menteeId);

    try {
      const strippedMentee: StrippedDownMentee = {
        n: mentee.name,
        p: mentee.phone,
        e: mentee.email,
      };

      await sendOnBoardingEmail(strippedMentee, authHeader);
      toast.success(`Onboarding email sent successfully to ${mentee.name}`);
    } catch (error) {
      const errorResponse = error as FetchError<BackendError>;
      if (errorResponse.errorData && errorResponse.status) {
        toast.error(`Operation failed with status ${errorResponse.status}: ${errorResponse.errorData.errorCode}`)
      } else {
        toast.error(`Failed to send email to ${mentee.name}`)
      }
    } finally {
      setSendingEmail(null);
    }
  };

  return (
    <div key={menteeId} className="p-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-gray-900">{mentee.name}</h4>
          <span className="text-xs text-gray-500">{mentee.phone}</span>
        </div>
        <div className="text-sm text-gray-500">
          <p>{mentee.email}</p>
        </div>
        <div className="text-sm text-gray-500">
          <p>Assigned Courses:</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {mentee.assignedCourses && mentee.assignedCourses.length > 0 ? (
              getCourseNames(mentee.assignedCourses).split(', ').map((courseName, index) => (
                <span key={index} className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">
                  {courseName}
                </span>
              ))
            ) : (
              <span className="text-gray-500 text-xs">None</span>
            )}
          </div>
        </div>
        <div className="text-sm text-gray-500">
          <p>Assigned Mentor: {mentee.assignedMentor ? mentee.assignedMentor.name : '-'}</p>
        </div>
        <div className="pt-2 space-y-2">
          <button
            onClick={() => handleSendOnboardingEmail(mentee)}
            disabled={isSendingEmail}
            className={`w-full inline-flex justify-center items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md ${
              isSendingEmail
                ? 'bg-orange-100 text-orange-400 cursor-not-allowed'
                : 'text-orange-700 bg-orange-100 hover:bg-orange-200'
            }`}
          >
            {isSendingEmail ? 'Sending...' : 'Send Onboarding Email'}
          </button>
          {
            <button
              onClick={() => onAssignMentor(mentee)}
              disabled={isAssigning}
              className={`w-full inline-flex justify-center items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md ${
                isAssigning
                  ? 'bg-blue-100 text-blue-400 cursor-not-allowed'
                  : 'text-blue-700 bg-blue-100 hover:bg-blue-200'
              }`}
            >
              <UserPlusIcon className="h-4 w-4 mr-1" />
              {isAssigning ? 'Assigning...' : 'Assign Mentor'}
            </button>
          }
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => onDeleteMentee(mentee.phone)}
            disabled={isDeleting}
            className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md ${
              isDeleting
                ? 'bg-red-100 text-red-400 cursor-not-allowed'
                : 'text-red-700 bg-red-100 hover:bg-red-200'
            }`}
          >
            <TrashIcon className="h-4 w-4 mr-1" />
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
} 