'use client';

import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

interface SidebarProps {
  onLogout: () => void;
}

export default function AdminSidebar({ onLogout }: SidebarProps) {
  const pathname = usePathname();
  
  const navigation = [
    { name: 'Courses', path: '/admin/dashboard/courses' },
    { name: 'Mentors', path: '/admin/dashboard/mentors' },
  ];

  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
      <div className="flex flex-col h-full">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
          </div>
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`${
                  pathname === item.path
                    ? 'bg-orange-100 text-orange-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                } group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full`}
              >
                {item.name}
              </Link>
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