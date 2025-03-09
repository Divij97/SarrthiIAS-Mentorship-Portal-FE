import { MentorshipSessionsInfo } from '@/types/session';
import { config } from '@/config/env';
import { UserType } from '@/types/auth';

export const fetchSessions = async (
  username: string,
  userType: UserType,
  authHeader: string
) => {
  try {
    let apiUrl = config.api.url;
    apiUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;

    const endpoint = userType === UserType.MENTOR 
      ? `/v1/sessions/mentor/${username}`
      : `/v1/sessions/mentee/${username}`;
    
    console.log('Fetching sessions for:', username);
    console.log('User type:', userType);
    
    const response = await fetch(`${apiUrl}${endpoint}`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('API Error:', {
        status: response.status,
        statusText: response.statusText
      });
      throw new Error(`Failed to fetch sessions: ${response.statusText}`);
    }

    const data = await response.json();
    return data as MentorshipSessionsInfo;
  } catch (error) {
    console.error('Error fetching sessions:', error);
    throw error;
  }
}; 