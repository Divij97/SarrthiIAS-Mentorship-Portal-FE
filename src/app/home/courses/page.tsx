'use client';

import { useMenteeStore } from '@/stores/mentee/store';
import Courses from '@/components/Home/Courses';

export default function CoursesPage() {
  const mentee = useMenteeStore((state) => state.menteeResponse);

  if (!mentee) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Your Courses</h1>
      <Courses />
    </div>
  );
} 