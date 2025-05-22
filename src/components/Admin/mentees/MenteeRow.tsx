import { MenteesForCsvExport, StrippedDownMentee } from '@/types/mentee';
import { UserPlusIcon, UserMinusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useAdminAuthStore } from '@/stores/auth/admin-auth-store';
import { useState } from 'react';
import { sendOnBoardingEmail } from '@/services/mentors';
import { toast } from 'react-hot-toast';
import { BackendError, FetchError } from '@/types/error';

interface MenteeRowProps {
  mentee: MenteesForCsvExport;
  assigningMentor: string | null;
  onAssignMentor: (mentee: MenteesForCsvExport) => void;
  onUnassignMentor: (menteePhone: string) => Promise<void>;
  unassigningMentor: string | null;
  onEditMentee: (mentee: MenteesForCsvExport) => void;
  onDeleteMentee: (menteePhone: string) => Promise<void>;
  deletingMentee: string | null;
  getCourseNames: (courseIds: string[]) => string;
}

export default function MenteeRow({
  mentee,
  assigningMentor,
  onAssignMentor,
  onUnassignMentor,
  unassigningMentor,
  onEditMentee,
  onDeleteMentee,
  deletingMentee,
  getCourseNames
}: MenteeRowProps) {

  const authHeader = useAdminAuthStore.getState().getAuthHeader();
  const [sendingEmail, setSendingEmail] = useState<string|null>(null);

  // Get the mentee's ID from the parent component
  const menteeId = (mentee as any).id;  // Type assertion since we know the parent is passing MenteeWithId
  const isUnassigning = unassigningMentor === menteeId;
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
    <tr key={menteeId}>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {mentee.name}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {mentee.email}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {mentee.phone}
      </td>
      <td className="px-6 py-4 text-sm text-gray-500">
        {mentee.assignedCourses && mentee.assignedCourses.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {getCourseNames(mentee.assignedCourses).split(', ').map((courseName, index) => (
              <span key={index} className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">
                {courseName}
              </span>
            ))}
          </div>
        ) : (
          '-'
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {mentee.assignedMentor ? mentee.assignedMentor.name : '-'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleSendOnboardingEmail(mentee)}
            disabled={isSendingEmail}
            className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md ${
              isSendingEmail
                ? 'bg-orange-100 text-orange-400 cursor-not-allowed'
                : 'text-orange-700 bg-orange-100 hover:bg-orange-200'
            }`}
          >
            {isSendingEmail ? 'Sending...' : 'Send Onboarding Email'}
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onAssignMentor(mentee)}
              disabled={isAssigning}
              className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md ${
                isAssigning
                  ? 'bg-blue-100 text-blue-400 cursor-not-allowed'
                  : 'text-blue-700 bg-blue-100 hover:bg-blue-200'
              }`}
            >
              <UserPlusIcon className="h-4 w-4 mr-1" />
              {isAssigning ? 'Assigning...' : 'Assign Mentor'}
            </button>
            <button
              onClick={() => onUnassignMentor(mentee.phone)}
              disabled={isUnassigning}
              className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md ${
                isUnassigning
                  ? 'bg-red-100 text-red-400 cursor-not-allowed'
                  : 'text-red-700 bg-red-100 hover:bg-red-200'
              }`}
            >
              <UserMinusIcon className="h-4 w-4 mr-1" />
              {isUnassigning ? 'Unassigning...' : 'Unassign Mentor'}
            </button>
          </div>

          <button
            onClick={() => onEditMentee(mentee)}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200"
          >
            Edit Details
          </button>

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
      </td>
    </tr>
  );
} 