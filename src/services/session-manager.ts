import { MenteeIdentifier } from '@/types/mentor';
import { MentorshipSession } from '@/types/session';
import { config } from '@/config/env';

export class SessionManager {
  private authHeader: string;

  constructor(authHeader: string) {
    this.authHeader = authHeader;
  }

  /**
   * Fetch all mentees available for scheduling
   */
  async fetchMenteeList(): Promise<MenteeIdentifier[]> {
    try {
      const response = await fetch(`${config.api.url}/v1/mentors/mentee-list`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.authHeader
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch mentee list');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching mentee list:', error);
      return [];
    }
  }

  /**
   * Update an existing session's schedule
   */
  async updateSessionSchedule(
    sessionId: string,
    startTime: string,
    endTime: string
  ): Promise<MentorshipSession> {
    try {
      // In a real implementation, this would call the actual API
      // For now, we'll use the mock implementation
      return new Promise((resolve) => {
        setTimeout(() => {
          const updatedSession: MentorshipSession = {
            id: sessionId,
            menteeFullName: 'Test User',
            menteeUsername: 'testuser',
            isZoomLinkGenerated: false,
            zoomLink: null,
            startTime,
            endTime,
            mentorUsername: 'mentor',
            mentorName: 'Mentor Name'
          };
          resolve(updatedSession);
        }, 1000);
      });
    } catch (error) {
      console.error('Error updating session schedule:', error);
      throw new Error('Failed to update session schedule');
    }
  }

  /**
   * Cancel an existing session
   */
  async cancelSession(sessionId: string): Promise<{ success: boolean }> {
    try {
      // In a real implementation, this would call the actual API
      // For now, we'll use the mock implementation
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ success: true });
        }, 1000);
      });
    } catch (error) {
      console.error('Error canceling session:', error);
      throw new Error('Failed to cancel session');
    }
  }

  /**
   * Add a new session
   */
  async addNewSession(
    mentorUsername: string,
    date: string,
    startTime: string,
    endTime: string,
    menteeUsername: string
  ): Promise<MentorshipSession> {
    try {
      // In a real implementation, this would call the actual API
      // For now, we'll use the mock implementation
      return new Promise((resolve) => {
        setTimeout(() => {
          const newSession: MentorshipSession = {
            id: `session-${Date.now()}`,
            menteeFullName: 'New Mentee',
            menteeUsername,
            isZoomLinkGenerated: false,
            zoomLink: null,
            startTime: `${date}T${startTime}:00.000Z`,
            endTime: `${date}T${endTime}:00.000Z`,
            mentorUsername,
            mentorName: 'Mentor Name'
          };
          resolve(newSession);
        }, 1000);
      });
    } catch (error) {
      console.error('Error adding new session:', error);
      throw new Error('Failed to add new session');
    }
  }
} 