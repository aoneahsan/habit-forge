import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { Habit, HabitEntry } from '@/types/habit.types';

interface HabitState {
  habits: Habit[];
  activeHabit: Habit | null;
  entries: Record<string, HabitEntry[]>; // habitId -> entries
  isLoading: boolean;
  error: string | null;
  
  // UI State
  selectedDate: Date;
  viewMode: 'list' | 'grid' | 'calendar';
  filterCategory: string | null;
  sortBy: 'name' | 'streak' | 'completion' | 'created';
}

interface HabitActions {
  // Habits
  setHabits: (habits: Habit[]) => void;
  addHabit: (habit: Habit) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  setActiveHabit: (habit: Habit | null) => void;
  
  // Entries
  setEntries: (habitId: string, entries: HabitEntry[]) => void;
  addEntry: (entry: HabitEntry) => void;
  updateEntry: (id: string, updates: Partial<HabitEntry>) => void;
  deleteEntry: (id: string) => void;
  
  // UI State
  setSelectedDate: (date: Date) => void;
  setViewMode: (mode: 'list' | 'grid' | 'calendar') => void;
  setFilterCategory: (category: string | null) => void;
  setSortBy: (sort: 'name' | 'streak' | 'completion' | 'created') => void;
  
  // Loading & Error
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Computed
  getHabitsByCategory: (category: string) => Habit[];
  getTodayEntries: () => HabitEntry[];
  getHabitStreak: (habitId: string) => number;
}

export const useHabitStore = create<HabitState & HabitActions>()(
  immer((set, get) => ({
    // State
    habits: [],
    activeHabit: null,
    entries: {},
    isLoading: false,
    error: null,
    selectedDate: new Date(),
    viewMode: 'list',
    filterCategory: null,
    sortBy: 'name',

    // Actions
    setHabits: (habits) =>
      set((state) => {
        state.habits = habits;
      }),

    addHabit: (habit) =>
      set((state) => {
        state.habits.push(habit);
      }),

    updateHabit: (id, updates) =>
      set((state) => {
        const index = state.habits.findIndex((h) => h.id === id);
        if (index !== -1) {
          Object.assign(state.habits[index], updates);
        }
      }),

    deleteHabit: (id) =>
      set((state) => {
        state.habits = state.habits.filter((h) => h.id !== id);
        delete state.entries[id];
      }),

    setActiveHabit: (habit) =>
      set((state) => {
        state.activeHabit = habit;
      }),

    setEntries: (habitId, entries) =>
      set((state) => {
        state.entries[habitId] = entries;
      }),

    addEntry: (entry) =>
      set((state) => {
        if (!state.entries[entry.habitId]) {
          state.entries[entry.habitId] = [];
        }
        state.entries[entry.habitId].push(entry);
      }),

    updateEntry: (id, updates) =>
      set((state) => {
        for (const habitId in state.entries) {
          const index = state.entries[habitId].findIndex((e) => e.id === id);
          if (index !== -1) {
            Object.assign(state.entries[habitId][index], updates);
            break;
          }
        }
      }),

    deleteEntry: (id) =>
      set((state) => {
        for (const habitId in state.entries) {
          state.entries[habitId] = state.entries[habitId].filter((e) => e.id !== id);
        }
      }),

    setSelectedDate: (date) =>
      set((state) => {
        state.selectedDate = date;
      }),

    setViewMode: (mode) =>
      set((state) => {
        state.viewMode = mode;
      }),

    setFilterCategory: (category) =>
      set((state) => {
        state.filterCategory = category;
      }),

    setSortBy: (sort) =>
      set((state) => {
        state.sortBy = sort;
      }),

    setLoading: (loading) =>
      set((state) => {
        state.isLoading = loading;
      }),

    setError: (error) =>
      set((state) => {
        state.error = error;
      }),

    // Computed
    getHabitsByCategory: (category) => {
      return get().habits.filter((h) => h.category === category);
    },

    getTodayEntries: () => {
      const today = new Date().toDateString();
      const allEntries: HabitEntry[] = [];
      
      for (const habitId in get().entries) {
        const habitEntries = get().entries[habitId].filter(
          (e) => new Date(e.date).toDateString() === today
        );
        allEntries.push(...habitEntries);
      }
      
      return allEntries;
    },

    getHabitStreak: (habitId) => {
      const habit = get().habits.find((h) => h.id === habitId);
      return habit?.progress.currentStreak || 0;
    },
  }))
);