import { Session, GroupMentorshipSession } from '@/types/session';

/**
 * Converts a GroupMentorshipSession to a Session format
 * @param groupSession - The group mentorship session to convert
 * @returns A Session object with the converted data
 */
export const convertToSession = (groupSession: GroupMentorshipSession): Session => {
  return {
    id: groupSession.sessionId,
    title: `Group Session ${groupSession.dateOfSession}`,
    description: `Group mentorship session with ${groupSession.mentorName}`,
    date: groupSession.firstSessionDate, // This would need to be calculated based on dateOfSession
    startTime: groupSession.startTime,
    endTime: groupSession.endTime,
    status: 'scheduled',
    meetingLink: groupSession.zoomLink || undefined,
  };
};

export const getDateOfNextOccurrence = (dayOfMonth: number): string => {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  // Create date for the specified day of month
  let nextDate = new Date(currentYear, currentMonth, dayOfMonth);
  
  // If the date has already passed this month, move to next month
  if (nextDate < today) {
    nextDate = new Date(currentYear, currentMonth + 1, dayOfMonth);
  }
  
  // Format as dd/mm/yyyy
  return nextDate.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}; 