'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useLoginStore } from '@/stores/auth/store';
import { useMenteeStore } from '@/stores/mentee/store';
import { useMentorStore } from '@/stores/mentor/store';
import { UserType } from '@/types/auth';
import { Inter } from "next/font/google";
import { Toaster } from 'react-hot-toast';

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
  const phone = useLoginStore((state) => state.phone);
  const hasVerifiedOTP = useLoginStore((state) => state.hasVerifiedOTP);
  const menteeResponse = useMenteeStore((state) => state.menteeResponse);
  const mentorResponse = useMentorStore((state) => state.mentorResponse);

  // Check if user has temporary password/OTP
  const hasOTP = Boolean(menteeResponse?.otp || mentorResponse?.otp);

  useEffect(() => {
    const checkAuthAndRedirect = () => {
      // Ignore authentication check for admin route
      if (pathname.startsWith('/admin') || pathname.startsWith('/update-password')) {
        setIsLoading(false);
        return;
      }

      const publicRoutes = ['/login', '/signup', '/reset-password', '/mentor-signup', '/update-password'];
      const isPublicRoute = publicRoutes.includes(pathname) || 
                          pathname.startsWith('/reset-password') ||
                          pathname.startsWith('/update-password');
      
      // If user is in signup flow or has verified OTP, don't redirect
      const isInSignupFlow = pathname === '/signup' || pathname === '/mentor-signup';
      
      // Allow direct access to signup pages when OTP is verified
      if (hasVerifiedOTP && isInSignupFlow) {
        console.log("OTP verified and in signup flow, allowing access");
        setIsLoading(false);
        return;
      }
      
      // If authenticated but has OTP and hasn't verified it yet, redirect to reset password
      if (isAuthenticated && hasOTP && !hasVerifiedOTP && !pathname.startsWith('/reset-password') && !isInSignupFlow) {
        console.log("RootLayoutClient detected OTP that hasn't been verified, redirecting to reset password");
        router.replace(`/reset-password?phone=${phone}`);
        setIsLoading(false);
        return;
      }

      // Check for valid user based on userType
      const hasValidUser = userType === UserType.MENTOR 
                          ? Boolean(mentorResponse?.mentor) 
                          : Boolean(menteeResponse?.mentee);

      // Only redirect to home if user is authenticated, has a valid user, is on a public route, and doesn't have OTP
      // or if they're in signup flow with verified OTP
      if (isAuthenticated && hasValidUser && isPublicRoute && !hasOTP && !isInSignupFlow) {
        router.replace('/home');
      } else if (!isAuthenticated && !isPublicRoute) {
        router.replace('/login');
      }      
      setIsLoading(false);
    };

    checkAuthAndRedirect();
  }, [isAuthenticated, menteeResponse, mentorResponse, hasOTP, hasVerifiedOTP, userType, pathname, router, phone]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-orange-600 text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={inter.className}>
      {children}
      <Toaster position="top-right" />
    </div>
  );
} 