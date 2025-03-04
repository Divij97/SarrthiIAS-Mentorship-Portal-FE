import { Mentor, DayOfWeek } from '@/types/mentor';
import { Region, Gender, OptionalSubject } from '@/types/mentee';
import { config } from '@/config/env';
import { UserType } from '@/types/auth';

export interface MentorResponse {
  exists: boolean;
  mentor: Mentor | null;
}

export const getMentorByPhone = async (phone: string, authHeader: string): Promise<MentorResponse> => {
  try {
    console.log('Fetching mentor by phone:', phone);
    // Mock response for testing
    if (phone === '9876543210') {
      const mockMentor: Mentor = {
        name: "Amit Sharma",
        email: "amit.sharma@example.com",
        phone: "+91-9876543210",
        region: Region.NORTH,
        gender: Gender.MALE,
        optionalSubject: OptionalSubject.HISTORY,
        givenInterview: true,
        numberOfAttemptsInUpsc: 3,
        numberOfMainsAttempts: 2,
        offDaysOfWeek: [DayOfWeek.SATURDAY, DayOfWeek.SUNDAY]
      };

      return {
        exists: false,
        mentor: mockMentor
      };
    }

    // Clean up the API URL to prevent double slashes
    let apiUrl = config.api.url;
    apiUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
    
    const response = await fetch(`${apiUrl}/v1/mentors/${phone}`, {
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
      throw new Error(`Failed to fetch mentor data: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching mentor:', error);
    throw error;
  }
}; 