import { Mentor, DayOfWeek, MentorResponse } from '@/types/mentor';
import { Region, Gender, OptionalSubject } from '@/types/mentee';
import { config } from '@/config/env';
import { useLoginStore } from '@/stores/auth/store';

export const getMentorByPhone = async (phone: string, authHeader: string): Promise<MentorResponse> => {
  try {
    console.log('Fetching mentor by phone:', phone);

    // Clean up the API URL to prevent double slashes
    let apiUrl = config.api.url;
    apiUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
    
    const response = await fetch(`${apiUrl}/v1/mentors`, {
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

export const updateMentorPassword = async ({
  phone,
  newPassword,
  otp
}: {
  phone: string;
  newPassword: string;
  otp: string;
}) => {
  const authHeader = useLoginStore((state) => state.authHeader);
  const response = await fetch('/v1/mentors', {
    method: 'PUT',
    headers: {
      'Authorization': authHeader || '',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      phone,
      password: newPassword,
      otp
    }),
  });
  
  return response;
};

export const signupMentor = async (mentorData: Mentor, newPassword: string) => {
  try {
    let apiUrl = config.api.url;
    apiUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
    
    const response = await fetch(`${apiUrl}/v1/mentees`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...mentorData,
        password: newPassword
      }),
    });

    if (!response.ok) {
      console.error('API Error:', {
        status: response.status,
        statusText: response.statusText
      });
      throw new Error(`Failed to signup mentor: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error signing up mentor:', error);
    throw error;
  }
}; 