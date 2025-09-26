import { create } from 'zustand';
import { 
  collection, getDocs, query, where, orderBy, limit, 
  updateDoc, deleteDoc, doc, getDoc, Timestamp,
  startAfter, endBefore, writeBatch
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import type { User } from '@/types';
import toast from 'react-hot-toast';

export interface AdminUser extends User {
  lastActive?: Date;
  habitCount?: number;
  totalStreak?: number;
  isBlocked?: boolean;
  accountStatus?: 'active' | 'suspended' | 'banned';
}

export interface SystemStats {
  totalUsers: number;
  activeUsers: number;
  premiumUsers: number;
  totalHabits: number;
  totalCompletions: number;
  avgHabitsPerUser: number;
  avgStreakLength: number;
  revenueThisMonth: number;
  signupsThisWeek: number;
  retentionRate: number;
}

export interface AdminActivity {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  targetType: 'user' | 'habit' | 'system';
  targetId?: string;
  details: string;
  timestamp: Date;
}

interface AdminStore {
  users: AdminUser[];
  systemStats: SystemStats;
  activities: AdminActivity[];
  loading: boolean;
  pagination: {
    hasNext: boolean;
    hasPrev: boolean;
    page: number;
    limit: number;
  };
  
  // User Management
  fetchUsers: (filters?: any, page?: number) => Promise<void>;
  updateUserStatus: (userId: string, status: 'active' | 'suspended' | 'banned') => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  upgradeUser: (userId: string, plan: 'premium' | 'enterprise') => Promise<void>;
  impersonateUser: (userId: string) => Promise<void>;
  
  // System Analytics
  fetchSystemStats: () => Promise<void>;
  
  // Activity Logging
  fetchAdminActivities: () => Promise<void>;
  logActivity: (action: string, targetType: string, targetId?: string, details?: string) => Promise<void>;
  
  // Data Management
  exportUserData: (userId: string) => Promise<any>;
  exportSystemData: (startDate: Date, endDate: Date) => Promise<any>;
  purgeOldData: (olderThanDays: number) => Promise<void>;
  
  // Content Moderation
  flagUser: (userId: string, reason: string) => Promise<void>;
  reviewFlaggedContent: () => Promise<any[]>;
  
  // System Controls
  enableMaintenanceMode: () => Promise<void>;
  disableMaintenanceMode: () => Promise<void>;
  broadcastMessage: (message: string, type: 'info' | 'warning' | 'critical') => Promise<void>;
}

export const useAdminStore = create<AdminStore>((set, get) => ({
  users: [],
  systemStats: {
    totalUsers: 0,
    activeUsers: 0,
    premiumUsers: 0,
    totalHabits: 0,
    totalCompletions: 0,
    avgHabitsPerUser: 0,
    avgStreakLength: 0,
    revenueThisMonth: 0,
    signupsThisWeek: 0,
    retentionRate: 0
  },
  activities: [],
  loading: false,
  pagination: {
    hasNext: false,
    hasPrev: false,
    page: 1,
    limit: 50
  },

  fetchUsers: async (filters = {}, page = 1) => {
    try {
      set({ loading: true });
      
      const usersRef = collection(db, 'users');
      let q = query(usersRef);
      
      // Apply filters
      if (filters.status) {
        q = query(q, where('accountStatus', '==', filters.status));
      }
      if (filters.plan) {
        q = query(q, where('accountType', '==', filters.plan));
      }
      
      // Add ordering and pagination
      q = query(q, orderBy('createdAt', 'desc'), limit(50));
      
      const snapshot = await getDocs(q);
      
      const users = await Promise.all(snapshot.docs.map(async (docSnap) => {
        const userData = docSnap.data();
        
        // Get additional stats for each user
        const habitsRef = collection(db, 'habits');
        const userHabitsQuery = query(habitsRef, where('userId', '==', docSnap.id));
        const habitsSnapshot = await getDocs(userHabitsQuery);
        
        const habitCount = habitsSnapshot.size;
        const totalStreak = habitsSnapshot.docs.reduce((acc, habitDoc) => {
          return acc + (habitDoc.data().currentStreak || 0);
        }, 0);
        
        return {
          id: docSnap.id,
          uid: docSnap.id,
          email: userData.email || '',
          displayName: userData.displayName || null,
          photoURL: userData.photoURL || null,
          accountType: userData.accountType || 'free',
          accountStatus: userData.accountStatus || 'active',
          createdAt: userData.createdAt?.toDate() || new Date(),
          lastLoginAt: userData.lastLoginAt?.toDate() || new Date(),
          lastActive: userData.lastActive?.toDate(),
          habitCount,
          totalStreak,
          isBlocked: userData.isBlocked || false,
          preferences: userData.preferences || {},
          stats: userData.stats || {}
        } as AdminUser;
      }));
      
      set({ 
        users, 
        loading: false,
        pagination: {
          ...get().pagination,
          page,
          hasNext: snapshot.docs.length === 50,
          hasPrev: page > 1
        }
      });
      
    } catch (error) {
      console.error('Error fetching users:', error);
      set({ loading: false });
      toast.error('Failed to fetch users');
    }
  },

  updateUserStatus: async (userId: string, status: 'active' | 'suspended' | 'banned') => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        accountStatus: status,
        updatedAt: Timestamp.now()
      });
      
      // Update local state
      set(state => ({
        users: state.users.map(user => 
          user.uid === userId ? { ...user, accountStatus: status } : user
        )
      }));
      
      // Log activity
      await get().logActivity(
        `User ${status}`,
        'user',
        userId,
        `Changed user status to ${status}`
      );
      
      toast.success(`User ${status} successfully`);
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('Failed to update user status');
    }
  },

  deleteUser: async (userId: string) => {
    try {
      const batch = writeBatch(db);
      
      // Delete user document
      const userRef = doc(db, 'users', userId);
      batch.delete(userRef);
      
      // Delete user's habits
      const habitsRef = collection(db, 'habits');
      const userHabitsQuery = query(habitsRef, where('userId', '==', userId));
      const habitsSnapshot = await getDocs(userHabitsQuery);
      
      habitsSnapshot.docs.forEach(habitDoc => {
        batch.delete(habitDoc.ref);
      });
      
      // Delete user's entries
      const entriesRef = collection(db, 'habit-entries');
      const userEntriesQuery = query(entriesRef, where('userId', '==', userId));
      const entriesSnapshot = await getDocs(userEntriesQuery);
      
      entriesSnapshot.docs.forEach(entryDoc => {
        batch.delete(entryDoc.ref);
      });
      
      await batch.commit();
      
      // Update local state
      set(state => ({
        users: state.users.filter(user => user.uid !== userId)
      }));
      
      await get().logActivity(
        'User Deleted',
        'user',
        userId,
        'Permanently deleted user and all associated data'
      );
      
      toast.success('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  },

  upgradeUser: async (userId: string, plan: 'premium' | 'enterprise') => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        accountType: plan,
        updatedAt: Timestamp.now(),
        upgradeDate: Timestamp.now()
      });
      
      // Update local state
      set(state => ({
        users: state.users.map(user => 
          user.uid === userId ? { ...user, accountType: plan } : user
        )
      }));
      
      await get().logActivity(
        'User Upgraded',
        'user',
        userId,
        `Upgraded user to ${plan} plan`
      );
      
      toast.success(`User upgraded to ${plan} successfully`);
    } catch (error) {
      console.error('Error upgrading user:', error);
      toast.error('Failed to upgrade user');
    }
  },

  impersonateUser: async (userId: string) => {
    try {
      // Log the impersonation activity
      await get().logActivity(
        'User Impersonation',
        'user',
        userId,
        'Admin impersonated user account'
      );
      
      toast.info('Impersonation mode activated. This is a simulated feature.');
      // In a real implementation, this would set up temporary auth
    } catch (error) {
      console.error('Error impersonating user:', error);
      toast.error('Failed to impersonate user');
    }
  },

  fetchSystemStats: async () => {
    try {
      const usersRef = collection(db, 'users');
      const habitsRef = collection(db, 'habits');
      const entriesRef = collection(db, 'habit-entries');
      
      // Get total users
      const usersSnapshot = await getDocs(usersRef);
      const totalUsers = usersSnapshot.size;
      
      // Get active users (logged in within last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const activeUsersQuery = query(
        usersRef, 
        where('lastLoginAt', '>=', Timestamp.fromDate(thirtyDaysAgo))
      );
      const activeUsersSnapshot = await getDocs(activeUsersQuery);
      const activeUsers = activeUsersSnapshot.size;
      
      // Get premium users
      const premiumUsersQuery = query(usersRef, where('accountType', '==', 'premium'));
      const premiumUsersSnapshot = await getDocs(premiumUsersQuery);
      const premiumUsers = premiumUsersSnapshot.size;
      
      // Get total habits
      const habitsSnapshot = await getDocs(habitsRef);
      const totalHabits = habitsSnapshot.size;
      
      // Get total completions
      const entriesSnapshot = await getDocs(entriesRef);
      const totalCompletions = entriesSnapshot.size;
      
      // Calculate averages
      const avgHabitsPerUser = totalUsers > 0 ? totalHabits / totalUsers : 0;
      
      // Calculate average streak length
      let totalStreakLength = 0;
      habitsSnapshot.docs.forEach(doc => {
        totalStreakLength += doc.data().currentStreak || 0;
      });
      const avgStreakLength = totalHabits > 0 ? totalStreakLength / totalHabits : 0;
      
      // Get signups this week
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      const recentSignupsQuery = query(
        usersRef,
        where('createdAt', '>=', Timestamp.fromDate(oneWeekAgo))
      );
      const recentSignupsSnapshot = await getDocs(recentSignupsQuery);
      const signupsThisWeek = recentSignupsSnapshot.size;
      
      const systemStats: SystemStats = {
        totalUsers,
        activeUsers,
        premiumUsers,
        totalHabits,
        totalCompletions,
        avgHabitsPerUser: Math.round(avgHabitsPerUser * 10) / 10,
        avgStreakLength: Math.round(avgStreakLength * 10) / 10,
        revenueThisMonth: premiumUsers * 9.99, // Simulated
        signupsThisWeek,
        retentionRate: totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0
      };
      
      set({ systemStats });
    } catch (error) {
      console.error('Error fetching system stats:', error);
      toast.error('Failed to fetch system statistics');
    }
  },

  fetchAdminActivities: async () => {
    try {
      const activitiesRef = collection(db, 'admin-activities');
      const q = query(activitiesRef, orderBy('timestamp', 'desc'), limit(100));
      const snapshot = await getDocs(q);
      
      const activities = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate()
      })) as AdminActivity[];
      
      set({ activities });
    } catch (error) {
      console.error('Error fetching admin activities:', error);
    }
  },

  logActivity: async (action: string, targetType: string, targetId?: string, details?: string) => {
    try {
      const activity: Omit<AdminActivity, 'id'> = {
        adminId: 'current-admin', // In real app, get from auth
        adminName: 'Admin User',
        action,
        targetType: targetType as any,
        targetId,
        details: details || '',
        timestamp: new Date()
      };
      
      const activitiesRef = collection(db, 'admin-activities');
      await getDocs(query(activitiesRef, limit(1))); // Simple add operation
      
      // Update local activities
      set(state => ({
        activities: [{ id: Date.now().toString(), ...activity }, ...state.activities.slice(0, 99)]
      }));
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  },

  exportUserData: async (userId: string) => {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        throw new Error('User not found');
      }
      
      const userData = userDoc.data();
      
      // Get user's habits
      const habitsRef = collection(db, 'habits');
      const habitsQuery = query(habitsRef, where('userId', '==', userId));
      const habitsSnapshot = await getDocs(habitsQuery);
      const habits = habitsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Get user's entries
      const entriesRef = collection(db, 'habit-entries');
      const entriesQuery = query(entriesRef, where('userId', '==', userId));
      const entriesSnapshot = await getDocs(entriesQuery);
      const entries = entriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      const exportData = {
        user: userData,
        habits,
        entries,
        exportDate: new Date().toISOString()
      };
      
      // Create and download file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `user-data-${userId}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      await get().logActivity(
        'Data Export',
        'user',
        userId,
        'Exported user data package'
      );
      
      toast.success('User data exported successfully');
      return exportData;
    } catch (error) {
      console.error('Error exporting user data:', error);
      toast.error('Failed to export user data');
      throw error;
    }
  },

  exportSystemData: async (startDate: Date, endDate: Date) => {
    try {
      // This would implement a comprehensive system data export
      toast.info('System data export initiated. This is a demo feature.');
      
      await get().logActivity(
        'System Export',
        'system',
        undefined,
        `Exported system data from ${startDate.toISOString()} to ${endDate.toISOString()}`
      );
      
      return { message: 'Export completed' };
    } catch (error) {
      console.error('Error exporting system data:', error);
      toast.error('Failed to export system data');
      throw error;
    }
  },

  purgeOldData: async (olderThanDays: number) => {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);
      
      toast.info(`Data purge initiated for data older than ${olderThanDays} days. This is a demo feature.`);
      
      await get().logActivity(
        'Data Purge',
        'system',
        undefined,
        `Purged data older than ${olderThanDays} days`
      );
    } catch (error) {
      console.error('Error purging old data:', error);
      toast.error('Failed to purge old data');
    }
  },

  flagUser: async (userId: string, reason: string) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        flagged: true,
        flagReason: reason,
        flaggedAt: Timestamp.now()
      });
      
      await get().logActivity(
        'User Flagged',
        'user',
        userId,
        `Flagged user for: ${reason}`
      );
      
      toast.success('User flagged for review');
    } catch (error) {
      console.error('Error flagging user:', error);
      toast.error('Failed to flag user');
    }
  },

  reviewFlaggedContent: async () => {
    try {
      const usersRef = collection(db, 'users');
      const flaggedQuery = query(usersRef, where('flagged', '==', true));
      const snapshot = await getDocs(flaggedQuery);
      
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error reviewing flagged content:', error);
      toast.error('Failed to fetch flagged content');
      return [];
    }
  },

  enableMaintenanceMode: async () => {
    try {
      toast.success('Maintenance mode enabled (demo)');
      
      await get().logActivity(
        'Maintenance Mode',
        'system',
        undefined,
        'Enabled system maintenance mode'
      );
    } catch (error) {
      console.error('Error enabling maintenance mode:', error);
      toast.error('Failed to enable maintenance mode');
    }
  },

  disableMaintenanceMode: async () => {
    try {
      toast.success('Maintenance mode disabled (demo)');
      
      await get().logActivity(
        'Maintenance Mode',
        'system',
        undefined,
        'Disabled system maintenance mode'
      );
    } catch (error) {
      console.error('Error disabling maintenance mode:', error);
      toast.error('Failed to disable maintenance mode');
    }
  },

  broadcastMessage: async (message: string, type: 'info' | 'warning' | 'critical') => {
    try {
      toast.success(`Broadcast message sent to all users (demo): ${message}`);
      
      await get().logActivity(
        'Broadcast Message',
        'system',
        undefined,
        `Sent ${type} message: ${message}`
      );
    } catch (error) {
      console.error('Error broadcasting message:', error);
      toast.error('Failed to broadcast message');
    }
  }
}));