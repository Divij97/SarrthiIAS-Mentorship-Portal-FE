import { Course, CreateGroupRequest, MergeGroupRequest, CreateCourseRequest } from '@/types/course';
import { GroupMentorshipSession, MentorshipGroupsResponse } from '@/types/session';
import { config } from '@/config/env';


export const fetchCourses = async (username: string, authHeader: string): Promise<Course[]> => {
  try {
    let apiUrl = config.api.url;
    apiUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;

    console.log('Fetching courses with username:', username);
    console.log('Authorization header:', authHeader);
    console.log('API URL:', apiUrl);
    
    const response = await fetch(`${apiUrl}/v1/courses`, {
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
      throw new Error(`Failed to fetch courses: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
};

export const createCourse = async (course: CreateCourseRequest, authHeader: string): Promise<Course> => {
  try {
    let apiUrl = config.api.url;
    apiUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;

    const response = await fetch(`${apiUrl}/v1/courses`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(course),
    });

    console.log("Add course response", response)

    if (!response.ok) {
      console.error('API Error:', {
        status: response.status,
        statusText: response.statusText
      });
      throw new Error(`Failed to create course: ${response.statusText}`);
    }

    return await response.json(); // Return the created course
  } catch (error) {
    console.error('Error creating course:', error);
    throw error;
  }
};

export const fetchCourseGroups = async (courseId: string, authHeader: string): Promise<MentorshipGroupsResponse> => {
  try {
    let apiUrl = config.api.url;
    apiUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;

    console.log('Fetching mentorship groups for course:', courseId);
    
    const response = await fetch(`${apiUrl}/v1/courses/${courseId}/groups`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('API Error:', {
        status: response.status,
        statusText: response.statusText
      });
      throw new Error(`Failed to fetch course groups: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching course groups:', error);
    throw error;
  }
};

export const createMentorshipGroup = async (
  courseName: string, 
  requestBody: CreateGroupRequest, 
  authHeader: string
): Promise<boolean> => {
  try {
    let apiUrl = config.api.url;
    apiUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;

    console.log('Creating mentorship group:', requestBody, 'for course:', courseName);
    
    const response = await fetch(`${apiUrl}/v1/courses/${courseName}/groups`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      console.error('API Error:', {
        status: response.status,
        statusText: response.statusText
      });
      throw new Error(`Failed to create mentorship group: ${response.statusText}`);
    }

    return true;
  } catch (error) {
    console.error('Error creating mentorship group:', error);
    throw error;
  }
};

export const mergeGroups = async (groupIds: string[], groupFriendlyName: string, groupMentorshipSessions: GroupMentorshipSession[], courseName: string, authHeader: string): Promise<boolean> => {
  try {
    const requestBody: MergeGroupRequest = {
      groupIds,
      groupFriendlyName,
      groupMentorshipSessions,
      courseName
    }
    
    const response = await fetch(`${config.api.url}/v1/courses/${courseName}/groups/merge`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      console.error('API Error:', {
        status: response.status,
        statusText: response.statusText
      });
      throw new Error(`Failed to merge groups: ${response.statusText}`);  
    }

    return true;
  } catch (error) {
    console.error('Error merging groups:', error);
    throw error;
  }
}

export const fetchCourse = async (courseId: string, authHeader: string): Promise<Course> => {
  try {
    const response = await fetch(`${config.api.url}/v1/courses/${courseId}`, {
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
      throw new Error(`Failed to fetch course: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching course:', error);
    throw error;
  }
};

export const createGroupInCourse = async (courseId: string, request: CreateGroupRequest, authHeader: string): Promise<void> => {
  try {
    const response = await fetch(`${config.api.url}/v1/courses/${courseId}/groups`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
  } catch (error) {
    console.error('Error creating group in course:', error);
    throw error;
  }
}

export const updateCourseDetails = async (courseId: string, updatedCourse: Course, authHeader: string): Promise<void> => {
  
    const response = await fetch(`${config.api.url}/v1/courses/${courseId}`, {
      method: 'PUT',
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedCourse)
    })

    if (!response.ok) {
        throw Error(`${response}`)
    }
}