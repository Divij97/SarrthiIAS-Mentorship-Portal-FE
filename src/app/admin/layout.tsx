'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Simple auth check - you should implement proper auth state management
    const isLoginPage = pathname === '/admin';
    const isAuthenticated = pathname.startsWith('/admin/dashboard');

    // If on dashboard but not authenticated, redirect to login
    if (isAuthenticated && !isLoginPage) {
      // TODO: Add proper auth check
      // For now, we'll let it pass
    }

    // If authenticated and on login page, redirect to dashboard
    if (isLoginPage && isAuthenticated) {
      router.replace('/admin/dashboard');
    }
  }, [pathname, router]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Add admin-specific layout elements here */}
      {children}
    </div>
  );
} 