
import { createContext, useContext, useState, ReactNode } from "react";

export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: "admin" | "manager" | "member";
};

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data
const mockUser: User = {
  id: "user-1",
  name: "Alex Johnson",
  email: "alex@example.com",
  avatarUrl: "https://i.pravatar.cc/150?u=alex",
  role: "admin",
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    // This would normally validate with a backend
    await new Promise((resolve) => setTimeout(resolve, 800));
    setUser(mockUser);
    return Promise.resolve();
  };

  const signup = async (name: string, email: string, password: string) => {
    // This would normally register with a backend
    await new Promise((resolve) => setTimeout(resolve, 800));
    setUser({
      ...mockUser,
      name,
      email,
    });
    return Promise.resolve();
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
