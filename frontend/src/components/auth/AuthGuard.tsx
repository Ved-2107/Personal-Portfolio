'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, ReactNode } from 'react';

export default function AuthGuard({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Paths that do not require authentication
  const publicPaths = ['/login', '/signup', '/admin/login', '/admin/signup', '/admin/forgot-password', '/admin/reset-password'];

  useEffect(() => {
    if (!loading && !isAuthenticated && !publicPaths.includes(pathname)) {
      router.replace('/login');
    }
  }, [loading, isAuthenticated, pathname, router, publicPaths]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <span className="font-mono text-accent animate-pulse text-sm tracking-widest uppercase">Authenticating...</span>
      </div>
    );
  }

  // If not authenticated and trying to access a protected route, render nothing while redirecting
  if (!isAuthenticated && !publicPaths.includes(pathname)) {
    return null;
  }

  return <>{children}</>;
}
