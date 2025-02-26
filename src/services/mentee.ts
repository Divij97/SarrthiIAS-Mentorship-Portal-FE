import { MenteeResponse, Mentee, Region, Gender, ReservationCategory, OptionalSubject, PreferredSlot, AnswerWritingLevel } from '@/types/mentee';
import { config } from '@/config/env';
import { UserType } from '@/types/auth';

export const getUserByPhone = async (phone: string, authHeader: string, userType: UserType): Promise<MenteeResponse> => {
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

    // Clean up the API URL to prevent double slashes
    let apiUrl = config.api.url;
    apiUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
    
    const baseUrl = userType === UserType.MENTOR 
      ? `${apiUrl}/v1/mentors`
      : `${apiUrl}/v1/mentees`;

    console.log('Request URL:', baseUrl);
    console.log('Auth Header:', authHeader);

    const response = await fetch(baseUrl, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      // Change from 'include' to 'same-origin' since we're sending auth header manually
      credentials: 'same-origin'
    });

    if (!response.ok) {
      console.error('API Error:', {
        status: response.status,
        statusText: response.statusText
      });
      throw new Error(`Failed to fetch user data: ${response.statusText}`);
    }

    // console.log('Response:', await response.json());

    return await response.json();
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}; 