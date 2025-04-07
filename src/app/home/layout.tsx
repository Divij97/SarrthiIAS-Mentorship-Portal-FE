'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useLoginStore } from '@/stores/auth/store';
import ResponsiveNavbar from '@/components/Home/ResponsiveNavbar';

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { userType, logout } = useLoginStore();

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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <ResponsiveNavbar
        activeSection={getActiveSection()}
        onSectionChange={handleSectionChange}
        onLogout={handleLogout}
        userType={userType}
      />
      <main className="flex-1 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
} 