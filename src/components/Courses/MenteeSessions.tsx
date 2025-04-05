import { MenteeSession } from "@/types/mentee";

interface MenteeSessionsProps {
  sessions: { [date: string]: MenteeSession[] };
}

export default function MenteeSessions({ sessions }: MenteeSessionsProps) {
  // Flatten all sessions from all dates into a single array with their dates
  const allSessions = Object.entries(sessions).flatMap(([date, sessions]) =>
    sessions.map(session => ({ ...session, date }))
  );

  if (!allSessions.length) {
    return (
      <div className="text-gray-500 text-center py-4">
        No mentorship sessions scheduled yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">Mentorship Sessions</h2>
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
                {session.zoomLink && (
                  <a
                    href={session.zoomLink}
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
                  <p className="font-medium">{session.startTime} - {session.endTime}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}