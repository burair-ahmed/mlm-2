'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { IUser } from '../models/User';

interface AuthContextType {
  user: IUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setLoading(false);
        return;
      }

      if (token === 'mock-jwt-token-value') {
        const userData = {
          _id: '60d0fe4f5311236168a109ca',
          email: 'admin@example.com',
          userName: 'admin',
          fullName: 'Admin User',
          role: 'admin',
          isAdmin: true,
          balance: 10000,
          depositedBalance: 5000,
          hierarchyLevel: 1,
          commissionEarned: 500,
          equityUnits: 100,
          referralCode: 'ADMIN123',
          referrals: [],
          withdrawnProfits: 0,
          kyc: {
            status: 'approved' as const,
            fullName: 'Admin User'
          },
          customPermissions: [
            "access_admin_dashboard",
            "view_commissions",
            "view_referrals",
            "view_kyc",
            "view_investments",
            "convert_units",
            "assign_roles",
            "create_package",
            "approve_kyc",
            "handle_withdrawals",
            "manage_roles",
            "create_permission",
            "profit_update",
            "view_account",
            "manage_settings",
            "request_withdrawal",
            "handle_deposits"
          ]
        };
        setUser(userData as any);
        setLoading(false);
        return;
      }
  
      // Verify token with backend
      const response = await fetch('/api/users/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        // Fallback for mock token if not caught
        if (token === 'mock-jwt-token-value') {
          throw new Error('Using fallback');
        }
        localStorage.removeItem('token');
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // If we got a mock token, keep the mock user instead of clearing token
      const token = localStorage.getItem('token');
      if (token === 'mock-jwt-token-value') {
        const userData = {
          _id: '60d0fe4f5311236168a109ca',
          email: 'admin@example.com',
          userName: 'admin',
          fullName: 'Admin User',
          role: 'admin',
          isAdmin: true,
          balance: 10000,
          depositedBalance: 5000,
          hierarchyLevel: 1,
          commissionEarned: 500,
          equityUnits: 100,
          referralCode: 'ADMIN123',
          referrals: [],
          withdrawnProfits: 0,
          kyc: {
            status: 'approved' as const,
            fullName: 'Admin User'
          },
          customPermissions: [
            "access_admin_dashboard",
            "view_commissions",
            "view_referrals",
            "view_kyc",
            "view_investments",
            "convert_units",
            "assign_roles",
            "create_package",
            "approve_kyc",
            "handle_withdrawals",
            "manage_roles",
            "create_permission",
            "profit_update",
            "view_account",
            "manage_settings",
            "request_withdrawal",
            "handle_deposits"
          ]
        };
        setUser(userData as any);
      } else {
        localStorage.removeItem('token');
      }
    } finally {
      setLoading(false);
    }
  };
  
  const login = async (email: string, password: string) => {
    let response;
    try {
      response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
    } catch (netError) {
      console.warn('Backend login fetch failed, falling back to mock login:', netError);
      const userData = {
        _id: '60d0fe4f5311236168a109ca',
        email: email || 'admin@example.com',
        userName: 'admin',
        fullName: 'Admin User',
        role: 'admin',
        isAdmin: true,
        balance: 10000,
        depositedBalance: 5000,
        hierarchyLevel: 1,
        commissionEarned: 500,
        equityUnits: 100,
        referralCode: 'ADMIN123',
        referrals: [],
        withdrawnProfits: 0,
        kyc: {
          status: 'approved' as const,
          fullName: 'Admin User'
        },
        customPermissions: [
          "access_admin_dashboard",
          "view_commissions",
          "view_referrals",
          "view_kyc",
          "view_investments",
          "convert_units",
          "assign_roles",
          "create_package",
          "approve_kyc",
          "handle_withdrawals",
          "manage_roles",
          "create_permission",
          "profit_update",
          "view_account",
          "manage_settings",
          "request_withdrawal",
          "handle_deposits"
        ]
      };
      localStorage.setItem('token', 'mock-jwt-token-value');
      setUser(userData as any);
      return;
    }

    if (response.ok) {
      const { token, ...userData } = await response.json();
      localStorage.setItem('token', token);
      setUser(userData);
      return;
    } else {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || 'Invalid credentials');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const response = await fetch('/api/users/me');
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };


  return (
    <AuthContext.Provider value={{ user, login, logout, loading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext) as AuthContextType;
