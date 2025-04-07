'use client';

import { useLoginStore } from '@/stores/auth/store';
import { useMenteeStore } from '@/stores/mentee/store';
import { useMentorStore } from '@/stores/mentor/store';
import { UserType } from '@/types/auth';
import MentorView from '@/components/Home/MentorView';
import MenteeView from '@/components/Home/MenteeView';

export default function ProfilePage() {
  const { userType } = useLoginStore();
  const { menteeResponse } = useMenteeStore();
  const { mentor } = useMentorStore();

  if (userType === UserType.MENTOR && mentor) {
    return <MentorView mentor={mentor} />;
  }

  if (userType === UserType.MENTEE && menteeResponse?.mentee) {
    return <MenteeView mentee={menteeResponse.mentee} />;
  }

  return null;
} 