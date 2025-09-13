import {
  collection,
  doc,
  setDoc,
  updateDoc,
  getDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/config/firebase.config';
import { APP_CONFIG } from '@/constants/app.constants';

const ACHIEVEMENTS_COLLECTION = `${APP_CONFIG.firebase.projectPrefix}achievements`;
const USER_ACHIEVEMENTS_COLLECTION = `${APP_CONFIG.firebase.projectPrefix}user_achievements`;

export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: 'streak' | 'completion' | 'social' | 'special';
  requirement: number;
  points: number;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface UserAchievement {
  achievementId: string;
  userId: string;
  unlockedAt: Date;
  progress: number;
  completed: boolean;
}

// Get all available achievements
export async function getAchievements(): Promise<Achievement[]> {
  try {
    const snapshot = await getDocs(collection(db, ACHIEVEMENTS_COLLECTION));
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as Achievement));
  } catch (error) {
    console.error('Error fetching achievements:', error);
    throw new Error('Failed to fetch achievements');
  }
}

// Get user's achievements
export async function getUserAchievements(userId: string): Promise<UserAchievement[]> {
  try {
    const q = query(
      collection(db, USER_ACHIEVEMENTS_COLLECTION),
      where('userId', '==', userId)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      ...doc.data(),
      unlockedAt: doc.data().unlockedAt?.toDate() || new Date(),
    } as UserAchievement));
  } catch (error) {
    console.error('Error fetching user achievements:', error);
    throw new Error('Failed to fetch user achievements');
  }
}

// Check and unlock achievements based on user stats
export async function checkAchievements(userId: string, stats: any) {
  try {
    const achievements = await getAchievements();
    const userAchievements = await getUserAchievements(userId);
    const unlockedIds = userAchievements.filter(ua => ua.completed).map(ua => ua.achievementId);
    
    const newlyUnlocked: Achievement[] = [];
    
    for (const achievement of achievements) {
      if (unlockedIds.includes(achievement.id)) continue;
      
      let shouldUnlock = false;
      let currentProgress = 0;
      
      switch (achievement.category) {
        case 'streak':
          currentProgress = stats.currentStreak || 0;
          shouldUnlock = currentProgress >= achievement.requirement;
          break;
          
        case 'completion':
          currentProgress = stats.totalHabitsCompleted || 0;
          shouldUnlock = currentProgress >= achievement.requirement;
          break;
          
        case 'social':
          // Check based on social stats
          if (achievement.id === 'social-friend') {
            currentProgress = stats.friendCount || 0;
          } else if (achievement.id === 'social-challenge') {
            currentProgress = stats.joinedChallenges || 0;
          }
          shouldUnlock = currentProgress >= achievement.requirement;
          break;
          
        case 'special':
          // Special achievements have custom logic
          // These would need specific tracking
          break;
      }
      
      if (shouldUnlock) {
        await unlockAchievement(userId, achievement.id);
        newlyUnlocked.push(achievement);
      } else {
        // Update progress if not yet unlocked
        await updateAchievementProgress(userId, achievement.id, currentProgress);
      }
    }
    
    return newlyUnlocked;
  } catch (error) {
    console.error('Error checking achievements:', error);
    throw new Error('Failed to check achievements');
  }
}

// Unlock an achievement for a user
export async function unlockAchievement(userId: string, achievementId: string) {
  try {
    const docId = `${userId}_${achievementId}`;
    const achievementRef = doc(db, USER_ACHIEVEMENTS_COLLECTION, docId);
    
    await setDoc(achievementRef, {
      userId,
      achievementId,
      unlockedAt: serverTimestamp(),
      completed: true,
      progress: 100,
    }, { merge: true });
    
    // Update user's total points
    const achievement = await getDoc(doc(db, ACHIEVEMENTS_COLLECTION, achievementId));
    if (achievement.exists()) {
      const points = achievement.data().points || 0;
      await updateUserPoints(userId, points);
    }
    
    return true;
  } catch (error) {
    console.error('Error unlocking achievement:', error);
    throw new Error('Failed to unlock achievement');
  }
}

// Update achievement progress
export async function updateAchievementProgress(
  userId: string,
  achievementId: string,
  progress: number
) {
  try {
    const docId = `${userId}_${achievementId}`;
    const achievementRef = doc(db, USER_ACHIEVEMENTS_COLLECTION, docId);
    
    await setDoc(achievementRef, {
      userId,
      achievementId,
      progress,
      completed: false,
      updatedAt: serverTimestamp(),
    }, { merge: true });
    
    return true;
  } catch (error) {
    console.error('Error updating achievement progress:', error);
    throw new Error('Failed to update achievement progress');
  }
}

// Update user's total points
async function updateUserPoints(userId: string, points: number) {
  try {
    const userRef = doc(db, `${APP_CONFIG.firebase.projectPrefix}users`, userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const currentPoints = userDoc.data().stats?.totalPoints || 0;
      await updateDoc(userRef, {
        'stats.totalPoints': currentPoints + points,
        'stats.totalAchievements': (userDoc.data().stats?.totalAchievements || 0) + 1,
      });
    }
  } catch (error) {
    console.error('Error updating user points:', error);
  }
}

// Initialize default achievements (run once during setup)
export async function initializeAchievements() {
  const defaultAchievements: Omit<Achievement, 'id'>[] = [
    // Streak achievements
    {
      name: 'Week Warrior',
      description: 'Maintain a 7-day streak',
      category: 'streak',
      requirement: 7,
      points: 50,
      icon: 'calendar',
      rarity: 'common',
    },
    {
      name: 'Monthly Master',
      description: 'Maintain a 30-day streak',
      category: 'streak',
      requirement: 30,
      points: 200,
      icon: 'calendar',
      rarity: 'rare',
    },
    {
      name: 'Century Champion',
      description: 'Maintain a 100-day streak',
      category: 'streak',
      requirement: 100,
      points: 500,
      icon: 'trending-up',
      rarity: 'epic',
    },
    {
      name: 'Year of Discipline',
      description: 'Maintain a 365-day streak',
      category: 'streak',
      requirement: 365,
      points: 1000,
      icon: 'star',
      rarity: 'legendary',
    },
    // Completion achievements
    {
      name: 'Getting Started',
      description: 'Complete 10 habits',
      category: 'completion',
      requirement: 10,
      points: 30,
      icon: 'target',
      rarity: 'common',
    },
    {
      name: 'Habit Builder',
      description: 'Complete 100 habits',
      category: 'completion',
      requirement: 100,
      points: 150,
      icon: 'target',
      rarity: 'rare',
    },
    {
      name: 'Habit Master',
      description: 'Complete 1000 habits',
      category: 'completion',
      requirement: 1000,
      points: 500,
      icon: 'award',
      rarity: 'epic',
    },
    // Social achievements
    {
      name: 'Social Butterfly',
      description: 'Add 5 friends',
      category: 'social',
      requirement: 5,
      points: 50,
      icon: 'users',
      rarity: 'common',
    },
    {
      name: 'Challenge Accepted',
      description: 'Join 3 challenges',
      category: 'social',
      requirement: 3,
      points: 75,
      icon: 'zap',
      rarity: 'common',
    },
  ];
  
  try {
    for (const achievement of defaultAchievements) {
      const docRef = doc(collection(db, ACHIEVEMENTS_COLLECTION));
      await setDoc(docRef, achievement);
    }
    console.log('Achievements initialized successfully');
  } catch (error) {
    console.error('Error initializing achievements:', error);
  }
}