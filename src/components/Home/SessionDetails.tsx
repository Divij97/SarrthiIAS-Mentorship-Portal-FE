'use client';

import { useState } from 'react';
import { useLoginStore } from '@/stores/auth/store';
import { getAllSessions } from '@/data/sessions';
import { UserType } from '@/types/auth';
import { MentorshipSession } from '@/types/session';
import { CalendarDaysIcon, ClockIcon } from '@heroicons/react/24/outline';
import { ZoomLinkButton } from '../ui/ZoomLinkButton';
import { ddmmyyyy } from '@/utils/date_time_utils';

export default function SessionDetails() {
  const { userType } = useLoginStore();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const isMentor = userType === UserType.MENTOR;
  
  const sessions = getAllSessions(isMentor);
  const dates = Object.keys(sessions.sessionsByDate);

  const renderSession = (session: MentorshipSession) => (
    <div
      key={session.id}
      className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow duration-200"
    >
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {isMentor ? session.menteeFullName : 'Your Session'}
            </h3>
            <div className="mt-2 space-y-2">
              <div className="flex items-center text-sm text-gray-500">
                <ClockIcon className="h-5 w-5 mr-2" />
                {session.startTime} - {session.endTime}
              </div>
              {isMentor && (
                <div className="text-sm text-gray-500">
                  Contact: {session.menteeUsername}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="pt-2 border-t border-gray-100">
          <ZoomLinkButton session={session}/>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 text-gray-500">
        <CalendarDaysIcon className="h-6 w-6" />
        <h2 className="text-xl font-medium">Upcoming Sessions</h2>
      </div>

      <div className="space-y-8">
        {dates.map((date) => {
          const daySessions = sessions.sessionsByDate[date];
          if (daySessions.length === 0) return null;

          return (
            <div key={date} className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                {ddmmyyyy(date)}
              </h3>
              <div className="space-y-4">
                {daySessions.map(renderSession)}
              </div>
            </div>
          );
        })}

        {dates.every(date => sessions.sessionsByDate[date].length === 0) && (
          <div className="text-center py-8">
            <p className="text-gray-500">No upcoming sessions scheduled</p>
          </div>
        )}
      </div>
    </div>
  );
} 