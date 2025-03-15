import { config } from '@/config/env';
import { AdminData, AdminResponse } from '@/types/admin';

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

    const rawData = await response.json();
    console.log("Raw API response data:", JSON.stringify(rawData, null, 2));
    
    // Ensure the data matches the AdminData structure
    const adminData: AdminData = {
      username: rawData.username || username,
      courses: Array.isArray(rawData.courses) ? rawData.courses : [],
      mentors: Array.isArray(rawData.mentors) ? rawData.mentors : []
    };
    
    // Create the return object
    const returnData: AdminResponse = {
      success: true,
      data: adminData
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