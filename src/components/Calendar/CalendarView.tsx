'use client';

import { useState } from 'react';
import WeekCalendar from './WeekCalendar';
import MeetingDetail from './MeetingDetail';
import { Meeting } from '@/types/meeting';

interface CalendarViewProps {
  meetings: Meeting[];
  onCancelMeeting?: (meeting: Meeting) => void;
}

export default function CalendarView({ meetings, onCancelMeeting }: CalendarViewProps) {
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const handleMeetingClick = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    setIsDetailModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsDetailModalOpen(false);
  };

  const handleCancelMeeting = (meeting: Meeting) => {
    if (onCancelMeeting) {
      onCancelMeeting(meeting);
      setIsDetailModalOpen(false);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <WeekCalendar 
          meetings={meetings} 
          onMeetingClick={handleMeetingClick} 
        />
      </div>
      
      <MeetingDetail 
        meeting={selectedMeeting}
        isOpen={isDetailModalOpen}
        onClose={handleCloseModal}
        onCancel={selectedMeeting && !('isGroupSession' in selectedMeeting) ? handleCancelMeeting : undefined}
      />
    </div>
  );
} 