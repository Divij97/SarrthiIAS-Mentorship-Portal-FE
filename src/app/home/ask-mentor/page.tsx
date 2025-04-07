'use client';

import { useMenteeStore } from '@/stores/mentee/store';
import AskMentor from '@/components/Home/AskMentor';

export default function AskMentorPage() {
  const mentee = useMenteeStore((state) => state.menteeResponse);

  if (!mentee) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Ask Your Mentor</h1>
      <AskMentor />
    </div>
  );
} 