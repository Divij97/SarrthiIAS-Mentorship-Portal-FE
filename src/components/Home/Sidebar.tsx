'use client';

import Link from 'next/link';
import { useMenteeStore } from '@/stores/mentee/store';
import { useMentorStore } from '@/stores/mentor/store';
import { UserType } from '@/types/auth';
import { Mentee } from '@/types/mentee';
import { Mentor } from '@/types/mentor';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  onLogout: () => void;
  userType: UserType | null;
}

export default function Sidebar({ activeSection, onSectionChange, onLogout, userType }: SidebarProps) {
  const mentee = useMenteeStore((state) => state.mentee);
  const mentor = useMentorStore((state) => state.mentor);

  const currentUser = userType === UserType.MENTOR ? mentor : mentee;

  const menteeNavigation = [
    { name: 'Profile', section: 'profile' },
    { name: 'Courses', section: 'courses' },
    // Sessions will be accessed through course details
  ];

  const mentorNavigation = [
    { name: 'Profile', section: 'profile' },
    { name: 'Sessions', section: 'mentor-sessions' }
  ];

  const navigation = userType === UserType.MENTOR ? mentorNavigation : menteeNavigation;

  if (!currentUser) return null;

  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
      <div className="flex flex-col h-full">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <h1 className="text-xl font-bold text-gray-900">Saarthi IAS</h1>
          </div>
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {navigation.map((item) => (
              <button
                key={item.section}
                onClick={() => onSectionChange(item.section)}
                className={`${
                  activeSection === item.section
                    ? 'bg-orange-100 text-orange-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                } group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full`}
              >
                {item.name}
              </button>
            ))}
          </nav>
        </div>
        <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
          <button
            onClick={onLogout}
            className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
} 