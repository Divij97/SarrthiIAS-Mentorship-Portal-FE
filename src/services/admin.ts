import { AdminData, BulkMentorshipGroupCreateOrUpdateRequest, CreateMenteeRequest, CreateMentorRequest, UpdateMenteeCourseRequest } from '@/types/admin';
import { config } from '@/config/env';
import { MenteesResponse } from '@/types/admin';

export const loginAdmin = async (authHeader: string): Promise<AdminData> => {
  try {
    let apiUrl = config.api.url;
    apiUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
    
    const response = await fetch(`${apiUrl}/v1/admin/me`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'same-origin'
    });

    if (!response.ok) {
      throw new Error(`Failed to login: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export const assignGroupsToCourse = async (courseId: string, authHeader: string, course: any): Promise<any> => {
  try {
    let apiUrl = config.api.url;
    apiUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
    
    const response = await fetch(`${apiUrl}/v1/courses/${courseId}/assignGroups`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'same-origin',
      body: JSON.stringify(course),
    });

    if (!response.ok) {
      throw new Error('Failed to assign groups to course');
    }

    return await response.json();
  } catch (error) {
    console.error('Error assigning groups to course:', error);
    throw error;
  }
};

export const registerMentee = async (mentee: CreateMenteeRequest, authHeader: string): Promise<boolean> => {
  try {
    let apiUrl = config.api.url;
    apiUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
      const response = await fetch(`${config.api.url}/v1/mentees`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${authHeader}`,
        },
        body: JSON.stringify(mentee),
      });

    if (!response) {
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error registering mentee:', error);
    return false;
  }
}

export const registerMentor = async (mentor: CreateMentorRequest, authHeader: string): Promise<boolean> => {
  try {
    let apiUrl = config.api.url;
    apiUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;

    const response = await fetch(`${config.api.url}/v1/mentors`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${authHeader}`,
      },
      body: JSON.stringify(mentor),
    });

    if (!response) {
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error registering mentor:', error);
    return false;
  }
}

export const createOrUpdateGroupSession = async (courseId: string, groupId: string, request: BulkMentorshipGroupCreateOrUpdateRequest, authHeader: string): Promise<void> => {
  try {
    let apiUrl = config.api.url;
    apiUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;

    const response = await fetch(`${apiUrl}/v1/courses/${courseId}/groups/${groupId}`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error('Failed to create group session');
    }

  } catch (error) {
    console.error('Error creating group session:', error);
    throw error;
  }
}

export interface MenteesFilters {
  courseId?: string;
  groupId?: string;
  limit: number;
  skip?: number;
}

export const fetchMentees = async (filters: MenteesFilters, authHeader: string): Promise<MenteesResponse> => {
  try {
    let apiUrl = config.api.url;
    apiUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;

    // Build query parameters
    const queryParams = new URLSearchParams();
    if (filters.courseId) queryParams.append('courseId', filters.courseId);
    if (filters.groupId) queryParams.append('groupId', filters.groupId);
    queryParams.append('limit', filters.limit.toString());
    if (filters.skip !== undefined) queryParams.append('skip', filters.skip.toString());

    const response = await fetch(`${apiUrl}/v1/admin/mentees?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch mentees');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching mentees:', error);
    throw error;
  }
};

export const updateMenteesEnrolledInCourse = async (courseId: string, requestBody: UpdateMenteeCourseRequest, authHeader: string): Promise<void> => {
  const response = await fetch(`${config.api.url}/v1/admin/courses/${courseId}/mentees`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': authHeader,
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw new Error('Failed to register mentees');
  }
}

export const updateMenteeEnrolledInGroup = async (courseId: string, groupId: string, requestBody: UpdateMenteeCourseRequest, authHeader: string): Promise<void> => {
  try {
    await fetch(`${config.api.url}/v1/admin/course/${courseId}/groups/${groupId}/mentees`, {
      method: 'PUT',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
  } catch(error) {
    console.error(`Failed to update mentee information.`)
  }
}