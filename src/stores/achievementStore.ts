import { create } from 'zustand';
import { 
  doc, collection, getDocs, setDoc, updateDoc, 
  query, where, orderBy, limit, Timestamp,
  arrayUnion
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import toast from 'react-hot-toast';

export type AchievementCategory = 'streak' | 'completion' | 'social' | 'special' | 'milestone';
export type AchievementRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  rarity: AchievementRarity;
  points: number;
  criteria: {
    type: 'streak' | 'total_habits' | 'completion_rate' | 'social_action' | 'special_event';
    value: number;
    comparison: 'gte' | 'eq' | 'lte';
  };
  unlockedAt?: Date;
  progress?: number;
}

export interface UserAchievement {
  achievementId: string;
  unlockedAt: Date;
  habitId?: string;
  metadata?: Record<string, any>;
}

export interface LeaderboardEntry {
  userId: string;
  displayName: string;
  totalPoints: number;
  achievementCount: number;
  level: number;
  rank?: number;
  avatar?: string;
}

export interface UserStats {
  totalPoints: number;
  level: number;
  currentLevelPoints: number;
  nextLevelPoints: number;
  achievementCount: number;
  streakRecord: number;
  habitsCompleted: number;
  perfectDays: number;
  badges: string[];
}

interface AchievementStore {
  achievements: Achievement[];
  userAchievements: UserAchievement[];
  userStats: UserStats;
  leaderboard: LeaderboardEntry[];
  availableAchievements: Achievement[];
  
  fetchAchievements: () => Promise<void>;
  fetchUserAchievements: (userId: string) => Promise<void>;
  checkAndUnlockAchievements: (userId: string, habitStats: any) => Promise<void>;
  unlockAchievement: (userId: string, achievementId: string, metadata?: any) => Promise<void>;
  fetchLeaderboard: (timeFrame: 'daily' | 'weekly' | 'monthly' | 'all-time') => Promise<void>;
  calculateUserLevel: (points: number) => { level: number; currentLevelPoints: number; nextLevelPoints: number };
  getUserStats: (userId: string) => Promise<void>;
}

// Predefined achievements
const ACHIEVEMENTS: Achievement[] = [
  // Streak Achievements
  {
    id: 'first-step',
    title: 'First Step',
    description: 'Complete your first habit',
    icon: '👣',
    category: 'streak',
    rarity: 'common',
    points: 10,
    criteria: { type: 'streak', value: 1, comparison: 'gte' }
  },
  {
    id: 'week-warrior',
    title: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: '🔥',
    category: 'streak',
    rarity: 'common',
    points: 50,
    criteria: { type: 'streak', value: 7, comparison: 'gte' }
  },
  {
    id: 'habit-hero',
    title: 'Habit Hero',
    description: 'Reach a 21-day streak',
    icon: '🦸',
    category: 'streak',
    rarity: 'rare',
    points: 150,
    criteria: { type: 'streak', value: 21, comparison: 'gte' }
  },
  {
    id: 'monthly-master',
    title: 'Monthly Master',
    description: 'Complete 30 consecutive days',
    icon: '👑',
    category: 'streak',
    rarity: 'epic',
    points: 300,
    criteria: { type: 'streak', value: 30, comparison: 'gte' }
  },
  {
    id: 'century-club',
    title: 'Century Club',
    description: 'Achieve a 100-day streak',
    icon: '💯',
    category: 'streak',
    rarity: 'legendary',
    points: 1000,
    criteria: { type: 'streak', value: 100, comparison: 'gte' }
  },
  
  // Completion Achievements
  {
    id: 'perfectionist',
    title: 'Perfectionist',
    description: 'Complete all habits in a day',
    icon: '✨',
    category: 'completion',
    rarity: 'common',
    points: 25,
    criteria: { type: 'completion_rate', value: 100, comparison: 'eq' }
  },
  {
    id: 'multi-tasker',
    title: 'Multi-Tasker',
    description: 'Manage 5 active habits',
    icon: '🎯',
    category: 'completion',
    rarity: 'rare',
    points: 100,
    criteria: { type: 'total_habits', value: 5, comparison: 'gte' }
  },
  {
    id: 'habit-juggler',
    title: 'Habit Juggler',
    description: 'Manage 10 active habits',
    icon: '🤹',
    category: 'completion',
    rarity: 'epic',
    points: 250,
    criteria: { type: 'total_habits', value: 10, comparison: 'gte' }
  },
  
  // Social Achievements
  {
    id: 'team-player',
    title: 'Team Player',
    description: 'Join your first challenge',
    icon: '👥',
    category: 'social',
    rarity: 'common',
    points: 30,
    criteria: { type: 'social_action', value: 1, comparison: 'gte' }
  },
  {
    id: 'accountability-ace',
    title: 'Accountability Ace',
    description: 'Find an accountability buddy',
    icon: '🤝',
    category: 'social',
    rarity: 'rare',
    points: 75,
    criteria: { type: 'social_action', value: 1, comparison: 'gte' }
  },
  {
    id: 'community-champion',
    title: 'Community Champion',
    description: 'Complete 3 community challenges',
    icon: '🏆',
    category: 'social',
    rarity: 'epic',
    points: 200,
    criteria: { type: 'social_action', value: 3, comparison: 'gte' }
  },
  
  // Special Achievements
  {
    id: 'early-bird',
    title: 'Early Bird',
    description: 'Complete habits before 6 AM',
    icon: '🌅',
    category: 'special',
    rarity: 'rare',
    points: 50,
    criteria: { type: 'special_event', value: 1, comparison: 'gte' }
  },
  {
    id: 'night-owl',
    title: 'Night Owl',
    description: 'Complete habits after 10 PM',
    icon: '🦉',
    category: 'special',
    rarity: 'rare',
    points: 50,
    criteria: { type: 'special_event', value: 1, comparison: 'gte' }
  },
  {
    id: 'weekend-warrior',
    title: 'Weekend Warrior',
    description: 'Perfect weekend completion',
    icon: '⚔️',
    category: 'special',
    rarity: 'common',
    points: 40,
    criteria: { type: 'special_event', value: 1, comparison: 'gte' }
  },
  {
    id: 'new-year-new-me',
    title: 'New Year, New Me',
    description: 'Start a habit on January 1st',
    icon: '🎊',
    category: 'special',
    rarity: 'epic',
    points: 100,
    criteria: { type: 'special_event', value: 1, comparison: 'gte' }
  }
];

export const useAchievementStore = create<AchievementStore>((set, get) => ({
  achievements: ACHIEVEMENTS,
  userAchievements: [],
  userStats: {
    totalPoints: 0,
    level: 1,
    currentLevelPoints: 0,
    nextLevelPoints: 100,
    achievementCount: 0,
    streakRecord: 0,
    habitsCompleted: 0,
    perfectDays: 0,
    badges: []
  },
  leaderboard: [],
  availableAchievements: [],

  fetchAchievements: async () => {
    // Achievements are predefined, but could be fetched from Firestore
    set({ achievements: ACHIEVEMENTS });
  },

  fetchUserAchievements: async (userId: string) => {
    try {
      const userAchievementsRef = collection(db, 'users', userId, 'achievements');
      const snapshot = await getDocs(userAchievementsRef);
      
      const userAchievements = snapshot.docs.map(doc => ({
        ...doc.data(),
        unlockedAt: doc.data().unlockedAt?.toDate()
      })) as UserAchievement[];
      
      set({ userAchievements });
    } catch (error) {
      console.error('Error fetching user achievements:', error);
    }
  },

  checkAndUnlockAchievements: async (userId: string, habitStats: any) => {
    const { achievements, userAchievements, unlockAchievement } = get();
    
    for (const achievement of achievements) {
      // Skip if already unlocked
      if (userAchievements.some(ua => ua.achievementId === achievement.id)) {
        continue;
      }
      
      let shouldUnlock = false;
      
      switch (achievement.criteria.type) {
        case 'streak':
          if (achievement.criteria.comparison === 'gte' && habitStats.maxStreak >= achievement.criteria.value) {
            shouldUnlock = true;
          }
          break;
          
        case 'total_habits':
          if (achievement.criteria.comparison === 'gte' && habitStats.totalHabits >= achievement.criteria.value) {
            shouldUnlock = true;
          }
          break;
          
        case 'completion_rate':
          if (achievement.criteria.comparison === 'eq' && habitStats.todayCompletionRate === achievement.criteria.value) {
            shouldUnlock = true;
          }
          break;
          
        case 'special_event':
          // Check for special conditions like time of day
          const hour = new Date().getHours();
          if (achievement.id === 'early-bird' && hour < 6) {
            shouldUnlock = true;
          } else if (achievement.id === 'night-owl' && hour >= 22) {
            shouldUnlock = true;
          }
          break;
      }
      
      if (shouldUnlock) {
        await unlockAchievement(userId, achievement.id);
      }
    }
  },

  unlockAchievement: async (userId: string, achievementId: string, metadata?: any) => {
    try {
      const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
      if (!achievement) return;
      
      const userAchievement: UserAchievement = {
        achievementId,
        unlockedAt: new Date(),
        metadata
      };
      
      // Save to Firestore
      await setDoc(
        doc(db, 'users', userId, 'achievements', achievementId),
        {
          ...userAchievement,
          unlockedAt: Timestamp.fromDate(userAchievement.unlockedAt)
        }
      );
      
      // Update user stats
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        totalPoints: arrayUnion(achievement.points),
        achievementCount: arrayUnion(1),
        badges: arrayUnion(achievement.icon)
      });
      
      // Update local state
      set(state => ({
        userAchievements: [...state.userAchievements, userAchievement],
        userStats: {
          ...state.userStats,
          totalPoints: state.userStats.totalPoints + achievement.points,
          achievementCount: state.userStats.achievementCount + 1,
          badges: [...state.userStats.badges, achievement.icon]
        }
      }));
      
      // Show celebration toast
      toast.success(
        `${achievement.icon} ${achievement.title} Unlocked! ${achievement.description} (+${achievement.points} points)`,
        { duration: 5000 }
      );
      
    } catch (error) {
      console.error('Error unlocking achievement:', error);
    }
  },

  fetchLeaderboard: async (timeFrame: 'daily' | 'weekly' | 'monthly' | 'all-time') => {
    try {
      // Calculate date range based on timeFrame
      const now = new Date();
      let startDate = new Date();
      
      switch (timeFrame) {
        case 'daily':
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'weekly':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'monthly':
          startDate.setMonth(now.getMonth() - 1);
          break;
        case 'all-time':
          startDate = new Date(0);
          break;
      }
      
      // Fetch top users
      const usersRef = collection(db, 'users');
      const q = query(
        usersRef,
        orderBy('totalPoints', 'desc'),
        limit(100)
      );
      
      const snapshot = await getDocs(q);
      const leaderboard = snapshot.docs.map((doc, index) => {
        const data = doc.data();
        const { level, currentLevelPoints, nextLevelPoints } = get().calculateUserLevel(data.totalPoints || 0);
        
        return {
          userId: doc.id,
          displayName: data.displayName || 'Anonymous',
          totalPoints: data.totalPoints || 0,
          achievementCount: data.achievementCount || 0,
          level,
          rank: index + 1,
          avatar: data.photoURL
        };
      });
      
      set({ leaderboard });
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
  },

  calculateUserLevel: (points: number) => {
    // Level formula: each level requires 100 * level points
    let level = 1;
    let totalRequired = 0;
    let currentLevelPoints = points;
    
    while (currentLevelPoints >= level * 100) {
      currentLevelPoints -= level * 100;
      totalRequired += level * 100;
      level++;
    }
    
    return {
      level,
      currentLevelPoints,
      nextLevelPoints: level * 100
    };
  },

  getUserStats: async (userId: string) => {
    try {
      const userRef = doc(db, 'users', userId);
      const habitsRef = collection(db, 'habits');
      const q = query(habitsRef, where('userId', '==', userId));
      
      const habitsSnapshot = await getDocs(q);
      let streakRecord = 0;
      let habitsCompleted = 0;
      
      habitsSnapshot.forEach(doc => {
        const habit = doc.data();
        streakRecord = Math.max(streakRecord, habit.currentStreak || 0);
        habitsCompleted += habit.totalCompletions || 0;
      });
      
      const userDoc = await getDocs(query(collection(db, 'users'), where('uid', '==', userId), limit(1)));
      const userData = userDoc.docs[0]?.data() || {};
      
      const totalPoints = userData.totalPoints || 0;
      const { level, currentLevelPoints, nextLevelPoints } = get().calculateUserLevel(totalPoints);
      
      set({
        userStats: {
          totalPoints,
          level,
          currentLevelPoints,
          nextLevelPoints,
          achievementCount: userData.achievementCount || 0,
          streakRecord,
          habitsCompleted,
          perfectDays: userData.perfectDays || 0,
          badges: userData.badges || []
        }
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  }
}));