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
  const { userType } = useLoginStore();
  const { mentee } = useMenteeStore();
  const { mentor } = useMentorStore();

  useEffect(() => {
    router.replace('/home/profile');
  }, [router]);

  if (userType === UserType.MENTOR && mentor) {
    return <MentorView mentor={mentor} />;
  }

  if (userType === UserType.MENTEE && mentee) {
    return <MenteeView mentee={mentee} />;
  }

  return null;
} 