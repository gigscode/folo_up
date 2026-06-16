// Authentication utilities for FoloUp admin system
const ADMIN_EMAIL = 'gigsdev007@gmail.com';
const AUTH_STORAGE_KEY = 'foloUp_admin_session';

export interface AdminSession {
  email: string;
  isAdmin: boolean;
  loginTime: number;
}

export function getAdminSession(): AdminSession | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!stored) return null;
    
    const session = JSON.parse(stored) as AdminSession;
    return session;
  } catch {
    return null;
  }
}

export function loginAdmin(email: string): { success: boolean; message: string } {
  if (email.toLowerCase().trim() !== ADMIN_EMAIL.toLowerCase()) {
    return {
      success: false,
      message: `Only ${ADMIN_EMAIL} has admin access. Please check your email and try again.`,
    };
  }

  if (typeof window === 'undefined') {
    return { success: false, message: 'Cannot login on server' };
  }

  const session: AdminSession = {
    email: email.toLowerCase(),
    isAdmin: true,
    loginTime: Date.now(),
  };

  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  return { success: true, message: 'Login successful' };
}

export function logoutAdmin(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

export function isAdminAuthenticated(): boolean {
  const session = getAdminSession();
  return session !== null && session.isAdmin === true;
}

export function getAdminEmail(): string | null {
  const session = getAdminSession();
  return session?.email || null;
}
