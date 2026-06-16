'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getAdminSession, loginAdmin, logoutAdmin, AdminSession } from './auth';

interface AuthContextType {
  session: AdminSession | null;
  isLoading: boolean;
  isAdmin: boolean;
  email: string | null;
  login: (email: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AdminSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedSession = getAdminSession();
    setSession(storedSession);
    setIsLoading(false);
  }, []);

  const handleLogin = async (email: string) => {
    const result = loginAdmin(email);
    if (result.success) {
      const newSession = getAdminSession();
      setSession(newSession);
    }
    return result;
  };

  const handleLogout = () => {
    logoutAdmin();
    setSession(null);
  };

  const value: AuthContextType = {
    session,
    isLoading,
    isAdmin: session?.isAdmin || false,
    email: session?.email || null,
    login: handleLogin,
    logout: handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
