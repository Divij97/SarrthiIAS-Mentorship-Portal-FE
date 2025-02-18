import { MenteeResponse, Mentee, Region, Gender, ReservationCategory, OptionalSubject, PreferredSlot, AnswerWritingLevel } from '@/types/mentee';
import { config } from '@/config/env';

export const getMenteeByPhone = async (phone: string, authHeader: string): Promise<MenteeResponse> => {
  try {
    // Mock response for testing
    if (phone === '1111122222') {
      const mockMentee: Mentee = {
        name: "Test Mentee",
        email: "test.mentee@example.com",
        phone: "1111122222",
        region: Region.NORTH,
        gender: Gender.MALE,
        
        category: ReservationCategory.GENERAL,
        optionalSubject: OptionalSubject.SOCIOLOGY,
        isWorkingProfessional: false,
        givenInterview: true,
        numberOfAttemptsInUpsc: 1,
        numberOfMainsAttempts: 0,
        
        preferredSlots: [PreferredSlot.MORNING, PreferredSlot.EVENING],
        answerWritingLevel: AnswerWritingLevel.INTERMEDIATE,
        weakSubjects: ["Economics", "Geography"],
        strongSubjects: ["History", "Political Science"],
        
        previouslyEnrolledCourses: ["UPSC Foundation Course"],
        primarySourceOfCurrentAffairs: "The Hindu Newspaper",
        expectationFromMentorshipCourse: "Looking to improve answer writing skills and get structured guidance"
      };

      return {
        exists: true,
        mentee: mockMentee
      };
    }

    if (phone === '1234567890') {
      return {
        exists: false,
        mentee: null
      };
    }

    const response = await fetch(`${config.api.url}/v1/mentee/${phone}`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch mentee data');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching mentee:', error);
    throw error;
  }
}; 