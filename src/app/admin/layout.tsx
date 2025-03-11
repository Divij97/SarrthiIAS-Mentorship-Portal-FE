'use client';

import { useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAdminStore } from '@/stores/admin/store';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, logout } = useAdminStore();
  const lastValidPath = useRef<string>('/admin/dashboard/courses/active');

  // Reset lastValidPath when authentication state changes
  useEffect(() => {
    if (!isAuthenticated) {
      lastValidPath.current = '/admin/dashboard/courses/active';
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Only show the dialog when actually leaving the site, not during internal navigation
      if (isAuthenticated && !pathname.startsWith('/admin/dashboard')) {
        e.preventDefault();
        return 'Changes you made may not be saved.';
      }
    };

    const handlePopState = (e: PopStateEvent) => {
      if (isAuthenticated && pathname !== '/admin') {
        const confirmLogout = window.confirm('Going back will log you out of the admin panel. Continue?');
        if (confirmLogout) {
          logout();
          router.push('/admin');
        } else {
          // Prevent going back by pushing current state again
          window.history.pushState(null, '', window.location.href);
        }
      }
    };

    // Add event listeners
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);
    
    // Push initial state to enable popstate handling
    window.history.pushState(null, '', window.location.href);

    // Update last valid path when on a dashboard route
    if (isAuthenticated && pathname.startsWith('/admin/dashboard')) {
      lastValidPath.current = pathname;
    }

    // Handle route protection and redirection
    const isLoginPage = pathname === '/admin';

    if (isLoginPage && isAuthenticated) {
      router.replace(lastValidPath.current);
    } else if (!isLoginPage && !isAuthenticated) {
      router.replace('/admin');
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [pathname, router, isAuthenticated, logout]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Add admin-specific layout elements here */}
      {children}
    </div>
  );
} 