import { create } from 'zustand';
import { Habit, TrackingEntry } from '@/types';
import { db, PROJECT_PREFIX } from '@/config/firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot
} from 'firebase/firestore';

interface HabitState {
  habits: Habit[];
  entries: TrackingEntry[];
  loading: boolean;
  error: string | null;
  createHabit: (habit: Partial<Habit>) => Promise<string>;
  updateHabit: (id: string, updates: Partial<Habit>) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  trackHabit: (entry: Partial<TrackingEntry>) => Promise<void>;
  fetchHabits: (userId: string) => Promise<void>;
  fetchEntries: (habitId: string) => Promise<void>;
}

export const useHabitStore = create<HabitState>((set, get) => ({
  habits: [],
  entries: [],
  loading: false,
  error: null,
  
  createHabit: async (habitData) => {
    const id = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const habit: Habit = {
      id,
      ...habitData,
      strength: 0,
      currentStreak: 0,
      longestStreak: 0,
      completionRate: 0,
      status: 'active',
      ropeVisualization: {
        thickness: 1,
        material: 'thread',
        color: '#3b82f6',
        glowIntensity: 0,
        strands: 1,
        effects: []
      },
      createdAt: new Date(),
      updatedAt: new Date()
    } as Habit;
    
    await setDoc(doc(db, `${PROJECT_PREFIX}habits`, id), habit);
    set(state => ({ habits: [...state.habits, habit] }));
    return id;
  },
  
  updateHabit: async (id, updates) => {
    await updateDoc(doc(db, `${PROJECT_PREFIX}habits`, id), {
      ...updates,
      updatedAt: new Date()
    });
    set(state => ({
      habits: state.habits.map(h => 
        h.id === id ? { ...h, ...updates, updatedAt: new Date() } : h
      )
    }));
  },
  
  deleteHabit: async (id) => {
    await deleteDoc(doc(db, `${PROJECT_PREFIX}habits`, id));
    set(state => ({
      habits: state.habits.filter(h => h.id !== id)
    }));
  },
  
  trackHabit: async (entryData) => {
    const id = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const entry = { id, ...entryData, timestamp: new Date() } as TrackingEntry;
    
    await setDoc(doc(db, `${PROJECT_PREFIX}entries`, id), entry);
    set(state => ({ entries: [...state.entries, entry] }));
  },
  
  fetchHabits: async (userId) => {
    set({ loading: true });
    try {
      const q = query(
        collection(db, `${PROJECT_PREFIX}habits`),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      const habits = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Habit));
      set({ habits, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
  
  fetchEntries: async (habitId) => {
    set({ loading: true });
    try {
      const q = query(
        collection(db, `${PROJECT_PREFIX}entries`),
        where('habitId', '==', habitId),
        orderBy('timestamp', 'desc')
      );
      const snapshot = await getDocs(q);
      const entries = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as TrackingEntry));
      set({ entries, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  }
}));