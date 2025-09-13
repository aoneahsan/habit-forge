export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  accountTier: 'free' | 'premium' | 'pro' | 'enterprise';
  createdAt: Date;
  updatedAt: Date;
  
  // Profile details
  bio?: string;
  timezone?: string;
  locale?: string;
  phoneNumber?: string;
  
  // Preferences
  preferences: UserPreferences;
  
  // Stats
  stats: UserStats;
  
  // Subscription
  subscription?: Subscription;
  
  // Settings
  settings: UserSettings;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: NotificationPreferences;
  privacy: PrivacySettings;
  language: string;
  dateFormat: string;
  timeFormat: '12h' | '24h';
  weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
  reminderTime: string;
  dailyDigest: boolean;
  weeklyReport: boolean;
  achievementAlerts: boolean;
  socialAlerts: boolean;
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'friends' | 'private';
  shareProgress: boolean;
  allowFriendRequests: boolean;
  showInLeaderboard: boolean;
}

export interface UserStats {
  totalHabits: number;
  activeHabits: number;
  completedHabits: number;
  totalEntries: number;
  currentStreak: number;
  longestStreak: number;
  totalAchievements: number;
  joinedChallenges: number;
  accountabilityPartners: number;
}

export interface Subscription {
  id: string;
  tier: 'free' | 'premium' | 'pro' | 'enterprise';
  status: 'active' | 'cancelled' | 'expired' | 'trial';
  startDate: Date;
  endDate?: Date;
  trialEndDate?: Date;
  paymentMethod?: string;
  autoRenew: boolean;
}

export interface UserSettings {
  biometricAuth: boolean;
  twoFactorAuth: boolean;
  dataExportEnabled: boolean;
  analyticsEnabled: boolean;
  crashReportingEnabled: boolean;
}