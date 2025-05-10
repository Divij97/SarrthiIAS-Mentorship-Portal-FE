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
        <div className="max-w-[98%] mx-auto py-6 px-2 sm:px-4 lg:px-6">
          {children}
        </div>
      </div>
    </div>
  );
} 