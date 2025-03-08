import { MenteeResponse, Mentee, Region, Gender, ReservationCategory, OptionalSubject, PreferredSlot, AnswerWritingLevel } from '@/types/mentee';
import { config } from '@/config/env';
import { sampleMentees } from '@/data/mentees';

export const getMenteeByPhone = async (phone: string, authHeader: string): Promise<MenteeResponse> => {
  try {
    console.log('Fetching mentee by phone:', phone);
    
    // First check if it's a test phone number
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
        expectationFromMentorshipCourse: "Looking to improve answer writing skills and get structured guidance",
      };
      return {
        isTempPassword: true,
        mentee: mockMentee,
        username: "1111122222",
        otp: null
      };
    }

    // Check in sample mentees data
    const sampleMentee = sampleMentees.find(mentee => 
      mentee.phone === phone || mentee.phone === phone
    );

    if (sampleMentee) {
      return {
        isTempPassword: true,
        mentee: sampleMentee,
        username: sampleMentee.phone,
        otp: null
      };
    }

    // Clean up the API URL to prevent double slashes
    let apiUrl = config.api.url;
    apiUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
    
    const response = await fetch(`${apiUrl}/v1/mentees`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'same-origin'
    });

    if (!response.ok) {
      console.error('API Error:', {
        status: response.status,
        statusText: response.statusText
      });
      throw new Error(`Failed to fetch user data: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}; 