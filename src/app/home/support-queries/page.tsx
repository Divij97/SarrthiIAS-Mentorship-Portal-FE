'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLoginStore } from '@/stores/auth/store';
import { useMenteeStore } from '@/stores/mentee/store';
import { UserType } from '@/types/auth';
import SupportQueryForm from '@/components/Home/SupportQueryForm';

export default function SupportQueriesPage() {
  const router = useRouter();
  const { isAuthenticated, userType } = useLoginStore();
  const { menteeResponse } = useMenteeStore();

  useEffect(() => {
    if (!isAuthenticated || userType !== UserType.MENTEE) {
      router.replace('/login');
    }
  }, [isAuthenticated, userType, router]);

  if (!isAuthenticated || userType !== UserType.MENTEE || !menteeResponse?.mentee) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Raise a Support Query</h2>
      </div>
      <div className="bg-white shadow rounded-lg p-6">
        <SupportQueryForm mentee={menteeResponse.mentee} />
      </div>
    </div>
  );
} 