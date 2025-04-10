'use client';

import { useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useLoginStore } from '@/stores/auth/store';
import { useMentorStore } from '@/stores/mentor/store';
import { getMentorByPhone } from '@/services/mentors';
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
  const refreshInProgress = useRef(false);
  const mountCount = useRef(0);

  useEffect(() => {
    mountCount.current += 1;
    console.log(`Component mounted ${mountCount.current} times`, {
      isDevelopment: process.env.NODE_ENV === 'development',
      strictMode: true
    });

    const refreshMentorData = async () => {
      // Prevent concurrent refreshes
      if (refreshInProgress.current) {
        console.log('Refresh already in progress, skipping');
        return;
      }

      // Only fetch mentor data if user is a mentor
      if (userType !== UserType.MENTOR || !phone) {
        console.log('Skipping refresh - not a mentor or no phone', { userType, phone });
        return;
      }

      const authHeader = getAuthHeader();
      if (!authHeader) {
        console.error('No auth header available');
        return;
      }

      try {
        refreshInProgress.current = true;
        console.log('Fetching mentor data for', phone, 'Mount count:', mountCount.current);
        const mentorData = await getMentorByPhone(phone, authHeader);
        console.log('Successfully fetched mentor data');
        setMentorResponse(mentorData);
      } catch (error) {
        // console.error('Failed to refresh mentor data:', error);
      } finally {
        refreshInProgress.current = false;
      }
    };

    // Initial load and refresh
    refreshMentorData();

    // Handle visibility changes
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('Page became visible, refreshing data');
        refreshMentorData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      console.log('Cleaning up effect, mount count:', mountCount.current);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [userType, phone, getAuthHeader, setMentorResponse]);

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