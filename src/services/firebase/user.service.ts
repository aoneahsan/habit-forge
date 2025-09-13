import { doc, getDoc, setDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import type { User as FirebaseUser } from 'firebase/auth';
import { db } from '@/config/firebase.config';
import { APP_CONFIG } from '@/constants/app.constants';
import type { UserProfile } from '@/types/user.types';

const USERS_COLLECTION = `${APP_CONFIG.firebase.projectPrefix}users`;

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const userDoc = await getDoc(doc(db, USERS_COLLECTION, userId));
    
    if (userDoc.exists()) {
      const data = userDoc.data();
      return {
        ...data,
        id: userDoc.id,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as UserProfile;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
}

export async function createUserProfile(user: FirebaseUser): Promise<UserProfile> {
  try {
    const userRef = doc(db, USERS_COLLECTION, user.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      // Create new user profile
      const newProfile = {
        id: user.uid,
        email: user.email || '',
        displayName: user.displayName || user.email?.split('@')[0] || 'User',
        photoURL: user.photoURL || undefined,
        accountTier: 'free' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
        preferences: {
          theme: 'system' as const,
          notifications: {
            email: true,
            push: true,
            sms: false,
            reminderTime: '09:00',
            dailyDigest: true,
            weeklyReport: true,
            achievementAlerts: true,
            socialAlerts: true,
            reminders: true,
          },
          privacy: {
            profileVisibility: 'public' as const,
            shareProgress: true,
            allowFriendRequests: true,
            showInLeaderboard: true,
            showStats: true,
          },
          language: 'en',
          dateFormat: 'MM/DD/YYYY',
          timeFormat: '12h' as const,
          weekStartsOn: 0 as const,
        },
        stats: {
          totalHabits: 0,
          activeHabits: 0,
          completedHabits: 0,
          totalHabitsCompleted: 0,
          totalEntries: 0,
          currentStreak: 0,
          longestStreak: 0,
          totalAchievements: 0,
          joinedChallenges: 0,
          accountabilityPartners: 0,
          totalPoints: 0,
        },
        settings: {
          biometricAuth: false,
          twoFactorAuth: false,
          dataExportEnabled: true,
          analyticsEnabled: true,
          crashReportingEnabled: true,
        },
        subscription: {
          id: `sub_${user.uid}`,
          tier: 'free' as const,
          plan: 'free' as const,
          status: 'active' as const,
          startDate: new Date(),
          autoRenew: false,
        },
      } satisfies UserProfile;

      await setDoc(userRef, {
        ...newProfile,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return newProfile;
    } else {
      // Return existing profile
      const data = userDoc.data();
      return {
        ...data,
        id: userDoc.id,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as UserProfile;
    }
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
}

export async function updateUserProfile(
  userId: string,
  updates: Partial<UserProfile>
): Promise<void> {
  try {
    await updateDoc(doc(db, USERS_COLLECTION, userId), {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}

export async function deleteUserProfile(userId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, USERS_COLLECTION, userId));
  } catch (error) {
    console.error('Error deleting user profile:', error);
    throw error;
  }
}