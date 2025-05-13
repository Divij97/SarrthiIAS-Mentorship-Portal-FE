import { MenteeResponse, MenteeWithAuth, PastSessionsResponse, SubmitFeedbackRequest, SupportQueryRequest } from '@/types/mentee';
import { config } from '@/config/env';
import { useLoginStore } from '@/stores/auth/store';
import { MentorshipGroup } from '@/types/session';
import { StrippedDownMentor } from '@/types/mentor';
import { fetchSafe } from '@/utils/api';

export const getMenteeByPhone = async (phone: string, authHeader: string): Promise<MenteeResponse> => {
  try {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] API Call: getMenteeByPhone - Starting request for ${phone}`);

    // Clean up the API URL to prevent double slashes
    let apiUrl = config.api.url;
    apiUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
    
    const response = await fetch(`${apiUrl}/v1/mentees/me`, {
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
      throw new Error(`Failed to fetch user data: ${response.statusText}`);
    }

    const responseData = await response.json();
    console.log(`[${timestamp}] API Call: getMenteeByPhone - Completed successfully`);
    return responseData;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

export const signupMentee = async (menteeData: MenteeWithAuth, assignMentor: boolean): Promise<void> => {
  try {
    // Clean up the API URL to prevent double slashes
    let apiUrl = config.api.url;
    apiUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;

    const authHeader = useLoginStore.getState().getAuthHeader() || '';

    console.log("menteeData: ", menteeData);

    //TODO: check if mentee has 1-1 course assigned if then assign mentor = true

    const response = await fetch(`${apiUrl}/v1/mentees?assignMentor=${assignMentor}`, {
      method: 'PUT',
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(menteeData),
    });

    if (!response.ok) {
      throw new Error('Failed to sign up mentee');
    }

    // call assignMentor
  } catch (error) {
    console.error('Error signing up mentee:', error);
    throw error;
  }
}; 

export const getGroupById = async (groupId: string, authHeader: string): Promise<MentorshipGroup> => {
  try {
    // Clean up the API URL to prevent double slashes
    let apiUrl = config.api.url;
    apiUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;

    const response = await fetch(`${apiUrl}/v1/courses/groups/${groupId}`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch group');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching group:', error);
    throw error;
  }
};

export const bookOnDemandSession = async (mentor: StrippedDownMentor|null, authHeader: string): Promise<void> => {
  try {
    // Clean up the API URL to prevent double slashes
    let apiUrl = config.api.url;
    apiUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;

    const response = await fetch(`${apiUrl}/v1/mentees/me/on-demand-sessions`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mentorName: mentor?.name,
        mentorPhone: mentor?.phone,
        mentorEmail: mentor?.email,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to book on demand session');
    }
  } catch (error) {
    console.error('Error booking on demand session:', error);
    throw error;
  }
}

export const requestSessionCancellation = async (
  sessionId: string,
  subject: string,
  mentor: StrippedDownMentor,
  authHeader: string
): Promise<void> => {
  try {
    // Clean up the API URL to prevent double slashes
    let apiUrl = config.api.url;
    apiUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;

    const response = await fetch(`${apiUrl}/v1/mentees/me/request-cancellation`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId,
        subject,
        mentor
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to request session cancellation');
    }
  } catch (error) {
    console.error('Error requesting session cancellation:', error);
    throw error;
  }
};

export const forgotPassword = async (username: string, authHeader: string): Promise<void> => {
  return await fetchSafe<void>(`${config.api.url}/v1/internal/users/${username}/forgotPassword`, {
    method: 'POST',
    headers: {
      'Authorization': authHeader,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  });
}

export const refreshSessions = async (authHeader: string): Promise<MenteeResponse> => {
  return await fetchSafe<MenteeResponse>(`${config.api.url}/v1/mentees/me`, {
    method: 'GET',
    headers: {
      'Authorization': authHeader,
      'Content-Type': 'application/json',
    }
  });
}

export const submitFeedback = async (feedbackData: SubmitFeedbackRequest, authHeader: string): Promise<void> => {
  return await fetchSafe<void>(`${config.api.url}/v1/feedback`, {
    method: 'POST',
    headers: {
      'Authorization': authHeader,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(feedbackData),
  });
}

export const getPastSessions = async (authHeader: string): Promise<PastSessionsResponse> => {
  return await fetchSafe<PastSessionsResponse>(`${config.api.url}/v1/mentees/me/sessions`, {
    method: 'GET',
    headers: {
      'Authorization': authHeader,
    }
  });
}

export const submitSupportQuery = async (supportQueryData: SupportQueryRequest, authHeader: string): Promise<void> => {
  return await fetchSafe<void>(`${config.api.url}/v1/mentees/me/support-queries`, {
    method: 'POST',
    headers: {
      'Authorization': authHeader,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(supportQueryData),
  });
}


