'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AdminUser {
  _id: string;
  email: string;
  name: string;
  role: 'admin';
  avatar?: string;
}

interface AdminAuthContextType {
  adminUser: AdminUser | null;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Admin credentials
  const ADMIN_CREDENTIALS = {
    email: 'admin@bloomyourstyle.com',
    password: 'admin123'
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedAdmin = localStorage.getItem('adminUser');
      if (savedAdmin) {
        try {
          setAdminUser(JSON.parse(savedAdmin));
        } catch (error) {
          console.error('Error parsing admin user:', error);
          localStorage.removeItem('adminUser');
        }
      }
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success && data.user) {
        const adminData: AdminUser = data.user;
        setAdminUser(adminData);
        localStorage.setItem('adminUser', JSON.stringify(adminData));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setAdminUser(null);
    localStorage.removeItem('adminUser');
    document.cookie = 'adminUser=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  };

  const value = {
    adminUser,
    isAdmin: !!adminUser,
    login,
    logout,
    loading
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}


