import { Mentor, DayOfWeek, MentorResponse } from '@/types/mentor';
import { Region, Gender, OptionalSubject } from '@/types/mentee';
import { config } from '@/config/env';
import { useLoginStore } from '@/stores/auth/store';
import { MentorSessionsResponse } from '@/types/session';
import { sampleMentorSessions } from '@/data/sampleMentorSessions';

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
  otp,
  authHeader
}: {
  phone: string;
  newPassword: string;
  otp: string;
  authHeader: string;
}) => {
  const response = await fetch('/v1/mentors', {
    method: 'PUT',
    headers: {
      'Authorization': authHeader,
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

export const getMentorSessions = async (phone: string, authHeader: string): Promise<MentorSessionsResponse> => {
  try {
    // Return sample data for now
    return sampleMentorSessions;

    // Commented out actual API call for now
    /*
    let apiUrl = config.api.url;
    apiUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
    
    const response = await fetch(`${apiUrl}/v1/sessions/mentor/${phone}`, {
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
      throw new Error(`Failed to fetch mentor sessions: ${response.statusText}`);
    }

    return await response.json();
    */
  } catch (error) {
    console.error('Error fetching mentor sessions:', error);
    throw error;
  }
}; 