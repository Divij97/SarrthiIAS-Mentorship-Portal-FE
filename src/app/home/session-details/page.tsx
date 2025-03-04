'use client';

import { useMenteeStore } from '@/stores/mentee/store';
import SessionDetails from '@/components/Home/SessionDetails';

export default function SessionDetailsPage() {
  const mentee = useMenteeStore((state) => state.mentee);

  if (!mentee) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Session Details</h1>
      <SessionDetails />
    </div>
  );
} 