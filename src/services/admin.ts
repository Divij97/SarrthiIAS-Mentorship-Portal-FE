import { config } from '@/config/env';
import { AdminResponse } from '@/types/admin';

export const loginAdmin = async (username: string, password: string): Promise<AdminResponse> => {
  try {
    let apiUrl = config.api.url;
    apiUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;

    const authHeader = `Basic ${btoa(`${username}:${password}`)}`;

    const response = await fetch(`${apiUrl}/v1/admin`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'same-origin',
    });

    if (!response.ok) {
      return {
        success: false,
        message: 'Invalid credentials'
      };
    }

    const data = await response.json();
    console.log("Raw API response data:", JSON.stringify(data, null, 2));
    
    // Create the return object
    const returnData = {
      success: true,
      data: {
        username: data.username,
        courses: data.courseList || [],
        mentors: data.mentorList || []
      }
    };
    
    console.log("Returning data from service:", JSON.stringify(returnData, null, 2));
    return returnData;
  } catch (error) {
    console.error('Admin login error:', error);
    return {
      success: false,
      message: 'An error occurred during login'
    };
  }
}; 