import { DayOfWeek, MentorResponse } from "@/types/mentor"
import { MentorshipSession } from "@/types/session";
import { formatDateKey, getNextDayOfWeek } from "./date-time-utils";

export const getCombinedSessionsFromMentor = (mentorResponse: MentorResponse) => {
    const combined: Record<string, MentorshipSession[]> = { ...mentorResponse.sessionsByDate };
    
    // Process sessions by day of week
    if (mentorResponse.sessionsByDayOfWeek) {
      Object.entries(mentorResponse.sessionsByDayOfWeek).forEach(([day, sessions]) => {
        if (sessions && sessions.length > 0) {
          // Convert day of week to next occurrence date
          const nextDate = getNextDayOfWeek(day as DayOfWeek);
          const dateKey = formatDateKey(nextDate);
          
          // Add to combined sessions
          if (!combined[dateKey]) {
            combined[dateKey] = [];
          }
          
          // Add sessions that aren't already in the list (avoid duplicates)
          sessions.forEach(session => {
            const isDuplicate = combined[dateKey].some(existingSession => 
              existingSession.id === session.id
            );
            
            if (!isDuplicate) {
              combined[dateKey].push(session);
            }
          });
        }
      });
    }

    // Sort the combined sessions by date
    const sortedEntries = Object.entries(combined).sort(([dateA], [dateB]) => {
      // Parse dates (assuming format is DD/MM/YYYY)
      const [dayA, monthA, yearA] = dateA.split('/').map(Number);
      const [dayB, monthB, yearB] = dateB.split('/').map(Number);
      
      // Create Date objects for comparison
      const dateObjA = new Date(yearA, monthA - 1, dayA);
      const dateObjB = new Date(yearB, monthB - 1, dayB);
      
      // Sort in ascending order
      return dateObjA.getTime() - dateObjB.getTime();
    });

    // Convert sorted entries back to an object
    return Object.fromEntries(sortedEntries);
}