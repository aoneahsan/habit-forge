import { create } from 'zustand';
import type { User } from '@/types';
import { auth } from '@/config/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  error: null,
  
  signIn: async (email, password) => {
    set({ loading: true, error: null });
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },
  
  signUp: async (email, password) => {
    set({ loading: true, error: null });
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },
  
  signOut: async () => {
    await firebaseSignOut(auth);
    set({ user: null });
  },
  
  clearError: () => set({ error: null })
}));

// Auth listener
onAuthStateChanged(auth, (firebaseUser) => {
  if (firebaseUser) {
    const user: User = {
      uid: firebaseUser.uid,
      email: firebaseUser.email!,
      displayName: firebaseUser.displayName,
      photoURL: firebaseUser.photoURL,
      accountType: 'free',
      createdAt: new Date(),
      lastLoginAt: new Date(),
      preferences: {
        theme: 'system',
        notificationStyle: 'moderate',
        reminderFrequency: 'normal',
        privacyLevel: 'private',
        aiCoachingEnabled: true,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language
      },
      stats: {
        totalHabits: 0,
        activeHabits: 0,
        completedHabits: 0,
        currentStreak: 0,
        longestStreak: 0,
        totalEntries: 0,
        achievements: []
      }
    };
    useAuthStore.setState({ user, loading: false });
  } else {
    useAuthStore.setState({ user: null, loading: false });
  }
});