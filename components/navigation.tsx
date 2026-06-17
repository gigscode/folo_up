'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, UserPlus, Users, BarChart3, User } from 'lucide-react';

function AdminAvatar({ active }: { active: boolean }) {
  const [imgError, setImgError] = useState(false);

  if (imgError) {
    return (
      <User className={`w-5 h-5 transition-transform duration-200 ${active ? 'scale-110 stroke-[2.5px]' : 'stroke-2'}`} />
    );
  }

  return (
    <img
      src="/avatar.png"
      alt="Admin Profile"
      onError={() => setImgError(true)}
      className={`w-6 h-6 rounded-full object-cover transition-all duration-200 ${
        active 
          ? 'ring-2 ring-blue-500 dark:ring-blue-400 ring-offset-1 ring-offset-card scale-110' 
          : 'opacity-80 group-hover:opacity-100'
      }`}
    />
  );
}

export default function Navigation() {
  const pathname = usePathname();

  const isTabActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname === path || pathname?.startsWith(path + '/');
  };

  const navItems = [
    {
      label: 'Dashboard',
      href: '/',
      icon: (active: boolean) => (
        <LayoutDashboard className={`w-5 h-5 transition-transform duration-200 ${active ? 'scale-110 stroke-[2.5px]' : 'stroke-2'}`} />
      ),
    },
    {
      label: 'Add Visitor',
      href: '/add-visitor',
      icon: (active: boolean) => (
        <UserPlus className={`w-5 h-5 transition-transform duration-200 ${active ? 'scale-110 stroke-[2.5px]' : 'stroke-2'}`} />
      ),
    },
    {
      label: 'Visitors',
      href: '/visitors',
      icon: (active: boolean) => (
        <Users className={`w-5 h-5 transition-transform duration-200 ${active ? 'scale-110 stroke-[2.5px]' : 'stroke-2'}`} />
      ),
    },
    {
      label: 'Analytics',
      href: '/analytics',
      icon: (active: boolean) => (
        <BarChart3 className={`w-5 h-5 transition-transform duration-200 ${active ? 'scale-110 stroke-[2.5px]' : 'stroke-2'}`} />
      ),
    },
    {
      label: 'Admin',
      href: '/admin/login',
      icon: (active: boolean) => <AdminAvatar active={active} />,
    },
  ];

  return (
    <div className="fixed bottom-5 left-0 right-0 px-4 flex justify-center z-50 pointer-events-none">
      <nav className="w-full max-w-lg bg-card/90 dark:bg-zinc-950/90 backdrop-blur-lg border border-border/40 dark:border-zinc-800/60 shadow-2xl shadow-blue-950/5 dark:shadow-black/40 rounded-full px-4 py-2 pointer-events-auto">
        <div className="flex justify-around items-center">
          {navItems.map((item) => {
            const active = isTabActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center py-1 group focus:outline-none"
              >
                <div className={`relative flex items-center justify-center w-14 h-8 rounded-full transition-all duration-300 ease-out ${
                  active 
                    ? 'bg-blue-100/70 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400' 
                    : 'text-muted-foreground group-hover:text-foreground group-hover:bg-muted/40'
                }`}>
                  {item.icon(active)}
                </div>
                <span className={`text-[10px] mt-1 font-medium tracking-wide transition-colors duration-200 ${
                  active 
                    ? 'text-blue-600 dark:text-blue-400 font-semibold' 
                    : 'text-muted-foreground group-hover:text-foreground'
                }`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

