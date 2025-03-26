import { useEffect } from 'react';
import { useLoginStore } from '@/stores/auth/store';
import { useMenteeStore } from '@/stores/mentee/store';
import { getMenteeByPhone } from '@/services/mentee';

/**
 * A hook that refreshes mentee data from the server periodically
 * or when explicitly triggered.
 * 
 * @param refreshInterval - Time in milliseconds between refreshes (default: 5 minutes)
 * @returns A function to manually trigger a refresh
 */
export const useRefreshMenteeData = (refreshInterval = 5 * 60 * 1000) => {
  const { phone, authHeader, userType, isAuthenticated } = useLoginStore();
  const { setMentee, setMenteeResponse, setCourses } = useMenteeStore();

  const refreshMenteeData = async () => {
    if (!isAuthenticated || !authHeader || !phone || userType !== 'MENTEE') {
      return;
    }

    try {
      const menteeResponse = await getMenteeByPhone(phone, authHeader);
      if (menteeResponse && menteeResponse.mentee) {
        setMentee(menteeResponse.mentee);
        setMenteeResponse(menteeResponse);
        setCourses(menteeResponse.enrolledCourses);
      }
    } catch (error) {
      console.error('Error refreshing mentee data:', error);
    }
  };

  // Set up periodic refresh
  useEffect(() => {
    if (!isAuthenticated || !authHeader || !phone || userType !== 'MENTEE') {
      return;
    }

    // Refresh immediately on mount
    refreshMenteeData();

    // Set up interval for periodic refreshes
    const intervalId = setInterval(refreshMenteeData, refreshInterval);

    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, [phone, authHeader, isAuthenticated, userType]);

  return refreshMenteeData;
}; 