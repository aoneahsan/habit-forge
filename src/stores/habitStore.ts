import { create } from 'zustand';
import type { Habit, TrackingEntry, FiveFactors, RopeVisualization } from '@/types';
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
  onSnapshot,
  Timestamp,
  limit
} from 'firebase/firestore';
import toast from 'react-hot-toast';

interface HabitState {
  habits: Habit[];
  entries: TrackingEntry[];
  loading: boolean;
  error: string | null;
  createHabit: (habit: Partial<Habit>) => Promise<string>;
  updateHabit: (id: string, updates: Partial<Habit>) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  trackHabit: (habitId: string, fiveFactors: FiveFactors) => Promise<void>;
  completeHabitToday: (habitId: string) => Promise<void>;
  fetchHabits: (userId: string) => Promise<void>;
  fetchEntries: (habitId: string) => Promise<void>;
  calculateStreak: (habitId: string) => Promise<number>;
  updateRopeVisualization: (habitId: string) => Promise<void>;
  subscribeToHabits: (userId: string) => () => void;
}

// Helper function to calculate rope properties based on streak
const calculateRopeProperties = (streak: number): RopeVisualization => {
  let thickness = 1;
  let material = 'thread';
  let color = '#3b82f6';
  let glowIntensity = 0;
  let strands = 1;
  let effects: string[] = [];

  if (streak >= 90) {
    thickness = 10;
    material = 'steel cable';
    color = '#fbbf24';
    glowIntensity = 1;
    strands = 20;
    effects = ['shimmer', 'pulse', 'radiate'];
  } else if (streak >= 60) {
    thickness = 8;
    material = 'thick rope';
    color = '#a855f7';
    glowIntensity = 0.8;
    strands = 15;
    effects = ['shimmer', 'pulse'];
  } else if (streak >= 45) {
    thickness = 6;
    material = 'rope';
    color = '#8b5cf6';
    glowIntensity = 0.6;
    strands = 10;
    effects = ['pulse'];
  } else if (streak >= 30) {
    thickness = 5;
    material = 'cord';
    color = '#6366f1';
    glowIntensity = 0.5;
    strands = 8;
    effects = ['glow'];
  } else if (streak >= 21) {
    thickness = 4;
    material = 'twine';
    color = '#3b82f6';
    glowIntensity = 0.4;
    strands = 6;
    effects = ['subtle-glow'];
  } else if (streak >= 14) {
    thickness = 3;
    material = 'string';
    color = '#06b6d4';
    glowIntensity = 0.3;
    strands = 4;
    effects = [];
  } else if (streak >= 7) {
    thickness = 2;
    material = 'yarn';
    color = '#10b981';
    glowIntensity = 0.2;
    strands = 3;
    effects = [];
  } else if (streak >= 3) {
    thickness = 1.5;
    material = 'thin string';
    color = '#22c55e';
    glowIntensity = 0.1;
    strands = 2;
    effects = [];
  }

  return {
    thickness,
    material,
    color,
    glowIntensity,
    strands,
    effects
  };
};

// Helper to check if two dates are consecutive days
const areConsecutiveDays = (date1: Date, date2: Date): boolean => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  d1.setHours(0, 0, 0, 0);
  d2.setHours(0, 0, 0, 0);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays === 1;
};

// Helper to check if date is today
const isToday = (date: Date): boolean => {
  const today = new Date();
  const d = new Date(date);
  return d.toDateString() === today.toDateString();
};

export const useHabitStore = create<HabitState>((set, get) => ({
  habits: [],
  entries: [],
  loading: false,
  error: null,
  
  createHabit: async (habitData) => {
    const id = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const habit: Habit = {
      id,
      title: habitData.title || '',
      description: habitData.description || '',
      category: habitData.category || 'other',
      type: habitData.type || 'build',
      userId: habitData.userId || '',
      frequency: habitData.frequency || { type: 'daily' },
      reminders: habitData.reminders || [],
      milestones: habitData.milestones || [
        { days: 7, achieved: false, achievedDate: undefined },
        { days: 21, achieved: false, achievedDate: undefined },
        { days: 30, achieved: false, achievedDate: undefined },
        { days: 60, achieved: false, achievedDate: undefined },
        { days: 90, achieved: false, achievedDate: undefined }
      ],
      strength: 0,
      currentStreak: 0,
      longestStreak: 0,
      completionRate: 0,
      totalCompletions: 0,
      status: 'active',
      completedToday: false,
      ropeVisualization: calculateRopeProperties(0),
      startDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      lastCompletedDate: undefined,
      successCriteria: habitData.successCriteria,
      accountability: habitData.accountability || 'private',
      duration: habitData.duration,
      difficulty: habitData.difficulty,
      goal: habitData.goal,
      motivation: habitData.motivation
    } as Habit;
    
    try {
      await setDoc(doc(db, `${PROJECT_PREFIX}habits`, id), {
        ...habit,
        createdAt: Timestamp.fromDate(habit.createdAt),
        updatedAt: Timestamp.fromDate(habit.updatedAt)
      });
      set(state => ({ habits: [...state.habits, habit] }));
      toast.success('🎯 Habit created successfully!');
      return id;
    } catch (error: any) {
      toast.error('Failed to create habit: ' + error.message);
      throw error;
    }
  },
  
  updateHabit: async (id, updates) => {
    try {
      await updateDoc(doc(db, `${PROJECT_PREFIX}habits`, id), {
        ...updates,
        updatedAt: Timestamp.now()
      });
      set(state => ({
        habits: state.habits.map(h => 
          h.id === id ? { ...h, ...updates, updatedAt: new Date() } : h
        )
      }));
    } catch (error: any) {
      toast.error('Failed to update habit: ' + error.message);
      throw error;
    }
  },
  
  deleteHabit: async (id) => {
    try {
      await deleteDoc(doc(db, `${PROJECT_PREFIX}habits`, id));
      set(state => ({
        habits: state.habits.filter(h => h.id !== id)
      }));
      toast.success('Habit deleted');
    } catch (error: any) {
      toast.error('Failed to delete habit: ' + error.message);
      throw error;
    }
  },
  
  trackHabit: async (habitId, fiveFactors) => {
    const id = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const entry: TrackingEntry = {
      id,
      habitId,
      userId: fiveFactors.userId || '',
      timestamp: new Date(),
      fiveFactors,
      additionalData: {},
      completionStatus: 'full',
      automated: false,
      modified: false
    };
    
    try {
      await setDoc(doc(db, `${PROJECT_PREFIX}entries`, id), {
        ...entry,
        timestamp: Timestamp.fromDate(entry.timestamp)
      });
      
      set(state => ({ entries: [...state.entries, entry] }));
      
      // Update habit's last entry
      const habit = get().habits.find(h => h.id === habitId);
      if (habit) {
        await get().updateHabit(habitId, { 
          updatedAt: new Date()
        });
      }
      
      toast.success('✅ Habit tracked with five factors!');
    } catch (error: any) {
      toast.error('Failed to track habit: ' + error.message);
      throw error;
    }
  },
  
  completeHabitToday: async (habitId) => {
    try {
      const habit = get().habits.find(h => h.id === habitId);
      if (!habit) throw new Error('Habit not found');
      
      // Check if already completed today
      if (habit.completedToday) {
        toast('Already completed today!', { icon: 'ℹ️' });
        return;
      }
      
      // Calculate new streak
      let newStreak = habit.currentStreak;
      if (habit.lastCompletedDate) {
        const lastDate = new Date(habit.lastCompletedDate);
        if (areConsecutiveDays(lastDate, new Date())) {
          newStreak++;
        } else if (!isToday(lastDate)) {
          newStreak = 1; // Reset streak if not consecutive
        }
      } else {
        newStreak = 1; // First completion
      }
      
      // Update milestones
      const updatedMilestones = habit.milestones?.map(m => {
        if (newStreak >= m.days && !m.achieved) {
          toast.success(`🏆 Milestone achieved: ${m.days} days!`, { duration: 5000 });
          return { ...m, achieved: true, achievedDate: new Date() };
        }
        return m;
      });
      
      // Calculate new completion rate
      const totalDays = Math.ceil((new Date().getTime() - new Date(habit.createdAt).getTime()) / (1000 * 60 * 60 * 24));
      const newTotalCompletions = (habit.totalCompletions || 0) + 1;
      const newCompletionRate = newTotalCompletions / totalDays;
      
      // Calculate habit strength (0-100)
      const strength = Math.min(100, Math.round((newStreak / 90) * 100));
      
      // Update rope visualization
      const ropeVisualization = calculateRopeProperties(newStreak);
      
      const updates = {
        completedToday: true,
        currentStreak: newStreak,
        longestStreak: Math.max(newStreak, habit.longestStreak || 0),
        lastCompletedDate: new Date(),
        totalCompletions: newTotalCompletions,
        completionRate: newCompletionRate,
        strength,
        ropeVisualization,
        milestones: updatedMilestones
      };
      
      await get().updateHabit(habitId, updates);
      
      // Create a basic tracking entry
      const basicFiveFactor: FiveFactor = {
        location: 'Not specified',
        emotion: 'neutral',
        people: 'alone',
        timeOfDay: new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening',
        trigger: 'routine',
        userId: habit.userId
      };
      
      await get().trackHabit(habitId, basicFiveFactor);
      
      toast.success(`🔥 Streak: ${newStreak} days!`, { duration: 3000 });
      
      // Special celebrations
      if (newStreak === 7) {
        toast('🎉 One week streak! Keep going!', { duration: 5000, icon: '🏆' });
      } else if (newStreak === 21) {
        toast('🎊 21 days! You\'re building a real habit!', { duration: 5000, icon: '⭐' });
      } else if (newStreak === 30) {
        toast('🚀 30 days! You\'re unstoppable!', { duration: 5000, icon: '💪' });
      } else if (newStreak === 90) {
        toast('👑 90 days! You\'re a habit master!', { duration: 5000, icon: '🏅' });
      }
    } catch (error: any) {
      toast.error('Failed to complete habit: ' + error.message);
      throw error;
    }
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
      const habits = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          lastCompletedDate: data.lastCompletedDate?.toDate(),
          // Check if completed today
          completedToday: data.lastCompletedDate ? isToday(data.lastCompletedDate.toDate()) : false
        } as Habit;
      });
      set({ habits, loading: false });
    } catch (error: any) {
      console.error('Error fetching habits:', error);
      set({ error: error.message, loading: false });
      toast.error('Failed to load habits');
    }
  },
  
  fetchEntries: async (habitId) => {
    set({ loading: true });
    try {
      const q = query(
        collection(db, `${PROJECT_PREFIX}entries`),
        where('habitId', '==', habitId),
        orderBy('timestamp', 'desc'),
        limit(100)
      );
      const snapshot = await getDocs(q);
      const entries = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          timestamp: data.timestamp?.toDate() || new Date()
        } as TrackingEntry;
      });
      set({ entries, loading: false });
    } catch (error: any) {
      console.error('Error fetching entries:', error);
      set({ error: error.message, loading: false });
    }
  },
  
  calculateStreak: async (habitId) => {
    try {
      const q = query(
        collection(db, `${PROJECT_PREFIX}entries`),
        where('habitId', '==', habitId),
        where('completed', '==', true),
        orderBy('timestamp', 'desc'),
        limit(365) // Check last year
      );
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) return 0;
      
      const entries = snapshot.docs.map(doc => {
        const data = doc.data();
        return data.timestamp?.toDate() || new Date();
      });
      
      // Sort dates in descending order
      entries.sort((a, b) => b.getTime() - a.getTime());
      
      let streak = 0;
      let currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      
      for (const entryDate of entries) {
        const entry = new Date(entryDate);
        entry.setHours(0, 0, 0, 0);
        
        if (entry.getTime() === currentDate.getTime()) {
          streak++;
          currentDate.setDate(currentDate.getDate() - 1);
        } else if (entry.getTime() < currentDate.getTime()) {
          // Gap in dates, streak broken
          break;
        }
      }
      
      return streak;
    } catch (error) {
      console.error('Error calculating streak:', error);
      return 0;
    }
  },
  
  updateRopeVisualization: async (habitId) => {
    const habit = get().habits.find(h => h.id === habitId);
    if (!habit) return;
    
    const streak = await get().calculateStreak(habitId);
    const ropeVisualization = calculateRopeProperties(streak);
    
    await get().updateHabit(habitId, { ropeVisualization });
  },
  
  subscribeToHabits: (userId) => {
    const q = query(
      collection(db, `${PROJECT_PREFIX}habits`),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const habits = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          lastCompletedDate: data.lastCompletedDate?.toDate(),
          completedToday: data.lastCompletedDate ? isToday(data.lastCompletedDate.toDate()) : false
        } as Habit;
      });
      set({ habits });
    });
    
    return unsubscribe;
  }
}));