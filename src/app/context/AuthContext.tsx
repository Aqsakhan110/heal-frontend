"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextType {
  user: any;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);

  const login = async (email: string, password: string) => {
    // Mock login – backend kab connect karein gy later
    if (email && password) {
      setUser({ email });
      return true;
    }
    return false;
  };

  const register = async (name: string, email: string, password: string) => {
    if (name && email && password) {
      setUser({ name, email });
      return true;
    }
    return false;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
