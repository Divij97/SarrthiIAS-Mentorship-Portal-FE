'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useLoginStore } from '@/stores/auth/store';
import { useMenteeStore } from '@/stores/mentee/store';
import { useMentorStore } from '@/stores/mentor/store';
import { UserType } from '@/types/auth';
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  
  // Separate the state access to avoid circular dependencies
  const isAuthenticated = useLoginStore((state) => state.isAuthenticated);
  const userType = useLoginStore((state) => state.userType);
  const mentee = useMenteeStore((state) => state.mentee);
  const mentor = useMentorStore((state) => state.mentor);

  useEffect(() => {
    const checkAuthAndRedirect = () => {
      // Ignore authentication check for admin route
      if (pathname.startsWith('/admin')) {
        setIsLoading(false);
        return;
      }

      const publicRoutes = ['/login', '/signup', '/reset-password'];
      const isPublicRoute = publicRoutes.includes(pathname) || 
                          pathname.startsWith('/reset-password');

      // Check for valid user based on userType
      const hasValidUser = userType === UserType.MENTOR 
                          ? Boolean(mentor) 
                          : Boolean(mentee);

      if (isAuthenticated && hasValidUser && isPublicRoute) {
        router.replace('/home');
      } else if (!isAuthenticated && !isPublicRoute) {
        router.replace('/login');
      }
      setIsLoading(false);
    };

    checkAuthAndRedirect();
  }, [isAuthenticated, mentee, mentor, userType, pathname, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-orange-600 text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  return <div className={inter.className}>{children}</div>;
} 