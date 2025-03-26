import { MenteeResponse, Mentee, Region, Gender, ReservationCategory, OptionalSubject, PreferredSlot, AnswerWritingLevel, MenteeWithAuth } from '@/types/mentee';
import { config } from '@/config/env';
import { useLoginStore } from '@/stores/auth/store';

export const getMenteeByPhone = async (phone: string, authHeader: string): Promise<MenteeResponse> => {
  try {
    console.log('Fetching mentee by phone:', phone);

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

export const signupMentee = async (menteeData: MenteeWithAuth): Promise<void> => {
  try {
    // Clean up the API URL to prevent double slashes
    let apiUrl = config.api.url;
    apiUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;

    const authHeader = useLoginStore.getState().authHeader || '';

    console.log("menteeData: ", menteeData);

    const response = await fetch(`${apiUrl}/v1/mentees`, {
      method: 'PUT',
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'same-origin',
      body: JSON.stringify(menteeData),
    });

    if (!response.ok) {
      throw new Error('Failed to sign up mentee');
    }
  } catch (error) {
    console.error('Error signing up mentee:', error);
    throw error;
  }
}; 