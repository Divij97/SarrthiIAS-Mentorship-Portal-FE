'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useLoginStore } from '@/stores/auth/store';
import { useMenteeStore } from '@/stores/mentee/store';
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const isAuthenticated = useLoginStore((state) => state.isAuthenticated);
  const mentee = useMenteeStore((state) => state.mentee);

  useEffect(() => {
    const checkAuthAndRedirect = () => {
      // Ignore authentication check for admin route
      if (pathname.startsWith('/admin')) {
        setIsLoading(false);
        return;
      }

      const publicRoutes = ['/login', '/signup'];
      const isPublicRoute = publicRoutes.includes(pathname);

      if (isAuthenticated && mentee && isPublicRoute) {
        router.replace('/home');
      } else if (!isAuthenticated && !isPublicRoute) {
        router.replace('/login');
      }
      setIsLoading(false);
    };

    checkAuthAndRedirect();
  }, [isAuthenticated, mentee, pathname, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-orange-600 text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  return <div className={inter.className}>{children}</div>;
} 