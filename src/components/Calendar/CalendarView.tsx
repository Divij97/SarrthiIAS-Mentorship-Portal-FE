'use client';

import { useState } from 'react';
import WeekCalendar from './WeekCalendar';
import MeetingDetail from './MeetingDetail';
import { Meeting } from '@/types/meeting';

interface CalendarViewProps {
  meetings: Meeting[];
  onEditMeeting?: (meeting: Meeting) => void;
  onCancelMeeting?: (meeting: Meeting) => void;
}

export default function CalendarView({ meetings, onEditMeeting, onCancelMeeting }: CalendarViewProps) {
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const handleMeetingClick = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    setIsDetailModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsDetailModalOpen(false);
  };

  const handleEditMeeting = (meeting: Meeting) => {
    if (onEditMeeting) {
      onEditMeeting(meeting);
      setIsDetailModalOpen(false);
    }
  };

  const handleCancelMeeting = (meeting: Meeting) => {
    if (onCancelMeeting) {
      onCancelMeeting(meeting);
      setIsDetailModalOpen(false);
    }
  };

  return (
    <div>
      <WeekCalendar 
        meetings={meetings} 
        onMeetingClick={handleMeetingClick} 
      />
      
      <MeetingDetail 
        meeting={selectedMeeting}
        isOpen={isDetailModalOpen}
        onClose={handleCloseModal}
        onEdit={onEditMeeting ? handleEditMeeting : undefined}
        onCancel={onCancelMeeting ? handleCancelMeeting : undefined}
      />
    </div>
  );
} 