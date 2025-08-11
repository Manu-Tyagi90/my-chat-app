import { createContext, useContext, useState, useMemo } from "react";
import type { ReactNode } from "react";

type User = {
  username: string;
};

type UserContextType = {
  user: User | null;
  login: (username: string) => void;
  logout: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (username: string) => setUser({ username });
  const logout = () => setUser(null);

  // useMemo to avoid unnecessary re-renders
  const value = useMemo(() => ({ user, login, logout }), [user]);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
};