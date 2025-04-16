import { MentorGroupsBulkResponse, MentorResponse, MentorWithAuth } from '@/types/mentor';
import { config } from '@/config/env';
import { useLoginStore } from '@/stores/auth/store';
import { DeleteRecurringSessionRequest, SessionUpdate } from '@/types/session';
import { RecurringMentorshipSchedule, MentorshipSession } from '@/types/session';
import { StrippedDownMentee } from '@/types/mentee';
import { fetchSafe } from '@/utils/api';

export const getMentorByPhone = async (phone: string, authHeader: string): Promise<MentorResponse> => {
  try {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] API Call: getMentorByPhone - Starting request for ${phone}`);

    // Clean up the API URL to prevent double slashes
    let apiUrl = config.api.url;
    apiUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
    
    const response = await fetch(`${apiUrl}/v1/mentors/me`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'same-origin'
    });

    if (!response.ok) {
      console.error(`[${timestamp}] API Error:`, {
        status: response.status,
        statusText: response.statusText
      });
      throw new Error(`Failed to fetch mentor data: ${response.statusText}`);
    }
    
    const responseData = await response.json();
    console.log(`[${timestamp}] API Call: getMentorByPhone - Completed successfully`);

    return responseData;
  } catch (error) {
    // console.error('Error fetching mentor:', error);
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
  try {
    let apiUrl = config.api.url;
    apiUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
    
    const response = await fetch(`${apiUrl}/v1/mentors`, {
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
    
    if (!response.ok) {
      // If we get an error response, try to parse it
      try {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to update password: ${response.statusText}`);
      } catch (parseError) {
        // If we can't parse the error, use the status text
        throw new Error(`Failed to update password: ${response.statusText}`);
      }
    }
    
    // For 204 No Content or other successful responses without body
    if (response.status === 204 || response.headers.get('content-length') === '0') {
      return { success: true };
    }
    
    // Try to parse response if there is one
    try {
      return await response.json();
    } catch (error) {
      // If there's no JSON to parse but the request was successful, return a success object
      return { success: true };
    }
  } catch (error) {
    console.error('Error updating password:', error);
    throw error;
  }
};

export const signupMentor = async (mentorData: MentorWithAuth) => {
  try {
    let apiUrl = config.api.url;
    apiUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;

    const authHeader = useLoginStore.getState().getAuthHeader() || '';
    
    const response = await fetch(`${apiUrl}/v1/mentors`, {
      method: 'PUT',
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...mentorData
      }),
    });

    if (!response.ok) {
      console.error('API Error:', {
        status: response.status,
        statusText: response.statusText
      });
      throw new Error(`Failed to signup mentor: ${response.statusText}`);
    }

    // For 204 No Content or other successful responses without body
    if (response.status === 204 || response.headers.get('content-length') === '0') {
      return { success: true };
    }
    
    // Try to parse response if there is one
    try {
      return await response.json();
    } catch (error) {
      // If there's no JSON to parse but the request was successful, return a success object
      return { success: true };
    }
  } catch (error) {
    console.error('Error signing up mentor:', error);
    throw error;
  }
};

export const createRecurringSchedule = async (
  schedule: Omit<RecurringMentorshipSchedule, 'sessionId'>,
  authHeader: string
): Promise<MentorshipSession> => {
  const response = await fetch(`${config.api.url}/v1/mentors/me/sessions/schedule`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': authHeader
    },
    body: JSON.stringify(schedule)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to create schedule: ${response.status} ${response.statusText}${errorText ? ` - ${errorText}` : ''}`);
  }

  const responseText = await response.text();
  if (!responseText) {
    throw new Error('Empty response received from server');
  }

  try {
    const data = JSON.parse(responseText);
    return data;
  } catch (error) {
    throw new Error(`Invalid JSON response: ${responseText}`);
  }
}; 

export const addNewAdHocSession = async (sessionUpdate: SessionUpdate, authHeader: string): Promise<MentorshipSession> => {
  return await fetchSafe<MentorshipSession>(`${config.api.url}/v1/mentors/me/sessions`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': authHeader
    },
    body: JSON.stringify(sessionUpdate)
  });
};

export const cancelSession = async (sessionUpdate: SessionUpdate, authHeader: string) => {
  const response = await fetch(`${config.api.url}/v1/mentors/me/sessions`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': authHeader
    },
    body: JSON.stringify(sessionUpdate)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to cancel session: ${response.status} ${response.statusText}${errorText ? ` - ${errorText}` : ''}`);
  }

  return { success: true };
};

export const cancelRecurringSession = async (deleteRecurringSessionRequest: DeleteRecurringSessionRequest, authHeader: string) => {
  const response = await fetch(`${config.api.url}/v1/mentors/me/sessions/schedule`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': authHeader
    },
    body: JSON.stringify(deleteRecurringSessionRequest)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to cancel recurring session: ${response.status} ${response.statusText}${errorText ? ` - ${errorText}` : ''}`);
  }

  return { success: true };
};

export const getGroupSessionForMentor = async (mentorUsername: string, groups: string[], authHeader: string): Promise<MentorGroupsBulkResponse> => {
  const response = await fetch(`${config.api.url}/v1/courses/groups?mentorUsername=${mentorUsername}&groupIds=${groups.join(',')}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': authHeader
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to get group session for mentor: ${response.status} ${response.statusText}${errorText ? ` - ${errorText}` : ''}`);
  }

  return await response.json();
};

export const sendEmailToMentor = async (mentee: StrippedDownMentee, authHeader: string) => {
  const response = await fetch(`${config.api.url}/v1/mentors/me/emails?template=GET_BACK_ON`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': authHeader
    },
    body: JSON.stringify(mentee)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to send email to mentor: ${response.status} ${response.statusText}${errorText ? ` - ${errorText}` : ''}`);
  }

  return { success: true };
};

export const sendOnBoardingEmail = async (mentee: StrippedDownMentee, authHeader: string, template: string = 'ONBOARDING') => {
  await fetchSafe<void>(`${config.api.url}/v1/mentors/me/emails?template=${template}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': authHeader
    },
    body: JSON.stringify(mentee)
  });
};
