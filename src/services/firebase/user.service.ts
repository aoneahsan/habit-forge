import { doc, getDoc, setDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { User as FirebaseUser } from 'firebase/auth';
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

export async function createUserProfile(data: {
  userId: string;
  email: string;
  displayName?: string;
  photoURL?: string;
}): Promise<boolean> {
  try {
    const userRef = doc(db, USERS_COLLECTION, data.userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      // Create new user profile
      const newProfile: Omit<UserProfile, 'id'> = {
        userId: data.userId,
        email: data.email,
        displayName: data.displayName || data.email.split('@')[0],
        photoURL: data.photoURL || null,
        bio: '',
        level: 1,
        experience: 0,
        stats: {
          totalHabits: 0,
          activeHabits: 0,
          completedHabits: 0,
          totalPoints: 0,
          currentStreak: 0,
          longestStreak: 0,
          totalHabitsCompleted: 0,
        },
        preferences: {
          theme: 'system',
          notifications: {
            email: true,
            push: true,
            reminders: true,
          },
          privacy: {
            profileVisibility: 'public',
            showStats: true,
            showAchievements: true,
          },
        },
        achievements: [],
        subscription: {
          plan: 'free',
          status: 'active',
          startDate: new Date(),
          endDate: null,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await setDoc(userRef, {
        ...newProfile,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return false; // New profile created
    } else {
      // Update existing profile if needed
      await updateDoc(userRef, {
        displayName: data.displayName || userDoc.data().displayName,
        photoURL: data.photoURL || userDoc.data().photoURL,
        updatedAt: serverTimestamp(),
      });
      return true; // Profile already existed
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