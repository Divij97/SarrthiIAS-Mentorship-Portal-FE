import { useState } from "react";
import { MenteeSession } from "@/types/mentee";
import CancellationRequestModal from "./CancellationRequestModal";
import { useLoginStore } from "@/stores/auth/store";
import { StrippedDownMentor } from "@/types/mentor";

interface MenteeSessionsProps {
  sessions: { [date: string]: MenteeSession[] };
  mentor?: StrippedDownMentor | null;
}

export default function MenteeSessions({ sessions, mentor }: MenteeSessionsProps) {
  const [isCancellationModalOpen, setIsCancellationModalOpen] = useState(false);
  const authHeader = useLoginStore((state) => state.getAuthHeader());
  
  // Flatten all sessions from all dates into a single array with their dates
  const allSessions = Object.entries(sessions).flatMap(([date, sessions]) =>
    sessions.map(session => ({ ...session, date }))
  );

  const handleOpenCancellationModal = () => {
    setIsCancellationModalOpen(true);
  };

  const handleCloseCancellationModal = () => {
    setIsCancellationModalOpen(false);
  };

  if (!allSessions.length) {
    return (
      <div className="text-gray-500 text-center py-4">
        No mentorship sessions scheduled yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Mentorship Sessions</h2>
        <button
          onClick={handleOpenCancellationModal}
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        >
          Request Cancellation
        </button>
      </div>
      
      <div className="space-y-4">
        {allSessions.map((session) => {
          // Parse the date string (assuming format DD/MM/YYYY)
          const [day, month, year] = session.date.split('/');
          const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
          
          const formattedDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });
          
          return (
            <div
              key={session.id}
              className="bg-white rounded-lg shadow p-6 border border-gray-200"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Mentorship Session
                  </h3>
                </div>
                {session.zi?.joinUrl && (
                  <a
                    href={session.zi?.joinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Join Meeting
                  </a>
                )}
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Date</p>
                  <p className="font-medium">{formattedDate}</p>
                </div>
                <div>
                  <p className="text-gray-500">Time</p>
                  <p className="font-medium">{session.st} - {session.et}</p>
                </div>
              </div>
              
              {session.zi?.joinUrl && (
                <div className="mt-4">
                  <p className="text-gray-500">Zoom Link</p>
                  <p className="font-medium text-blue-600 break-all">{session.zi.joinUrl}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <CancellationRequestModal
        isOpen={isCancellationModalOpen}
        onClose={handleCloseCancellationModal}
        sessions={sessions}
        authHeader={authHeader || ''}
        mentor={mentor}
      />
    </div>
  );
}