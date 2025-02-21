'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMenteeStore } from '@/stores/mentee/store';
import { useLoginStore } from '@/stores/auth/store';
import Sidebar from '@/components/Home/Sidebar';
import SessionDetails from '@/components/Home/SessionDetails';
import AskMentor from '@/components/Home/AskMentor';
import Profile from '@/components/Home/Profile';
import Courses from '@/components/Home/Courses';
import { Mentee } from '@/types/mentee';

export default function HomePage() {
  const router = useRouter();
  const mentee = useMenteeStore((state: { mentee: Mentee | null }) => state.mentee);
  const { logout } = useLoginStore();
  const [activeSection, setActiveSection] = useState('profile');

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  if (!mentee) return null;

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return <Profile mentee={mentee} />;
      case 'courses':
        return <Courses />;
      case 'session-details':
        return <SessionDetails />;
      case 'ask-mentor':
        return <AskMentor />;
      default:
        return <Profile mentee={mentee} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar 
        activeSection={activeSection} 
        onSectionChange={setActiveSection}
        onLogout={handleLogout}
      />
      <main className="flex-1 p-8 md:ml-64">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Welcome, {mentee.name}!</h1>
          </div>
          {renderContent()}
        </div>
      </main>
    </div>
  );
} 