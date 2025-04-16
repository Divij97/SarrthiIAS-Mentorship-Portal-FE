import { MenteesForCsvExport, StrippedDownMentee } from '@/types/mentee';
import { UserPlusIcon } from '@heroicons/react/24/outline';
import { useAdminAuthStore } from '@/stores/auth/admin-auth-store';
import { useState } from 'react';
import { sendOnBoardingEmail } from '@/services/mentors';
import { toast } from 'react-hot-toast';
import { BackendError, FetchError } from '@/types/error';

interface MenteeRowProps {
  mentee: MenteesForCsvExport;
  assigningMentor: string | null;
  onAssignMentor: (mentee: MenteesForCsvExport) => void;
}

export default function MenteeRow({
  mentee,
  assigningMentor,
  onAssignMentor
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
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {mentee.assignedMentor ? mentee.assignedMentor.name : '-'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-2">
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
          {mentee.phone !== null && assigningMentor === mentee.phone ? 'Assigning...' : 'Assign Mentor'}
        </button>
      </td>
    </tr>
  );
} 