'use client';

import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/Admin/Sidebar';
import { useAdminAuthStore } from '@/stores/auth/admin-auth-store';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { logout } = useAdminAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/admin');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar onLogout={handleLogout} />
      <div className="md:pt-16">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </div>
    </div>
  );
} 