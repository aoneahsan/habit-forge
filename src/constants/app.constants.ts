// App Configuration Constants
export const APP_CONFIG = {
  name: 'HabitForge',
  version: '0.0.1',
  description: 'Transform Your Life One Habit at a Time',
  firebase: {
    projectPrefix: 'hf2024_', // Prefix for all Firebase collections and storage
  },
  support: {
    email: 'support@habitforge.app',
    website: 'https://habitforge.app',
  },
} as const;

// Feature Flags (dynamically controlled via Firebase)
export const FEATURE_FLAGS = {
  enableAIInsights: true,
  enableSocialFeatures: true,
  enablePremiumFeatures: true,
  enableOfflineMode: true,
  enableBiometricAuth: true,
  enablePushNotifications: true,
  enableAnalytics: true,
  enableCrashReporting: true,
} as const;

// Account Tiers
export const ACCOUNT_TIERS = {
  FREE: 'free',
  PREMIUM: 'premium',
  PRO: 'pro',
  ENTERPRISE: 'enterprise',
} as const;

// Default Limits (can be overridden by Firebase config)
export const DEFAULT_LIMITS = {
  free: {
    maxHabits: 3,
    maxDailyEntries: 10,
    analyticsHistoryDays: 30,
    maxAccountabilityPartners: 1,
    maxChallenges: 1,
    exportEnabled: false,
    aiInsightsEnabled: false,
    advancedVisualizationsEnabled: false,
  },
  premium: {
    maxHabits: 10,
    maxDailyEntries: 50,
    analyticsHistoryDays: 90,
    maxAccountabilityPartners: 3,
    maxChallenges: 5,
    exportEnabled: true,
    aiInsightsEnabled: true,
    advancedVisualizationsEnabled: true,
  },
  pro: {
    maxHabits: -1, // Unlimited
    maxDailyEntries: -1,
    analyticsHistoryDays: 365,
    maxAccountabilityPartners: 10,
    maxChallenges: -1,
    exportEnabled: true,
    aiInsightsEnabled: true,
    advancedVisualizationsEnabled: true,
  },
} as const;

// Habit Categories
export const HABIT_CATEGORIES = {
  HEALTH: { id: 'health', label: 'Health & Fitness', icon: 'Heart', color: '#ef4444' },
  PRODUCTIVITY: { id: 'productivity', label: 'Productivity', icon: 'Target', color: '#3b82f6' },
  LEARNING: { id: 'learning', label: 'Learning', icon: 'BookOpen', color: '#8b5cf6' },
  MINDFULNESS: { id: 'mindfulness', label: 'Mindfulness', icon: 'Brain', color: '#10b981' },
  SOCIAL: { id: 'social', label: 'Social', icon: 'Users', color: '#f59e0b' },
  FINANCE: { id: 'finance', label: 'Finance', icon: 'DollarSign', color: '#06b6d4' },
  CREATIVITY: { id: 'creativity', label: 'Creativity', icon: 'Palette', color: '#ec4899' },
  CUSTOM: { id: 'custom', label: 'Custom', icon: 'Settings', color: '#6b7280' },
} as const;

// Habit Types
export const HABIT_TYPES = {
  BUILD: 'build', // Building a new habit
  BREAK: 'break', // Breaking a bad habit
  MAINTAIN: 'maintain', // Maintaining an existing habit
} as const;

// Tracking Frequencies
export const TRACKING_FREQUENCIES = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  CUSTOM: 'custom',
} as const;

// Five Factor Model (from "The Power of Habit")
export const FIVE_FACTORS = {
  LOCATION: 'location',
  TIME: 'time',
  EMOTIONAL_STATE: 'emotionalState',
  OTHER_PEOPLE: 'otherPeople',
  PRECEDING_ACTION: 'precedingAction',
} as const;

// Emotions for tracking
export const EMOTIONS = {
  HAPPY: { id: 'happy', label: 'Happy', emoji: '😊' },
  SAD: { id: 'sad', label: 'Sad', emoji: '😢' },
  ANGRY: { id: 'angry', label: 'Angry', emoji: '😠' },
  ANXIOUS: { id: 'anxious', label: 'Anxious', emoji: '😰' },
  EXCITED: { id: 'excited', label: 'Excited', emoji: '🤗' },
  CALM: { id: 'calm', label: 'Calm', emoji: '😌' },
  TIRED: { id: 'tired', label: 'Tired', emoji: '😴' },
  ENERGETIC: { id: 'energetic', label: 'Energetic', emoji: '💪' },
  STRESSED: { id: 'stressed', label: 'Stressed', emoji: '😫' },
  MOTIVATED: { id: 'motivated', label: 'Motivated', emoji: '🔥' },
  NEUTRAL: { id: 'neutral', label: 'Neutral', emoji: '😐' },
} as const;

// Achievement Types
export const ACHIEVEMENT_TYPES = {
  STREAK: 'streak',
  MILESTONE: 'milestone',
  CHALLENGE: 'challenge',
  SOCIAL: 'social',
  SPECIAL: 'special',
} as const;

// Notification Types
export const NOTIFICATION_TYPES = {
  REMINDER: 'reminder',
  ACHIEVEMENT: 'achievement',
  SOCIAL: 'social',
  SYSTEM: 'system',
  MOTIVATIONAL: 'motivational',
} as const;

// Storage Keys for local persistence
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'hf_auth_token',
  USER_PREFERENCES: 'hf_user_preferences',
  OFFLINE_QUEUE: 'hf_offline_queue',
  DRAFT_HABITS: 'hf_draft_habits',
  LAST_SYNC: 'hf_last_sync',
  THEME: 'hf_theme',
  LOCALE: 'hf_locale',
} as const;

// API Endpoints (if using custom backend)
export const API_ENDPOINTS = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://api.habitforge.app',
  AUTH: '/auth',
  USERS: '/users',
  HABITS: '/habits',
  ENTRIES: '/entries',
  ANALYTICS: '/analytics',
  ACHIEVEMENTS: '/achievements',
  SOCIAL: '/social',
  ADMIN: '/admin',
} as const;

// Time Constants
export const TIME_CONSTANTS = {
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  SYNC_INTERVAL: 5 * 60 * 1000, // 5 minutes
  CACHE_DURATION: 60 * 60 * 1000, // 1 hour
  NOTIFICATION_DELAY: 3000, // 3 seconds
  ANIMATION_DURATION: 300, // 300ms
} as const;

// Regex Patterns
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  USERNAME: /^[a-zA-Z0-9_]{3,20}$/,
  PHONE: /^\+?[\d\s-()]+$/,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  GENERIC: 'Something went wrong. Please try again.',
  NETWORK: 'Network error. Please check your connection.',
  AUTH_FAILED: 'Authentication failed. Please login again.',
  PERMISSION_DENIED: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_FAILED: 'Please check your input and try again.',
  LIMIT_EXCEEDED: 'You have reached your account limit. Please upgrade.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  HABIT_CREATED: 'Habit created successfully!',
  HABIT_UPDATED: 'Habit updated successfully!',
  HABIT_DELETED: 'Habit deleted successfully!',
  ENTRY_SAVED: 'Entry saved successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  ACHIEVEMENT_UNLOCKED: 'Achievement unlocked!',
  SYNC_COMPLETE: 'Sync completed successfully!',
} as const;