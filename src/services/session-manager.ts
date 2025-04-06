import { MenteeIdentifier, MentorWithAuth, MentorResponse, DayOfWeek } from '@/types/mentor';
import { MentorshipSession, SessionUpdate, UpdateType, SessionType, DateFormatDDMMYYYY, createDateDDMMYYYY, RecurrenceType, DeleteRecurringSessionRequest } from '@/types/session';
import { config } from '@/config/env';
import { useMentorStore } from '@/stores/mentor/store';
import { addNewAdHocSession, cancelRecurringSession, cancelSession } from './mentors';
import { BulkMentorshipGroupCreateOrUpdateRequest, DeleteGroupSessionsRequest } from '@/types/admin';
import { createOrUpdateGroupSession, deleteGroupSessions } from './admin';

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
            mentorName: 'Mentor Name',
            sessionType: SessionType.AD_HOC
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
  async cancelSession(sessionId: string, date: string, type: SessionType): Promise<{ success: boolean }> {
    try {
      // In a real implementation, this would call the actual API
      // For now, we'll use the mock implementation
      const sessionUpdate: SessionUpdate = {
        id: sessionId,
        date: date as DateFormatDDMMYYYY,
        sessionType: type,
        updateType: UpdateType.DELETE,
        isPermanentUpdate: true,
        menteeUsername: '',
        menteeFullName: ''
      }
      
      return await cancelSession(sessionUpdate, this.authHeader);
    } catch (error) {
      console.error('Error canceling session:', error);
      throw new Error('Failed to cancel session');
    }
  }

  async cancelRecurringSession(sessionId: string, dayOfWeek: string): Promise<{ success: boolean }> {
    try {
      // In a real implementation, this would call the actual API
      // For now, we'll use the mock implementation
      const deleteRecurringSessionRequest: DeleteRecurringSessionRequest = {
        sessionId: sessionId,
        dayOfWeek: dayOfWeek as DayOfWeek
      }
  
      return await cancelRecurringSession(deleteRecurringSessionRequest, this.authHeader);
    } catch (error) {
      console.error('Error canceling recurring session:', error);
      throw new Error('Failed to cancel recurring session');
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
      const sessionId = '';
      
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

      await addNewAdHocSession(sessionUpdate, this.authHeader, mentorUsername);

      console.log('Session added successfully, ID:', sessionId);
    } catch (error) {
      console.error('Error adding new session:', error);
      throw new Error('Failed to add new session');
    }
  }

  async addCourseGroupSessions(courseId: string, groupId: string, request: BulkMentorshipGroupCreateOrUpdateRequest): Promise<void> {
    try {
      await createOrUpdateGroupSession(courseId, groupId, request, this.authHeader);
    } catch (error) {
      console.error('Error creating or updating group session:', error);
      throw new Error('Failed to create or update group session');
    }
  }

  async deleteGroupSessions(groupId: string, request: DeleteGroupSessionsRequest): Promise<void> {
    try {
      await deleteGroupSessions(groupId, request, this.authHeader);
    } catch (error) {
      console.error('Error deleting group session:', error);
      throw new Error('Failed to delete group session');
    }
  }
} 