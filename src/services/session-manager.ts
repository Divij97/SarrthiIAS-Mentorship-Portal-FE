import { MenteeIdentifier, DayOfWeek } from '@/types/mentor';
import { MentorshipSession, SessionUpdate, UpdateType, SessionType, DateFormatDDMMYYYY, createDateDDMMYYYY, DeleteRecurringSessionRequest } from '@/types/session';
import { config } from '@/config/env';
import { useMentorStore } from '@/stores/mentor/store';
import { addNewAdHocSession, cancelRecurringSession, cancelSession } from './mentors';
import { BulkMentorshipGroupCreateOrUpdateRequest, DeleteGroupSessionsRequest, MentorshipSessionsResponse } from '@/types/admin';
import { createOrUpdateGroupSession, deleteGroupSessions } from './admin';
import { formatTimeToHHMM } from '@/utils/date-time-utils';
import { ZoomMeetingInfo } from '@/types/meeting';

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
      const formattedStartTime = formatTimeToHHMM(startTime);
      const formattedEndTime = formatTimeToHHMM(endTime);
      
      // In a real implementation, this would call the actual API
      // For now, we'll use the mock implementation
      return new Promise((resolve) => {
        setTimeout(() => {
          const updatedSession: MentorshipSession = {
            id: sessionId,
            mn: 'Test User',
            mu: 'testuser',
            z: null,
            st: formattedStartTime,
            et: formattedEndTime,
            u: 'mentor',
            m: 'Mentor Name',
            s: SessionType.AD_HOC
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

  async cancelRecurringSession(sessionId: string, dayOfWeek: string, zoomMeetingInfo: ZoomMeetingInfo | null): Promise<{ success: boolean }> {
    try {
      // In a real implementation, this would call the actual API
      // For now, we'll use the mock implementation
      const deleteRecurringSessionRequest: DeleteRecurringSessionRequest = {
        sessionId: sessionId,
        dayOfWeek: dayOfWeek as DayOfWeek,
        zoomMeetingInfo: zoomMeetingInfo
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
  ): Promise<MentorshipSession> {
    try {
      // Generate a unique session ID
      const sessionId = '';
      const mentorEmail = useMentorStore.getState().mentor?.email;
      
      // Convert the date format from YYYY-MM-DD to DD/MM/YYYY
      const [year, month, day] = date.split('-');
      const formattedDate = `${day}/${month}/${year}`;
      
      // Validate the date format
      const validDate = createDateDDMMYYYY(formattedDate);
      if (!validDate) {
        throw new Error('Invalid date format. Expected format is DD/MM/YYYY');
      }
      
      const formattedStartTime = formatTimeToHHMM(startTime);
      const formattedEndTime = formatTimeToHHMM(endTime);
      
      // Create session update object
      const sessionUpdate: SessionUpdate = {
        id: sessionId,
        date: validDate,
        menteeUsername: menteeUsername,
        menteeFullName: menteeFullName || 'New Mentee',
        startTime: formattedStartTime,
        endTime: formattedEndTime,
        updateType: UpdateType.ADD,
        isPermanentUpdate: false,
        sessionType: SessionType.AD_HOC,
        mentorEmail: mentorEmail
      };

      const response = await addNewAdHocSession(sessionUpdate, this.authHeader);

      console.log('Session added successfully, ID:', sessionId);
      return await response;
    } catch (error) {
      console.error('Error adding new session:', error);
      throw new Error('Failed to add new session');
    }
  }

  async addCourseGroupSessions(courseId: string, groupId: string, request: BulkMentorshipGroupCreateOrUpdateRequest): Promise<MentorshipSessionsResponse> {
    try {
      return await createOrUpdateGroupSession(courseId, groupId, request, this.authHeader);
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