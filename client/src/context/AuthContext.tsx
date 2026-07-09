import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { IUser } from '../types';
import { authService } from '../services/auth.service';

interface AuthContextType {
  user: IUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  updateUser: (user: IUser) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = authService.getToken();
      if (token) {
        try {
          const userData = await authService.getMe();
          setUser(userData);
          authService.setUser(userData);
        } catch {
          authService.logout();
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { token, user: userData } = await authService.login({ email, password });
    authService.setToken(token);
    authService.setUser(userData);
    setUser(userData);
  }, []);

  const register = useCallback(async (data: any) => {
    const { token, user: userData } = await authService.register(data);
    authService.setToken(token);
    authService.setUser(userData);
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  const updateUser = useCallback((updatedUser: IUser) => {
    setUser(updatedUser);
    authService.setUser(updatedUser);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
