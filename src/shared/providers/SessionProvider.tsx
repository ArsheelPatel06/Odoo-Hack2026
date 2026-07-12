"use client";

import { createContext, useContext, useEffect } from "react";
import type { MockUser } from "@/shared/auth";
import { useSessionStore } from "@/shared/store";

type SessionContextValue = {
  user: MockUser | null;
  token: string | null;
  isAuthenticated: boolean;
  hasHydrated: boolean;
  login: (email: string) => boolean;
  logout: () => void;
};

const SessionContext = createContext<SessionContextValue | null>(null);

type SessionProviderProps = {
  children: React.ReactNode;
};

export function SessionProvider({ children }: SessionProviderProps) {
  const { user, token, isAuthenticated, hasHydrated, login, logout, setHasHydrated } = useSessionStore();

  useEffect(() => {
    if (!hasHydrated) {
      setHasHydrated(true);
    }
  }, [hasHydrated, setHasHydrated]);

  return (
    <SessionContext.Provider value={{ user, token, isAuthenticated, hasHydrated, login, logout }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);

  if (!context) {
    throw new Error("useSession must be used within SessionProvider.");
  }

  return context;
}
