'use client';

import { useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useLoginStore } from '@/stores/auth/store';
import { useMentorStore } from '@/stores/mentor/store';
import { useMenteeStore } from '@/stores/mentee/store';
import { getMentorByPhone } from '@/services/mentors';
import { getMenteeByPhone } from '@/services/mentee';
import ResponsiveNavbar from '@/components/Home/ResponsiveNavbar';
import { UserType } from '@/types/auth';

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { userType, phone, getAuthHeader, logout } = useLoginStore();
  const { setMentorResponse } = useMentorStore();
  const { setMenteeResponse } = useMenteeStore();
  const refreshInProgress = useRef(false);

  useEffect(() => {

    const refreshData = async () => {
      // Prevent concurrent refreshes
      if (refreshInProgress.current) {
        console.log('Refresh already in progress, skipping');
        return;
      }

      if (!phone) {
        console.log('Skipping refresh - no phone', { phone });
        return;
      }

      const authHeader = getAuthHeader();
      if (!authHeader) {
        console.error('No auth header available');
        return;
      }

      try {
        refreshInProgress.current = true;
        
        if (userType === UserType.MENTOR) {
          console.log('Fetching mentor data for', phone);
          const mentorData = await getMentorByPhone(phone, authHeader);
          console.log('Successfully fetched mentor data');
          setMentorResponse(mentorData);
        } else if (userType === UserType.MENTEE && pathname.includes('/courses')) {
          console.log('Fetching mentee data for', phone);
          const menteeData = await getMenteeByPhone(phone, authHeader);
          console.log('Successfully fetched mentee data');
          if (menteeData && menteeData.mentee) {
            setMenteeResponse(menteeData);
          }
        }
      } catch (error) {
        console.error('Failed to refresh data:', error);
      } finally {
        refreshInProgress.current = false;
      }
    };

    // Initial load and refresh
    refreshData();

    // Handle visibility changes
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('Page became visible, refreshing data');
        refreshData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [userType, phone, getAuthHeader, setMentorResponse, setMenteeResponse, pathname]);

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  const getActiveSection = () => {
    const path = pathname.split('/')[2] || 'profile'; // Default to profile if no subsection
    return path;
  };

  const handleSectionChange = (section: string) => {
    router.push(`/home/${section}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <ResponsiveNavbar
        activeSection={getActiveSection()}
        onSectionChange={handleSectionChange}
        onLogout={handleLogout}
        userType={userType}
      />
      <main className="flex-1 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
} 