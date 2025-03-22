import { Course } from '@/types/course';
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

export const createCourse = async (course: Course, authHeader: string): Promise<Course> => {
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

    if (!response.ok) {
      console.error('API Error:', {
        status: response.status,
        statusText: response.statusText
      });
      throw new Error(`Failed to create course: ${response.statusText}`);
    }

    return course; // Return the created course
  } catch (error) {
    console.error('Error creating course:', error);
    throw error;
  }
};

export const fetchCourseGroups = async (courseName: string, authHeader: string): Promise<MentorshipGroupsResponse> => {
  try {
    let apiUrl = config.api.url;
    apiUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;

    console.log('Fetching mentorship groups for course:', courseName);
    
    const response = await fetch(`${apiUrl}/v1/courses/${encodeURIComponent(courseName)}/groups`, {
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
  groupId: string, 
  authHeader: string
): Promise<boolean> => {
  try {
    let apiUrl = config.api.url;
    apiUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;

    console.log('Creating mentorship group:', groupId, 'for course:', courseName);
    
    const response = await fetch(`${apiUrl}/v1/courses/${encodeURIComponent(courseName)}/groups/${encodeURIComponent(groupId)}`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sessions: [] as GroupMentorshipSession[] }), // Empty list of GroupMentorshipSession
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