import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { User as FirebaseUser } from 'firebase/auth';
import type { UserProfile } from '@/types/user.types';
import { STORAGE_KEYS } from '@/constants/app.constants';

interface AuthState {
  user: FirebaseUser | null;
  userProfile: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  setAuth: (user: FirebaseUser, profile: UserProfile) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    immer((set) => ({
      // State
      user: null,
      userProfile: null,
      isAuthenticated: false,
      isLoading: true,
      error: null,

      // Actions
      setAuth: (user, profile) =>
        set((state) => {
          state.user = user;
          state.userProfile = profile;
          state.isAuthenticated = true;
          state.isLoading = false;
          state.error = null;
        }),

      clearAuth: () =>
        set((state) => {
          state.user = null;
          state.userProfile = null;
          state.isAuthenticated = false;
          state.isLoading = false;
          state.error = null;
        }),

      setLoading: (loading) =>
        set((state) => {
          state.isLoading = loading;
        }),

      setError: (error) =>
        set((state) => {
          state.error = error;
          state.isLoading = false;
        }),

      updateProfile: (updates) =>
        set((state) => {
          if (state.userProfile) {
            Object.assign(state.userProfile, updates);
          }
        }),
    })),
    {
      name: STORAGE_KEYS.AUTH_TOKEN,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        userProfile: state.userProfile,
      }),
    }
  )
);