import { MenteesForCsvExport, StrippedDownMentee } from '@/types/mentee';
import { UserPlusIcon, UserMinusIcon } from '@heroicons/react/24/outline';
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
  getCourseNames: (courseIds: string[]) => string;
}

export default function MenteeRow({
  mentee,
  assigningMentor,
  onAssignMentor,
  onUnassignMentor,
  unassigningMentor,
  onEditMentee,
  getCourseNames
}: MenteeRowProps) {

  const authHeader = useAdminAuthStore.getState().getAuthHeader();
  const [sendingEmail, setSendingEmail] = useState<string|null>(null);

  const handleSendOnboardingEmail = async (mentee: MenteesForCsvExport) => {
    if (!authHeader || sendingEmail) return;

    setSendingEmail(mentee.phone);

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
    <tr key={mentee.phone}>
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
            disabled={sendingEmail === mentee.phone}
            className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md ${
              sendingEmail === mentee.phone
                ? 'bg-orange-100 text-orange-400 cursor-not-allowed'
                : 'text-orange-700 bg-orange-100 hover:bg-orange-200'
            }`}
          >
            {mentee.phone !== null && sendingEmail === mentee.phone ? 'Sending...' : 'Send Onboarding Email'}
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onAssignMentor(mentee)}
              disabled={assigningMentor === mentee.phone}
              className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md ${
                assigningMentor === mentee.phone
                  ? 'bg-blue-100 text-blue-400 cursor-not-allowed'
                  : 'text-blue-700 bg-blue-100 hover:bg-blue-200'
              }`}
            >
              <UserPlusIcon className="h-4 w-4 mr-1" />
              {assigningMentor === mentee.phone ? 'Assigning...' : 'Assign Mentor'}
            </button>
            <button
              onClick={() => onUnassignMentor(mentee.phone)}
              disabled={unassigningMentor === mentee.phone}
              className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md ${
                unassigningMentor === mentee.phone
                  ? 'bg-red-100 text-red-400 cursor-not-allowed'
                  : 'text-red-700 bg-red-100 hover:bg-red-200'
              }`}
            >
              <UserMinusIcon className="h-4 w-4 mr-1" />
              {unassigningMentor === mentee.phone ? 'Unassigning...' : 'Unassign Mentor'}
            </button>
          </div>

          <button
            onClick={() => onEditMentee(mentee)}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200"
          >
            Edit Details
          </button>
        </div>
      </td>
    </tr>
  );
} 