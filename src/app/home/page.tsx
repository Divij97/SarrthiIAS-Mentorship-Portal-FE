'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLoginStore } from '@/stores/auth/store';
import { useMenteeStore } from '@/stores/mentee/store';
import { useMentorStore } from '@/stores/mentor/store';
import { UserType } from '@/types/auth';
import MentorView from '@/components/Home/MentorView';
import MenteeView from '@/components/Home/MenteeView';

export default function HomePage() {
  const router = useRouter();
  const { userType, phone } = useLoginStore();
  const { mentee, menteeResponse } = useMenteeStore();
  const { mentor, mentorResponse } = useMentorStore();

  useEffect(() => {
    // Check if user has an OTP and needs to reset password
    if (menteeResponse?.otp || mentorResponse?.otp) {
      console.log("Home page detected OTP, redirecting to reset password");
      router.replace(`/reset-password?phone=${phone}`);
      return;
    }

    // If no password reset needed, redirect to profile
    router.replace('/home/profile');
  }, [router, menteeResponse, mentorResponse, phone]);

  // Don't render anything during the redirect checks
  if (menteeResponse?.otp || mentorResponse?.otp) {
    return <div className="min-h-screen flex items-center justify-center">Redirecting to password reset...</div>;
  }

  if (userType === UserType.MENTOR && mentor) {
    return <MentorView mentor={mentor} />;
  }

  if (userType === UserType.MENTEE && mentee) {
    return <MenteeView mentee={mentee} />;
  }

  return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
} 