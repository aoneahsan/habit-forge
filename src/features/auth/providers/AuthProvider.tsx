import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { User as FirebaseUser } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/config/firebase.config';
import { getUserProfile, createUserProfile } from '@/services/firebase/user.service';
import { useAuthStore } from '@/stores/auth.store';
import type { UserProfile } from '@/types/user.types';

interface AuthContextType {
  user: FirebaseUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  error: Error | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const { setAuth, clearAuth } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // User is signed in
          setUser(firebaseUser);
          
          // Get or create user profile
          let profile = await getUserProfile(firebaseUser.uid);
          
          if (!profile) {
            // Create new profile for first-time users
            profile = await createUserProfile(firebaseUser);
          }
          
          setUserProfile(profile);
          setAuth(firebaseUser, profile);
        } else {
          // User is signed out
          setUser(null);
          setUserProfile(null);
          clearAuth();
        }
      } catch (err) {
        console.error('Auth state change error:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [setAuth, clearAuth]);

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}