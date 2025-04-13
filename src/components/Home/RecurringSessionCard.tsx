import { DeleteRecurringSessionRequest, MentorshipSession } from '@/types/session';
import { useMentorStore } from '@/stores/mentor/store';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { DayOfWeek } from '@/types/mentor';
import { useLoginStore } from '@/stores/auth/store';
import { cancelRecurringSession } from '@/services/mentors';
import { getMentorByPhone } from '@/services/mentors';
import { format } from 'date-fns';

interface RecurringSessionCardProps {
  session: MentorshipSession;
  dayOfWeek: DayOfWeek;
}

export function RecurringSessionCard({ session, dayOfWeek }: RecurringSessionCardProps) {
  const { mentorResponse, setMentorResponse, removeFromSessionsByDayOfWeek, removeFromSessionsByDate } = useMentorStore();
  const authHeader = useLoginStore((state) => state.getAuthHeader());
  const [isCancelling, setIsCancelling] = useState(false);

  const handleCancel = async () => {
    if (isCancelling || !mentorResponse) return;
    
    setIsCancelling(true);
    try {
      const deleteRecurringSessionRequest: DeleteRecurringSessionRequest = {
        sessionId: session.id,
        dayOfWeek: dayOfWeek as DayOfWeek
      }
      await cancelRecurringSession(deleteRecurringSessionRequest, authHeader||'');
      if (mentorResponse.username) { 
        const response = await getMentorByPhone(mentorResponse.username, authHeader||'');
        setMentorResponse(response);
      }
      
      removeFromSessionsByDayOfWeek(dayOfWeek, session.id);
      toast.success('Recurring session cancelled successfully');
    } catch (error) {
      console.error('Failed to cancel recurring session:', error);
      toast.error('Failed to cancel recurring session. Please try again.');
    } finally {
      setIsCancelling(false);
    }
  };

  // Format the start date from YYYY-MM-DD to a more readable format
  const formattedStartDate = session.recurrence?.startDate 
    ? format(new Date(session.recurrence.startDate), 'MMM d, yyyy')
    : 'Not specified';

  // Format the recurrence type to be more user-friendly
  const formattedFrequency = session.recurrence?.recurrenceType === 'WEEKLY' 
    ? 'Weekly' 
    : session.recurrence?.recurrenceType === 'BI_WEEKLY' 
      ? 'Bi Weekly' 
      : 'Not specified';

  return (
    <div className="border rounded-md p-4">
      <div className="space-y-2">
        <p className="font-medium text-gray-900">{session.menteeFullName}</p>
        <div className="text-sm text-gray-500 space-y-1">
          <p>
            {session.startTime} - {session.endTime}
          </p>
          <p>
            Frequency: {formattedFrequency}
          </p>
          <p>
            Starts: {formattedStartDate}
          </p>
        </div>
        <div className="flex gap-2 mt-2">
          {session.zoomLink && (
            <a
              href={session.zoomLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Join Meeting
            </a>
          )}
          <button
            onClick={handleCancel}
            disabled={isCancelling}
            className="text-sm text-red-600 hover:text-red-800 disabled:opacity-50"
          >
            {isCancelling ? 'Cancelling...' : 'Cancel Schedule'}
          </button>
        </div>
      </div>
    </div>
  );
} 