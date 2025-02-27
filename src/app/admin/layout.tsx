'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

// Simple admin auth state management
const isAdminAuthenticated = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('adminAuthenticated') === 'true';
  }
  return false;
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isAdminAuthenticated() && pathname !== '/admin') {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    const handlePopState = (e: PopStateEvent) => {
      if (isAdminAuthenticated() && pathname !== '/admin') {
        const confirmLogout = window.confirm('Going back will log you out of the admin panel. Continue?');
        if (confirmLogout) {
          localStorage.removeItem('adminAuthenticated');
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

    // Check authentication and handle redirects
    const isLoginPage = pathname === '/admin';
    const isAuthenticated = isAdminAuthenticated();

    if (isLoginPage && isAuthenticated) {
      router.replace('/admin/dashboard');
    } else if (!isLoginPage && !isAuthenticated) {
      router.replace('/admin');
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [pathname, router]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Add admin-specific layout elements here */}
      {children}
    </div>
  );
} 