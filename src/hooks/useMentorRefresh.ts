import { useEffect, useCallback } from 'react';
import { useMentorStore } from '@/stores/mentor/store';
import { useLoginStore } from '@/stores/auth/store';
import { getMentorByPhone } from '@/services/mentors';

const REFRESH_INTERVAL = 10 * 60 * 1000; // 2 minutes in milliseconds

export const useMentorRefresh = () => {
  const { mentor, setMentorResponse } = useMentorStore();
  const authHeader = useLoginStore(state => state.getAuthHeader());

  const refreshMentorData = useCallback(async () => {
    if (!mentor?.phone || !authHeader) return;

    try {
      const mentorResponse = await getMentorByPhone(mentor.phone, authHeader);
      setMentorResponse(mentorResponse);
    } catch (error) {
      console.error('Failed to refresh mentor data:', error);
    }
  }, [mentor?.phone, authHeader, setMentorResponse]);

  useEffect(() => {
    // Initial refresh
    refreshMentorData();

    // Set up interval for auto-refresh
    const intervalId = setInterval(refreshMentorData, REFRESH_INTERVAL);

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, [refreshMentorData]);

  return {
    refreshMentorData
  };
}; 