'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useMenteeStore } from '@/stores/mentee/store';
import { useMentorStore } from '@/stores/mentor/store';
import { useLoginStore } from '@/stores/auth/store';
import { UserType } from '@/types/auth';
import Sidebar from '@/components/Home/Sidebar';

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { userType, logout } = useLoginStore();
  const mentee = useMenteeStore((state) => state.mentee);
  const mentor = useMentorStore((state) => state.mentor);

  // Get the current user based on userType
  const currentUser = userType === UserType.MENTOR ? mentor : mentee;

  if (!currentUser) return null;

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  const getActiveSection = () => {
    const path = pathname.split('/')[2] || 'profile'; // Default to profile if no subsection
    return path;
  };

  const handleSectionChange = (section: string) => {
    router.push(`/home/${section}`);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar 
        activeSection={getActiveSection()} 
        onSectionChange={handleSectionChange}
        onLogout={handleLogout}
        userType={userType}
      />
      <main className="flex-1 p-8 md:ml-64">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
} 