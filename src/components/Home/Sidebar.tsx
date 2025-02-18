'use client';

import { useRouter } from 'next/navigation';
import { useMenteeStore } from '@/stores/mentee/store';
import { Mentee } from '@/types/mentee';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export default function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const router = useRouter();
  const mentee = useMenteeStore((state: { mentee: Mentee | null }) => state.mentee);
  const clearMentee = useMenteeStore((state: any) => state.clearMentee);

  const navigation = [
    { name: 'Profile', section: 'profile' },
    { name: 'Session Details', section: 'session-details' },
    { name: 'Ask Mentor', section: 'ask-mentor' },
  ];

  const handleLogout = () => {
    clearMentee();
    router.push('/login');
  };

  if (!mentee) return null;

  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
      <div className="flex flex-col flex-grow pt-5 bg-white overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4 space-y-5">
          <div className="w-full flex flex-col items-center">
            <div className="h-24 w-24 rounded-full bg-orange-100 flex items-center justify-center">
              <span className="text-3xl text-orange-600 font-semibold">
                {mentee.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div className="mt-4 text-center">
              <h2 className="text-xl font-semibold text-gray-900">{mentee.name}</h2>
              <p className="text-sm text-gray-500 mt-1">{mentee.email}</p>
              <p className="text-sm text-gray-500">{mentee.phone}</p>
            </div>
          </div>
        </div>
        <div className="mt-6 flex-1 flex flex-col">
          <nav className="flex-1 px-2 pb-4 space-y-1">
            {navigation.map((item) => (
              <button
                key={item.section}
                onClick={() => onSectionChange(item.section)}
                className={`${
                  activeSection === item.section
                    ? 'bg-orange-100 text-orange-600'
                    : 'text-gray-600 hover:bg-gray-50'
                } group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full`}
              >
                {item.name}
              </button>
            ))}
            <button
              onClick={handleLogout}
              className="text-gray-600 hover:bg-gray-50 group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full mt-auto"
            >
              Logout
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
} 