import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Session, User } from "@supabase/supabase-js";

interface UserData {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: UserData | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      
      if (session?.user) {
        const userData: UserData = {
          id: session.user.id,
          email: session.user.email || '',
          // Use user metadata for name if available, otherwise use email
          name: (session.user.user_metadata?.name as string) || session.user.email?.split('@')[0] || 'Beekeeper'
        };
        setUser(userData);
      } else {
        setUser(null);
      }
      
      setIsLoading(false);
    });

    // Initial session check
    const initialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      
      if (session?.user) {
        const userData: UserData = {
          id: session.user.id,
          email: session.user.email || '',
          name: (session.user.user_metadata?.name as string) || session.user.email?.split('@')[0] || 'Beekeeper'
        };
        setUser(userData);
      }
      
      setIsLoading(false);
    };
    
    initialSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        throw error;
      }
      
      toast.success("Successfully signed in!");
    } catch (error: any) {
      toast.error(`Error signing in: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name
          }
        }
      });
      
      if (error) {
        throw error;
      }
      
      toast.success("Signup successful! Please check your email for verification.");
    } catch (error: any) {
      toast.error(`Error signing up: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      setUser(null);
      toast.success("Successfully signed out");
    } catch (error: any) {
      toast.error(`Error signing out: ${error.message}`);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, isLoading, signIn, signUp, signOut }}>
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
