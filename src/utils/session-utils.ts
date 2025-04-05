import { Session, GroupMentorshipSession } from '@/types/session';

/**
 * Converts a GroupMentorshipSession to a Session format
 * @param groupSession - The group mentorship session to convert
 * @returns A Session object with the converted data
 */
export const convertToSession = (groupSession: GroupMentorshipSession): Session => {
  // Ensure date is in the format expected by the Session component (dd/mm/yyyy)
  let sessionDate = groupSession.date;
  
  // If date is in YYYY-MM-DD format, convert to dd/mm/yyyy
  if (sessionDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
    const [year, month, day] = sessionDate.split('-');
    sessionDate = `${day}/${month}/${year}`;
  }
  
  return {
    id: groupSession.sessionId,
    title: groupSession.name || `Group Session`,
    description: groupSession.description || `Group mentorship session with ${groupSession.mentorName}`,
    date: sessionDate,
    startTime: groupSession.startTime,
    endTime: groupSession.endTime,
    status: 'scheduled',
    meetingLink: groupSession.zoomLink || undefined,
  };
}; 