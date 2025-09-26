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
  limit,
  Timestamp
} from 'firebase/firestore';
import { db, PROJECT_PREFIX } from '@/config/firebase';
import { Habit, TrackingEntry } from '@/types';
import { generateId } from '@/lib/utils';

// Repository pattern for data access
class HabitService {
  private readonly COLLECTION_NAME = `${PROJECT_PREFIX}habits`;
  private readonly ENTRIES_COLLECTION = `${PROJECT_PREFIX}entries`;

  // Create habit with validation
  async createHabit(habitData: Partial<Habit>): Promise<string> {
    this.validateHabitData(habitData);
    
    const id = generateId();
    const habit: Habit = {
      ...this.getDefaultHabit(),
      ...habitData,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    } as Habit;

    await setDoc(doc(db, this.COLLECTION_NAME, id), {
      ...habit,
      createdAt: Timestamp.fromDate(habit.createdAt),
      updatedAt: Timestamp.fromDate(habit.updatedAt)
    });

    return id;
  }

  // Fetch habits with pagination
  async fetchUserHabits(userId: string, limitCount = 20): Promise<Habit[]> {
    if (!userId) throw new Error('User ID is required');

    const q = query(
      collection(db, this.COLLECTION_NAME),
      where('userId', '==', userId),
      where('status', 'in', ['active', 'paused']),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => this.mapDocumentToHabit(doc));
  }

  // Update habit with optimistic locking
  async updateHabit(id: string, updates: Partial<Habit>): Promise<void> {
    if (!id) throw new Error('Habit ID is required');

    const docRef = doc(db, this.COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      throw new Error('Habit not found');
    }

    await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.now()
    });
  }

  // Soft delete for data retention
  async deleteHabit(id: string): Promise<void> {
    if (!id) throw new Error('Habit ID is required');

    await this.updateHabit(id, { 
      status: 'abandoned',
      deletedAt: new Date()
    } as Partial<Habit>);
  }

  // Track habit with validation
  async trackHabit(entry: Partial<TrackingEntry>): Promise<string> {
    this.validateTrackingEntry(entry);

    const id = generateId();
    const trackingEntry: TrackingEntry = {
      ...entry,
      id,
      timestamp: new Date(),
      automated: false,
      modified: false
    } as TrackingEntry;

    await setDoc(doc(db, this.ENTRIES_COLLECTION, id), {
      ...trackingEntry,
      timestamp: Timestamp.fromDate(trackingEntry.timestamp)
    });

    // Update habit strength asynchronously
    this.updateHabitStrength(entry.habitId!);

    return id;
  }

  // Private helper methods
  private validateHabitData(data: Partial<Habit>): void {
    if (!data.title || data.title.trim().length < 3) {
      throw new Error('Habit title must be at least 3 characters');
    }
    if (!data.userId) {
      throw new Error('User ID is required');
    }
    if (!data.category) {
      throw new Error('Category is required');
    }
  }

  private validateTrackingEntry(entry: Partial<TrackingEntry>): void {
    if (!entry.habitId) {
      throw new Error('Habit ID is required');
    }
    if (!entry.userId) {
      throw new Error('User ID is required');
    }
  }

  private getDefaultHabit(): Partial<Habit> {
    return {
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
      reminders: [],
      milestones: [
        { days: 7, achieved: false },
        { days: 21, achieved: false },
        { days: 30, achieved: false },
        { days: 60, achieved: false },
        { days: 90, achieved: false }
      ]
    };
  }

  private mapDocumentToHabit(doc: any): Habit {
    const data = doc.data();
    return {
      ...data,
      id: doc.id,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
      startDate: data.startDate?.toDate() || new Date(),
      endDate: data.endDate?.toDate()
    } as Habit;
  }

  private async updateHabitStrength(habitId: string): Promise<void> {
    // This would calculate habit strength based on entries
    // Implemented asynchronously to not block the main operation
    setTimeout(async () => {
      try {
        const entries = await this.getRecentEntries(habitId, 30);
        const strength = this.calculateStrength(entries);
        await this.updateHabit(habitId, { strength });
      } catch (error) {
        console.error('Failed to update habit strength:', error);
      }
    }, 0);
  }

  private async getRecentEntries(habitId: string, days: number): Promise<TrackingEntry[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const q = query(
      collection(db, this.ENTRIES_COLLECTION),
      where('habitId', '==', habitId),
      where('timestamp', '>=', Timestamp.fromDate(startDate)),
      orderBy('timestamp', 'desc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
      timestamp: doc.data().timestamp?.toDate()
    } as TrackingEntry));
  }

  private calculateStrength(entries: TrackingEntry[]): number {
    if (entries.length === 0) return 0;
    
    // Simple strength calculation - can be enhanced
    const completionRate = entries.filter(e => e.completionStatus === 'full').length / 30;
    return Math.min(Math.round(completionRate * 100), 100);
  }
}

export const habitService = new HabitService();