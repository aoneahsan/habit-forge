import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import type { User, SystemConfig } from '@/types';

export class AdminService {
  private static instance: AdminService;
  
  private constructor() {}
  
  public static getInstance(): AdminService {
    if (!AdminService.instance) {
      AdminService.instance = new AdminService();
    }
    return AdminService.instance;
  }

  async getSystemStats() {
    try {
      // Get user stats
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const totalUsers = usersSnapshot.size;
      
      const premiumUsers = usersSnapshot.docs.filter(
        doc => doc.data().subscriptionTier === 'premium'
      ).length;
      
      // Get habit stats
      const habitsSnapshot = await getDocs(collection(db, 'habits'));
      const activeHabits = habitsSnapshot.docs.filter(
        doc => doc.data().status === 'active'
      ).length;
      
      // Get today's entries
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const entriesQuery = query(
        collection(db, 'entries'),
        where('date', '>=', Timestamp.fromDate(today))
      );
      const entriesSnapshot = await getDocs(entriesQuery);
      const dailyEntries = entriesSnapshot.size;
      
      // Get recent activity
      const activityQuery = query(
        collection(db, 'activity_logs'),
        orderBy('timestamp', 'desc'),
        limit(10)
      );
      const activitySnapshot = await getDocs(activityQuery);
      const recentActivity = activitySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate?.().toLocaleString() || 'Unknown'
      }));
      
      return {
        totalUsers,
        premiumUsers,
        activeHabits,
        dailyEntries,
        recentActivity
      };
    } catch (error) {
      console.error('Error getting system stats:', error);
      throw error;
    }
  }

  async getUsers(filter: string = 'all'): Promise<User[]> {
    try {
      const usersRef = collection(db, 'users');
      let q: any = usersRef;
      
      if (filter !== 'all') {
        if (filter === 'premium' || filter === 'free') {
          q = query(usersRef, where('subscriptionTier', '==', filter));
        } else if (filter === 'suspended' || filter === 'active') {
          q = query(usersRef, where('status', '==', filter));
        }
      }
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data
        } as User;
      });
    } catch (error) {
      console.error('Error getting users:', error);
      throw error;
    }
  }

  async suspendUser(userId: string) {
    try {
      await updateDoc(doc(db, 'users', userId), {
        status: 'suspended',
        suspendedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error suspending user:', error);
      throw error;
    }
  }

  async activateUser(userId: string) {
    try {
      await updateDoc(doc(db, 'users', userId), {
        status: 'active',
        suspendedAt: null
      });
    } catch (error) {
      console.error('Error activating user:', error);
      throw error;
    }
  }

  async deleteUser(userId: string) {
    try {
      // Delete user habits
      const habitsQuery = query(collection(db, 'habits'), where('userId', '==', userId));
      const habitsSnapshot = await getDocs(habitsQuery);
      
      for (const habitDoc of habitsSnapshot.docs) {
        await deleteDoc(habitDoc.ref);
      }
      
      // Delete user entries
      const entriesQuery = query(collection(db, 'entries'), where('userId', '==', userId));
      const entriesSnapshot = await getDocs(entriesQuery);
      
      for (const entryDoc of entriesSnapshot.docs) {
        await deleteDoc(entryDoc.ref);
      }
      
      // Delete user document
      await deleteDoc(doc(db, 'users', userId));
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  async upgradeUser(userId: string) {
    try {
      await updateDoc(doc(db, 'users', userId), {
        subscriptionTier: 'premium',
        upgradedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error upgrading user:', error);
      throw error;
    }
  }

  async getSystemConfig(): Promise<SystemConfig> {
    try {
      const configDoc = await getDoc(doc(db, 'system_configs', 'settings'));
      if (configDoc.exists()) {
        return configDoc.data() as SystemConfig;
      }
      throw new Error('System config not found');
    } catch (error) {
      console.error('Error getting system config:', error);
      throw error;
    }
  }

  async updateSystemConfig(config: Partial<SystemConfig>) {
    try {
      await updateDoc(doc(db, 'system_configs', 'settings'), config);
    } catch (error) {
      console.error('Error updating system config:', error);
      throw error;
    }
  }

  async logActivity(activity: {
    type: string;
    description: string;
    userId?: string;
    metadata?: any;
  }) {
    try {
      await setDoc(doc(collection(db, 'activity_logs')), {
        ...activity,
        timestamp: Timestamp.now()
      });
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  }
}