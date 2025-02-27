'use client';

import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/Admin/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const handleLogout = () => {
    // TODO: Implement proper logout
    router.push('/admin');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar onLogout={handleLogout} />
      <div className="md:pl-64">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </div>
    </div>
  );
} 