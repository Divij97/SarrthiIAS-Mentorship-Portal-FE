'use client';

import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

interface NavigationItem {
  name: string;
  path: string;
  subsections?: { name: string; path: string }[];
}

export default function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  
  const navigation: NavigationItem[] = [
    {
      name: 'Courses',
      path: '/admin/dashboard/courses',
      subsections: [
        { name: 'Create New Course', path: '/admin/dashboard/courses/create' },
        { name: 'Active Courses', path: '/admin/dashboard/courses/active' },
      ]
    },
    { name: 'Mentors', path: '/admin/dashboard/mentors' },
  ];

  const handleLogout = () => {
    const confirmLogout = window.confirm('Are you sure you want to logout?');
    if (confirmLogout) {
      localStorage.removeItem('adminAuthenticated');
      router.push('/admin');
    }
  };

  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
      <div className="flex flex-col h-full">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
          </div>
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {navigation.map((item) => (
              <div key={item.path}>
                <div className="mb-2">
                  <Link
                    href={item.path}
                    className={`${
                      pathname.startsWith(item.path)
                        ? 'bg-orange-100 text-orange-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    } group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full`}
                  >
                    {item.name}
                  </Link>
                </div>
                {item.subsections && pathname.startsWith(item.path) && (
                  <div className="ml-4 space-y-1">
                    {item.subsections.map((subsection) => (
                      <Link
                        key={subsection.path}
                        href={subsection.path}
                        className={`${
                          pathname === subsection.path
                            ? 'text-orange-900 bg-orange-50'
                            : 'text-gray-500 hover:text-gray-900'
                        } group flex items-center px-2 py-1.5 text-sm rounded-md w-full`}
                      >
                        {subsection.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
        <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
} 