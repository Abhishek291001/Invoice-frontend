import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { toast } from '@/hooks/use-toast';
import API_BASE_URL from '../Apiconfig/ApiConfig.ts'
export type AppRole = 'superadmin' | 'admin' | 'viewer';

export interface UserType {
  id: string;
  email: string;
  role: AppRole;

}

export interface SessionType {
  access_token: string;
}

interface AuthContextType {
  user: UserType | null;
  session: SessionType | null;
  userRole: AppRole | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;

  signOut: () => Promise<void>;
  hasRole: (role: AppRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserType | null>(null);
  const [session, setSession] = useState<SessionType | null>(null);
  const [userRole, setUserRole] = useState<AppRole | null>(null);
  const [loading, setLoading] = useState(true);
  

 
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    fetch(`${API_BASE_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user);
        setUserRole(data.user.role);
        setSession({ access_token: token });
      })
      .finally(() => setLoading(false));
  }, []);

 
  const signIn = async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { error: { message: data.message || "Login failed" } };
      }

      localStorage.setItem("token", data.token);
      setUser(data.user);
      setUserRole(data.user.role);
      setSession({ access_token: data.token });

      return { error: null };
    } catch (err: any) {
      return { error: { message: err.message || "Something went wrong" } };
    }
  };

  const signOut = async () => {
    try {
      localStorage.removeItem("token");
      setUser(null);
      setSession(null);
      setUserRole(null);
    } catch (error) {
      console.error("Error signing out:", error);
      toast({ title: "Error", description: "Failed to sign out", variant: "destructive" });
    }
  };

  
  const hasRole = (role: AppRole): boolean => {
    if (!userRole) return false;

    if (userRole === "superadmin") return true;
    if (userRole === "admin" && (role === "admin" || role === "viewer")) return true;

    return userRole === role;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        userRole,
        loading,
        signIn,
      
        signOut,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
