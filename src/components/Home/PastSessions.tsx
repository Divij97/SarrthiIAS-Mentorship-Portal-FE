import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { CalendarIcon } from 'lucide-react';
import { MenteeSession } from '@/types/mentee';

interface PastSessionsProps {
  courseName: string;
  pastSessions?: { [key: string]: MenteeSession[] };
}

export default function PastSessions({ courseName, pastSessions }: PastSessionsProps) {
  const router = useRouter();

  const handleFeedbackClick = (sessionDate: string) => {
    router.push(`/home/courses/${courseName}/session-feedback?sessionDate=${sessionDate}`);
  };

  const formatDate = (dateStr: string) => {
    // Handle dd/mm/yyyy format
    if (dateStr.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
      const [day, month, year] = dateStr.split('/').map(Number);
      const date = new Date(year, month - 1, day);
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
    // Fallback for other formats
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Past Sessions</h3>
      </div>
      
      {!pastSessions || Object.keys(pastSessions).length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
          <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No past sessions</h3>
          <p className="mt-1 text-sm text-gray-500">
            Your past sessions will appear here once they are completed.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(pastSessions).map(([date, sessions]) => (
            <div key={date} className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-900">Session</p>
                  <p className="text-sm text-gray-500">{formatDate(date)}</p>
                </div>
                <Button
                  onClick={() => handleFeedbackClick(date)}
                  variant="primary"
                  className="text-sm bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100"
                >
                  Submit Feedback
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 