'use client';

import { useMenteeStore } from '@/stores/mentee/store';
import Profile from '@/components/Home/Profile';

export default function ProfilePage() {
  const mentee = useMenteeStore((state) => state.mentee);

  if (!mentee) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Welcome, {mentee.name}!</h1>
      <Profile mentee={mentee} />
    </div>
  );
} 