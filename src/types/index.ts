// User Types
export interface User {
  id: string;
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  accountType: 'free' | 'premium';
  subscriptionTier?: 'free' | 'premium';
  status?: 'active' | 'suspended';
  isAdmin?: boolean;
  createdAt: Date;
  lastLoginAt: Date;
  lastActive?: Date;
  subscription?: SubscriptionDetails;
  preferences: UserPreferences;
  stats: UserStats;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notificationStyle: 'gentle' | 'moderate' | 'assertive';
  reminderFrequency: 'minimal' | 'normal' | 'frequent';
  privacyLevel: 'private' | 'friends' | 'public';
  aiCoachingEnabled: boolean;
  timezone: string;
  language: string;
}

export interface UserStats {
  totalHabits: number;
  activeHabits: number;
  completedHabits: number;
  currentStreak: number;
  longestStreak: number;
  totalEntries: number;
  achievements: Achievement[];
}

export interface SubscriptionDetails {
  plan: 'free' | 'monthly' | 'yearly' | 'lifetime';
  status: 'active' | 'canceled' | 'expired' | 'past_due';
  startDate: Date;
  endDate?: Date;
  nextBillingDate?: Date;
  paymentMethod?: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
}

// Habit Types
export interface Habit {
  id: string;
  userId: string;
  title: string;
  category: HabitCategory;
  type: 'build' | 'break';
  description: string;
  goal: string;
  frequency: FrequencyConfig;
  duration: number; // target days
  startDate: Date;
  endDate?: Date;
  status: 'active' | 'paused' | 'completed' | 'abandoned';
  strength: number;
  currentStreak: number;
  longestStreak: number;
  completionRate: number;
  reminders: ReminderConfig[];
  milestones: Milestone[];
  ropeVisualization: RopeState;
  difficulty: 'easy' | 'medium' | 'hard';
  motivation: string;
  successCriteria: string;
  accountability: 'private' | 'friends' | 'public';
  createdAt: Date;
  updatedAt: Date;
  
  // Additional tracking properties
  completedToday?: boolean;
  totalCompletions?: number;
  lastCompletedDate?: Date;
  lastEntry?: FiveFactors;
}

export type HabitCategory = 
  | 'health'
  | 'productivity'
  | 'learning'
  | 'relationships'
  | 'finance'
  | 'wellness'
  | 'fitness'
  | 'mindfulness'
  | 'creativity'
  | 'custom';

export interface FrequencyConfig {
  type: 'daily' | 'weekly' | 'custom';
  daysPerWeek?: number;
  specificDays?: number[]; // 0-6 for Sunday-Saturday
  timesPerDay?: number;
}

export interface ReminderConfig {
  id: string;
  enabled: boolean;
  time: string; // HH:mm format
  type: 'time-based' | 'location-based' | 'smart';
  location?: LocationData;
  message?: string;
  sound?: string;
}

export interface Milestone {
  days: number;
  achieved: boolean;
  achievedAt?: Date;
  badge?: string;
  reward?: string;
}

export interface RopeState {
  thickness: number; // 0-100
  material: 'thread' | 'string' | 'cord' | 'rope' | 'cable';
  color: string;
  glowIntensity: number; // 0-100
  strands: number;
  effects: string[];
}

// Tracking Entry Types
export interface TrackingEntry {
  id: string;
  habitId: string;
  userId: string;
  timestamp: Date;
  fiveFactors: FiveFactors;
  additionalData: AdditionalTrackingData;
  completionStatus: 'full' | 'partial' | 'missed';
  automated: boolean;
  modified: boolean;
  notes?: string;
  photos?: string[];
}

export interface FiveFactors {
  location: LocationData;
  emotionalState: EmotionData;
  otherPeople: PersonData[];
  time: Date;
  precedingAction: string;
  userId?: string; // Optional for backwards compatibility
  notes?: string;
  emotion?: string;
  duration?: number;
}

export interface LocationData {
  type: 'home' | 'work' | 'gym' | 'outdoor' | 'other';
  name?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  address?: string;
}

export interface EmotionData {
  primary: string;
  secondary?: string;
  intensity: number; // 1-10
  energy: 'low' | 'medium' | 'high';
  stress: 'relaxed' | 'normal' | 'stressed' | 'overwhelmed';
}

export interface PersonData {
  name?: string;
  relationship: 'family' | 'friend' | 'colleague' | 'stranger' | 'alone';
  influence: 'positive' | 'neutral' | 'negative';
}

export interface AdditionalTrackingData {
  intensity?: number; // 1-10
  duration?: number; // minutes
  difficulty?: 'easier' | 'normal' | 'harder';
  temptationLevel?: number; // 1-10 for breaking habits
  alternativeAction?: string; // for breaking habits
  cravingIntensity?: number; // 1-10
}

// Achievement Types
export interface Achievement {
  id: string;
  type: 'milestone' | 'special' | 'challenge' | 'community';
  name: string;
  description: string;
  icon: string;
  earnedAt: Date;
  habitId?: string;
  points: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

// Analytics Types
export interface HabitAnalytics {
  habitId: string;
  patterns: Pattern[];
  insights: Insight[];
  predictions: Prediction[];
  correlations: Correlation[];
  triggers: Trigger[];
  successFactors: string[];
  riskFactors: string[];
}

export interface Pattern {
  type: string;
  description: string;
  confidence: number;
  occurrences: number;
  lastSeen: Date;
}

export interface Insight {
  id: string;
  type: 'success' | 'warning' | 'tip' | 'discovery';
  title: string;
  description: string;
  actionable: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
}

export interface Prediction {
  date: Date;
  successProbability: number;
  factors: string[];
  recommendations: string[];
}

export interface Correlation {
  habitId1: string;
  habitId2: string;
  strength: number; // -1 to 1
  type: 'positive' | 'negative' | 'neutral';
}

export interface Trigger {
  type: 'location' | 'time' | 'emotion' | 'person' | 'action';
  value: string;
  frequency: number;
  successRate: number;
}

// Challenge Types
export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: HabitCategory;
  duration: number; // days
  startDate: Date;
  endDate: Date;
  participants: string[];
  creatorId: string;
  type: 'official' | 'community' | 'private';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  rewards: ChallengeReward[];
  leaderboard: LeaderboardEntry[];
  requirements: string[];
  status: 'upcoming' | 'active' | 'completed';
}

export interface ChallengeReward {
  type: 'badge' | 'points' | 'premium_time' | 'custom';
  value: string | number;
  description: string;
  icon?: string;
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  score: number;
  rank: number;
  completionRate: number;
  streakDays: number;
}

// Notification Types
export interface NotificationConfig {
  id: string;
  userId: string;
  type: 'reminder' | 'motivation' | 'achievement' | 'warning' | 'system';
  enabled: boolean;
  schedule?: {
    time?: string;
    frequency?: 'daily' | 'weekly' | 'custom';
    days?: number[];
  };
  content: {
    title: string;
    body: string;
    icon?: string;
    action?: string;
  };
  channels: ('push' | 'email' | 'in-app')[];
}

// Admin Configuration Types
export interface SystemConfig {
  accountTiers: {
    [key: string]: TierConfig;
  };
  featureFlags: {
    [key: string]: boolean | FeatureFlag;
  };
  pricing: PricingConfig;
  limits: LimitConfig;
  content: ContentConfig;
}

export interface TierConfig {
  limits: {
    habits: {
      maxActive: number;
      maxTotal: number;
      canCreate: boolean;
      canDelete: boolean;
      canArchive: boolean;
    };
    entries: {
      maxPerHabitMonthly: number;
      maxPerHabitDaily: number;
      maxTotalMonthly: number;
      canBackdate: boolean;
      backdateDaysLimit: number;
    };
    ai: {
      basicInsights: boolean;
      patternRecognition: boolean;
      predictiveAnalytics: boolean;
      smartCoaching: boolean;
      dailyRequests: number;
    };
    visualizations: {
      basicRope: boolean;
      animatedEffects: boolean;
      materialProgression: boolean;
      customColors: boolean;
      advancedCharts: boolean;
    };
    notifications: {
      basicReminders: boolean;
      smartScheduling: boolean;
      locationBased: boolean;
      maxDaily: number;
    };
    storage: {
      maxStorageMB: number;
      cloudBackup: boolean;
      offlineDays: number;
    };
  };
  features: string[];
  uiConfig: {
    showUpgradePrompts: boolean;
    upgradePromptFrequencyDays: number;
    showLockedFeatures: boolean;
    themeOptions: string[];
  };
}

export interface FeatureFlag {
  enabled: boolean;
  rolloutPercentage?: number;
  whitelistUsers?: string[];
  blacklistUsers?: string[];
  startDate?: Date;
  endDate?: Date;
}

export interface PricingConfig {
  plans: {
    [key: string]: {
      price: number;
      currency: string;
      stripePriceId: string;
      trialDays: number;
      active: boolean;
      features?: string[];
    };
  };
  discounts: {
    [key: string]: {
      percentage: number;
      code?: string;
      validUntil?: Date;
      maxUses?: number;
      active: boolean;
    };
  };
}

export interface LimitConfig {
  rateLimiting: {
    apiCallsPerMinute: number;
    apiCallsPerHour: number;
    uploadsPerDay: number;
  };
  security: {
    maxLoginAttempts: number;
    lockoutDurationMinutes: number;
    sessionTimeoutHours: number;
    requireStrongPassword: boolean;
    minPasswordLength: number;
  };
}

export interface ContentConfig {
  motivationalQuotes: {
    enabled: boolean;
    dailyCount: number;
    categories: string[];
    languages: string[];
  };
  challenges: {
    weeklyEnabled: boolean;
    monthlyEnabled: boolean;
    userCreatedAllowed: boolean;
  };
}

// Additional types that were missing
export type FiveFactor = keyof FiveFactors;

export interface RopeVisualization {
  thickness: number;
  material: string;
  color: string;
  glowIntensity: number;
  strands: number;
  effects: string[];
}