import { create } from 'zustand';
import { 
  doc, collection, getDocs, setDoc, updateDoc, deleteDoc,
  query, where, orderBy, limit, Timestamp, onSnapshot
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import toast from 'react-hot-toast';

export type NotificationType = 'reminder' | 'achievement' | 'social' | 'system' | 'challenge';
export type NotificationPriority = 'low' | 'medium' | 'high';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  icon?: string;
  actionUrl?: string;
  actionLabel?: string;
  read: boolean;
  createdAt: Date;
  scheduledFor?: Date;
  metadata?: Record<string, any>;
}

export interface ReminderConfig {
  id: string;
  habitId: string;
  userId: string;
  enabled: boolean;
  time: string; // HH:MM format
  days: number[]; // 0-6, where 0 is Sunday
  message?: string;
  notificationMethod: 'push' | 'email' | 'both';
}

export interface NotificationPreferences {
  pushEnabled: boolean;
  emailEnabled: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  reminderTime: string; // Default reminder time
  dailyDigest: boolean;
  weeklyReport: boolean;
  achievementAlerts: boolean;
  socialAlerts: boolean;
  challengeAlerts: boolean;
  quietHours: {
    enabled: boolean;
    start: string; // HH:MM
    end: string; // HH:MM
  };
}

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  reminders: ReminderConfig[];
  preferences: NotificationPreferences;
  
  fetchNotifications: (userId: string) => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: (userId: string) => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  clearAllNotifications: (userId: string) => Promise<void>;
  
  createNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => Promise<void>;
  scheduleReminder: (reminder: ReminderConfig) => Promise<void>;
  updateReminder: (reminderId: string, updates: Partial<ReminderConfig>) => Promise<void>;
  deleteReminder: (reminderId: string) => Promise<void>;
  
  updatePreferences: (userId: string, preferences: Partial<NotificationPreferences>) => Promise<void>;
  fetchPreferences: (userId: string) => Promise<void>;
  
  subscribeToNotifications: (userId: string, callback: (notifications: Notification[]) => void) => () => void;
  checkAndSendReminders: (userId: string) => Promise<void>;
  requestNotificationPermission: () => Promise<boolean>;
}

const defaultPreferences: NotificationPreferences = {
  pushEnabled: true,
  emailEnabled: true,
  soundEnabled: true,
  vibrationEnabled: true,
  reminderTime: '09:00',
  dailyDigest: true,
  weeklyReport: true,
  achievementAlerts: true,
  socialAlerts: true,
  challengeAlerts: true,
  quietHours: {
    enabled: false,
    start: '22:00',
    end: '07:00'
  }
};

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  reminders: [],
  preferences: defaultPreferences,

  fetchNotifications: async (userId: string) => {
    try {
      const notificationsRef = collection(db, 'notifications');
      const q = query(
        notificationsRef,
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(50)
      );
      
      const snapshot = await getDocs(q);
      const notifications = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        scheduledFor: doc.data().scheduledFor?.toDate()
      })) as Notification[];
      
      const unreadCount = notifications.filter(n => !n.read).length;
      
      set({ notifications, unreadCount });
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  },

  markAsRead: async (notificationId: string) => {
    try {
      await updateDoc(doc(db, 'notifications', notificationId), {
        read: true
      });
      
      set(state => ({
        notifications: state.notifications.map(n =>
          n.id === notificationId ? { ...n, read: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1)
      }));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  },

  markAllAsRead: async (userId: string) => {
    try {
      const batch = get().notifications
        .filter(n => !n.read && n.userId === userId)
        .map(n => updateDoc(doc(db, 'notifications', n.id), { read: true }));
      
      await Promise.all(batch);
      
      set(state => ({
        notifications: state.notifications.map(n => ({ ...n, read: true })),
        unreadCount: 0
      }));
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  },

  deleteNotification: async (notificationId: string) => {
    try {
      await deleteDoc(doc(db, 'notifications', notificationId));
      
      set(state => ({
        notifications: state.notifications.filter(n => n.id !== notificationId),
        unreadCount: state.notifications.find(n => n.id === notificationId && !n.read) 
          ? state.unreadCount - 1 
          : state.unreadCount
      }));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  },

  clearAllNotifications: async (userId: string) => {
    try {
      const batch = get().notifications
        .filter(n => n.userId === userId)
        .map(n => deleteDoc(doc(db, 'notifications', n.id)));
      
      await Promise.all(batch);
      
      set({ notifications: [], unreadCount: 0 });
      toast.success('All notifications cleared');
    } catch (error) {
      console.error('Error clearing notifications:', error);
      toast.error('Failed to clear notifications');
    }
  },

  createNotification: async (notification: Omit<Notification, 'id' | 'createdAt'>) => {
    try {
      const newNotification = {
        ...notification,
        createdAt: Timestamp.now(),
        read: false
      };
      
      const docRef = await setDoc(
        doc(collection(db, 'notifications')),
        newNotification
      );
      
      // Show immediate toast if high priority
      if (notification.priority === 'high') {
        toast(
          `${notification.icon || '🔔'} ${notification.title}: ${notification.message}`,
          { duration: 5000 }
        );
      }
      
      // Update local state
      set(state => ({
        notifications: [
          {
            id: docRef.id,
            ...notification,
            createdAt: new Date(),
            read: false
          },
          ...state.notifications
        ],
        unreadCount: state.unreadCount + 1
      }));
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  },

  scheduleReminder: async (reminder: ReminderConfig) => {
    try {
      await setDoc(
        doc(db, 'reminders', reminder.id),
        {
          ...reminder,
          createdAt: Timestamp.now()
        }
      );
      
      set(state => ({
        reminders: [...state.reminders, reminder]
      }));
      
      toast.success('Reminder scheduled successfully');
    } catch (error) {
      console.error('Error scheduling reminder:', error);
      toast.error('Failed to schedule reminder');
    }
  },

  updateReminder: async (reminderId: string, updates: Partial<ReminderConfig>) => {
    try {
      await updateDoc(doc(db, 'reminders', reminderId), updates);
      
      set(state => ({
        reminders: state.reminders.map(r =>
          r.id === reminderId ? { ...r, ...updates } : r
        )
      }));
      
      toast.success('Reminder updated');
    } catch (error) {
      console.error('Error updating reminder:', error);
      toast.error('Failed to update reminder');
    }
  },

  deleteReminder: async (reminderId: string) => {
    try {
      await deleteDoc(doc(db, 'reminders', reminderId));
      
      set(state => ({
        reminders: state.reminders.filter(r => r.id !== reminderId)
      }));
      
      toast.success('Reminder deleted');
    } catch (error) {
      console.error('Error deleting reminder:', error);
      toast.error('Failed to delete reminder');
    }
  },

  updatePreferences: async (userId: string, preferences: Partial<NotificationPreferences>) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        notificationPreferences: preferences
      });
      
      set(state => ({
        preferences: { ...state.preferences, ...preferences }
      }));
      
      toast.success('Notification preferences updated');
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast.error('Failed to update preferences');
    }
  },

  fetchPreferences: async (userId: string) => {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDocs(query(collection(db, 'users'), where('uid', '==', userId), limit(1)));
      
      if (!userDoc.empty) {
        const prefs = userDoc.docs[0].data().notificationPreferences || defaultPreferences;
        set({ preferences: prefs });
      }
    } catch (error) {
      console.error('Error fetching preferences:', error);
    }
  },

  subscribeToNotifications: (userId: string, callback: (notifications: Notification[]) => void) => {
    const notificationsRef = collection(db, 'notifications');
    const q = query(
      notificationsRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(50)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifications = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        scheduledFor: doc.data().scheduledFor?.toDate()
      })) as Notification[];
      
      const unreadCount = notifications.filter(n => !n.read).length;
      
      set({ notifications, unreadCount });
      callback(notifications);
    });
    
    return unsubscribe;
  },

  checkAndSendReminders: async (userId: string) => {
    const { reminders, preferences, createNotification } = get();
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const currentDay = now.getDay();
    
    // Check if we're in quiet hours
    if (preferences.quietHours.enabled) {
      const { start, end } = preferences.quietHours;
      if (currentTime >= start || currentTime <= end) {
        return; // Don't send notifications during quiet hours
      }
    }
    
    // Check each reminder
    for (const reminder of reminders) {
      if (reminder.enabled && 
          reminder.days.includes(currentDay) && 
          reminder.time === currentTime) {
        
        await createNotification({
          userId,
          type: 'reminder',
          priority: 'medium',
          title: '⏰ Habit Reminder',
          message: reminder.message || 'Time to complete your habit!',
          icon: '🔔',
          actionUrl: `/habits/${reminder.habitId}`,
          actionLabel: 'Complete Now',
          read: false,
          metadata: {
            habitId: reminder.habitId,
            reminderId: reminder.id
          }
        });
      }
    }
  },

  requestNotificationPermission: async () => {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return false;
    }
    
    if (Notification.permission === 'granted') {
      return true;
    }
    
    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        toast.success('Notifications enabled! You\'ll receive reminders for your habits.');
        return true;
      }
    }
    
    toast.error('Please enable notifications in your browser settings to receive reminders.');
    return false;
  }
}));