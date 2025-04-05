import { MentorshipSession } from '@/types/session';
import { useSessionStore } from '@/stores/session/store';
import { useMentorStore } from '@/stores/mentor/store';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { DayOfWeek } from '@/types/mentor';

interface RecurringSessionCardProps {
  session: MentorshipSession;
  dayOfWeek: DayOfWeek;
}

export function RecurringSessionCard({ session, dayOfWeek }: RecurringSessionCardProps) {
  const { cancelRecurringSession } = useSessionStore();
  const { mentorResponse, setMentorResponse } = useMentorStore();
  const [isCancelling, setIsCancelling] = useState(false);

  const handleCancel = async () => {
    if (isCancelling || !mentorResponse) return;
    
    setIsCancelling(true);
    try {
      await cancelRecurringSession(mentorResponse, setMentorResponse, session.id, dayOfWeek);
      toast.success('Recurring session cancelled successfully');
    } catch (error) {
      console.error('Failed to cancel recurring session:', error);
      toast.error('Failed to cancel recurring session. Please try again.');
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="border rounded-md p-4">
      <p className="font-medium text-gray-900">{session.menteeFullName}</p>
      <p className="text-sm text-gray-500">
        {session.startTime} - {session.endTime}
      </p>
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
          {isCancelling ? 'Cancelling...' : 'Cancel Session'}
        </button>
      </div>
    </div>
  );
} 