import { create } from 'zustand';
import type { User } from '@/types';
import { auth } from '@/config/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  confirmPasswordReset,
  verifyPasswordResetCode,
  updateProfile
} from 'firebase/auth';
import toast from 'react-hot-toast';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName?: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
  sendResetEmail: (email: string) => Promise<void>;
  confirmReset: (code: string, newPassword: string) => Promise<void>;
  verifyResetCode: (code: string) => Promise<string>;
  updateUserProfile: (displayName?: string, photoURL?: string) => Promise<void>;
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
  
  signUp: async (email, password, displayName) => {
    set({ loading: true, error: null });
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (displayName && auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName });
      }
      toast.success('Account created successfully!');
    } catch (error: any) {
      set({ error: error.message, loading: false });
      toast.error(error.message);
      throw error;
    }
  },
  
  signOut: async () => {
    await firebaseSignOut(auth);
    set({ user: null });
    toast.success('Signed out successfully');
  },
  
  clearError: () => set({ error: null }),
  
  sendResetEmail: async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Password reset email sent! Check your inbox.');
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  },
  
  confirmReset: async (code: string, newPassword: string) => {
    try {
      await confirmPasswordReset(auth, code, newPassword);
      toast.success('Password reset successfully! You can now sign in with your new password.');
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  },
  
  verifyResetCode: async (code: string) => {
    try {
      const email = await verifyPasswordResetCode(auth, code);
      return email;
    } catch (error: any) {
      toast.error('Invalid or expired reset code');
      throw error;
    }
  },
  
  updateUserProfile: async (displayName?: string, photoURL?: string) => {
    if (!auth.currentUser) {
      throw new Error('No authenticated user');
    }
    
    try {
      const updates: any = {};
      if (displayName !== undefined) updates.displayName = displayName;
      if (photoURL !== undefined) updates.photoURL = photoURL;
      
      await updateProfile(auth.currentUser, updates);
      
      // Update local state
      set(state => ({
        user: state.user ? {
          ...state.user,
          displayName: displayName || state.user.displayName,
          photoURL: photoURL || state.user.photoURL
        } : null
      }));
      
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  }
}));

// Auth listener
onAuthStateChanged(auth, (firebaseUser) => {
  if (firebaseUser) {
    const user: User = {
      id: firebaseUser.uid,
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