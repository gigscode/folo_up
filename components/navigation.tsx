'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path || pathname?.startsWith(path + '/');

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-around items-center h-16 relative">
          <Link
            href="/"
            className={`flex flex-col items-center justify-center w-16 h-16 transition-colors ${
              isActive('/') && pathname === '/'
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <span className="text-xl">📋</span>
            <span className="text-xs mt-1 font-medium">Dashboard</span>
          </Link>

          <Link
            href="/add-visitor"
            className={`flex flex-col items-center justify-center w-16 h-16 transition-colors ${
              isActive('/add-visitor')
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <span className="text-xl">➕</span>
            <span className="text-xs mt-1 font-medium">Add Visitor</span>
          </Link>

          <Link
            href="/visitors"
            className={`flex flex-col items-center justify-center w-16 h-16 transition-colors ${
              isActive('/visitors')
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <span className="text-xl">👥</span>
            <span className="text-xs mt-1 font-medium">Visitors</span>
          </Link>

          <Link
            href="/analytics"
            className={`flex flex-col items-center justify-center w-16 h-16 transition-colors ${
              isActive('/analytics')
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <span className="text-xl">📊</span>
            <span className="text-xs mt-1 font-medium">Analytics</span>
          </Link>

          <Link
            href="/admin/login"
            className={`flex flex-col items-center justify-center w-16 h-16 transition-colors ${
              isActive('/admin')
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <span className="text-xl">🔐</span>
            <span className="text-xs mt-1 font-medium">Admin</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
