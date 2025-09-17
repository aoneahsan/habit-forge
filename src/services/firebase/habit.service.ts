import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  increment,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/config/firebase.config';
import type { Habit, HabitFormData, HabitCompletion } from '@/types/habit.types';
import { APP_CONFIG } from '@/constants/app.constants';

const HABITS_COLLECTION = `${APP_CONFIG.firebase.projectPrefix}habits`;
const COMPLETIONS_COLLECTION = `${APP_CONFIG.firebase.projectPrefix}completions`;

// Create a new habit
export async function createHabit(userId: string, data: HabitFormData): Promise<string> {
  try {
    const habitData = {
      ...data,
      userId,
      streak: 0,
      longestStreak: 0,
      totalCompletions: 0,
      status: 'active',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, HABITS_COLLECTION), habitData);
    return docRef.id;
  } catch (error) {
    console.error('Error creating habit:', error);
    throw new Error('Failed to create habit');
  }
}

// Get all habits for a user
export async function getUserHabits(userId: string): Promise<Habit[]> {
  try {
    const q = query(
      collection(db, HABITS_COLLECTION),
      where('userId', '==', userId),
      where('status', '==', 'active'),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate?.() || new Date(),
      lastCompletedAt: doc.data().lastCompletedAt?.toDate?.() || undefined,
    } as Habit));
  } catch (error) {
    console.error('Error fetching habits:', error);
    throw new Error('Failed to fetch habits');
  }
}

// Get a single habit
export async function getHabit(habitId: string): Promise<Habit | null> {
  try {
    const docRef = doc(db, HABITS_COLLECTION, habitId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    return {
      id: docSnap.id,
      ...docSnap.data(),
      createdAt: docSnap.data().createdAt?.toDate?.() || new Date(),
      updatedAt: docSnap.data().updatedAt?.toDate?.() || new Date(),
      lastCompletedAt: docSnap.data().lastCompletedAt?.toDate?.() || undefined,
    } as Habit;
  } catch (error) {
    console.error('Error fetching habit:', error);
    throw new Error('Failed to fetch habit');
  }
}

// Update a habit
export async function updateHabit(habitId: string, data: Partial<HabitFormData>): Promise<void> {
  try {
    const docRef = doc(db, HABITS_COLLECTION, habitId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating habit:', error);
    throw new Error('Failed to update habit');
  }
}

// Complete a habit
export async function completeHabit(habitId: string, userId: string): Promise<void> {
  try {
    const habit = await getHabit(habitId);
    if (!habit) throw new Error('Habit not found');

    // Validate that the user owns this habit
    if (habit.userId !== userId) {
      throw new Error('Unauthorized: You can only complete your own habits');
    }

    const now = new Date();
    const lastCompleted = habit.lastCompletedAt;
    
    // Check if already completed today
    if (lastCompleted && lastCompleted.toDateString() === now.toDateString()) {
      throw new Error('Habit already completed today');
    }

    // Calculate streak
    let newStreak = 1;
    if (lastCompleted) {
      const daysDiff = Math.floor((now.getTime() - lastCompleted.getTime()) / (1000 * 60 * 60 * 24));
      if (daysDiff === 1) {
        newStreak = (habit.streak || 0) + 1;
      }
    }

    // Update habit - ensure userId remains unchanged to satisfy security rules
    await updateDoc(doc(db, HABITS_COLLECTION, habitId), {
      userId: habit.userId, // Explicitly include userId to satisfy security rules
      streak: newStreak,
      longestStreak: Math.max(newStreak, habit.longestStreak || 0),
      totalCompletions: increment(1),
      lastCompletedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // Record completion
    await addDoc(collection(db, COMPLETIONS_COLLECTION), {
      habitId,
      userId: habit.userId,
      completedAt: serverTimestamp(),
      points: (habit.points || 0),
      streak: newStreak,
    });

    // Update user stats
    await updateUserStats(habit.userId, (habit.points || 0), newStreak);
  } catch (error) {
    console.error('Error completing habit:', error);
    throw error;
  }
}

// Delete a habit (soft delete)
export async function deleteHabit(habitId: string): Promise<void> {
  try {
    await updateDoc(doc(db, HABITS_COLLECTION, habitId), {
      status: 'deleted',
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error deleting habit:', error);
    throw new Error('Failed to delete habit');
  }
}

// Get habit completions
export async function getHabitCompletions(habitId: string, limit = 30): Promise<HabitCompletion[]> {
  try {
    const q = query(
      collection(db, COMPLETIONS_COLLECTION),
      where('habitId', '==', habitId),
      orderBy('completedAt', 'desc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.slice(0, limit).map(doc => {
      const data = doc.data();
      return {
        habitId: data.habitId,
        userId: data.userId,
        completedAt: data.completedAt?.toDate?.() || new Date(),
        notes: data.notes,
      } as HabitCompletion;
    });
  } catch (error) {
    console.error('Error fetching completions:', error);
    throw new Error('Failed to fetch completions');
  }
}

// Helper function to update user stats
async function updateUserStats(userId: string, points: number, streak: number): Promise<void> {
  const userRef = doc(db, `${APP_CONFIG.firebase.projectPrefix}users`, userId);
  await updateDoc(userRef, {
    'stats.totalPoints': increment(points),
    'stats.currentStreak': streak,
    'stats.totalHabitsCompleted': increment(1),
    updatedAt: serverTimestamp(),
  });
}