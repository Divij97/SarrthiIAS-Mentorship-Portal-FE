import { MenteeIdentifier, MentorWithAuth, MentorResponse } from '@/types/mentor';
import { MentorshipSession, SessionUpdate, UpdateType, SessionType, DateFormatDDMMYYYY, createDateDDMMYYYY } from '@/types/session';
import { config } from '@/config/env';
import { useMentorStore } from '@/stores/mentor/store';
import { useLoginStore } from '@/stores/auth/store';
import CryptoJS from 'crypto-js';

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
    menteeUsername: string,
    menteeFullName: string
  ): Promise<void> {
    try {
      // Generate a unique session ID
      const sessionId = `session-${Date.now()}`;
      
      // Convert the date format from YYYY-MM-DD to DD/MM/YYYY
      const [year, month, day] = date.split('-');
      const formattedDate = `${day}/${month}/${year}`;
      
      // Validate the date format
      const validDate = createDateDDMMYYYY(formattedDate);
      if (!validDate) {
        throw new Error('Invalid date format. Expected format is DD/MM/YYYY');
      }
      
      // Create session update object
      const sessionUpdate: SessionUpdate = {
        id: sessionId,
        date: validDate,
        menteeUsername: menteeUsername,
        menteeFullName: menteeFullName || 'New Mentee',
        startTime: `${startTime}:00`,
        endTime: `${endTime}:00`,
        updateType: UpdateType.ADD,
        isPermanentUpdate: false,
        sessionType: SessionType.AD_HOC
      };

      // Get the mentor data from the store
      const mentorResponse = useMentorStore.getState().mentorResponse;
      
      if (!mentorResponse || !mentorResponse.mentor) {
        throw new Error('Mentor information not available');
      }

      // Call the API to update the mentor with the new session
      const response = await fetch(`${config.api.url}/v1/mentors/${mentorResponse.username}/sessions`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.authHeader
        },
        body: JSON.stringify(sessionUpdate)
      });

      if (!response.ok) {
        throw new Error('Failed to add new session');
      }

      // Success - no return value needed as backend handles everything
      console.log('Session added successfully, ID:', sessionId);
    } catch (error) {
      console.error('Error adding new session:', error);
      throw new Error('Failed to add new session');
    }
  }
} 