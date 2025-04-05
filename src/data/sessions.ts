import { MentorshipSession } from '@/types/session';

// Define the structure for sessions data
export interface SessionsData {
  sessionsByDate: Record<string, MentorshipSession[]>;
}