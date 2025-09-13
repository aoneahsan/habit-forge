export interface Habit {
  id: string;
  userId: string;
  name: string;
  description?: string;
  category: HabitCategory;
  type: 'build' | 'break' | 'maintain';
  icon?: string;
  color?: string;
  
  // Tracking configuration
  trackingConfig: TrackingConfig;
  
  // Five factors from "The Power of Habit"
  fiveFactors: FiveFactors;
  
  // Habit loop components
  habitLoop: HabitLoop;
  
  // Progress tracking
  progress: HabitProgress;
  
  // Settings
  settings: HabitSettings;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  archivedAt?: Date;
  completedAt?: Date;
  
  // Status
  status: 'active' | 'paused' | 'archived' | 'completed';
  
  // Tags for organization
  tags?: string[];
}

export interface TrackingConfig {
  frequency: 'daily' | 'weekly' | 'custom';
  customFrequency?: {
    type: 'daysOfWeek' | 'daysOfMonth' | 'interval';
    value: number[] | number;
  };
  targetValue?: number;
  unit?: string;
  reminderTime?: string;
  reminderDays?: number[];
  enableReminders: boolean;
}

export interface FiveFactors {
  trackLocation: boolean;
  trackTime: boolean;
  trackEmotionalState: boolean;
  trackOtherPeople: boolean;
  trackPrecedingAction: boolean;
}

export interface HabitLoop {
  cue: string;
  routine: string;
  reward: string;
}

export interface HabitProgress {
  currentStreak: number;
  longestStreak: number;
  totalCompletions: number;
  totalMisses: number;
  completionRate: number;
  lastCompletedAt?: Date;
  streakStartDate?: Date;
  
  // Rope visualization data
  ropeStrength: number; // 0-100
  ropeLevel: 'thread' | 'string' | 'rope' | 'cable' | 'chain';
}

export interface HabitSettings {
  isPublic: boolean;
  allowComments: boolean;
  shareWithPartners: boolean;
  enableStretch: boolean;
  stretchGoal?: number;
  penaltyMode: 'none' | 'light' | 'moderate' | 'strict';
  allowSkips: boolean;
  maxSkipsPerMonth: number;
}

export interface HabitEntry {
  id: string;
  habitId: string;
  userId: string;
  date: Date;
  completed: boolean;
  value?: number;
  
  // Five factors data
  fiveFactorsData?: FiveFactorsData;
  
  // Additional data
  notes?: string;
  photos?: string[];
  mood?: string;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  
  // Skip data
  skipped: boolean;
  skipReason?: string;
}

export interface FiveFactorsData {
  location?: {
    name: string;
    lat?: number;
    lng?: number;
    type?: 'home' | 'work' | 'gym' | 'other';
  };
  time?: {
    hour: number;
    minute: number;
    period?: 'morning' | 'afternoon' | 'evening' | 'night';
  };
  emotionalState?: {
    before: string;
    after?: string;
    intensity: 1 | 2 | 3 | 4 | 5;
  };
  otherPeople?: {
    count: number;
    names?: string[];
    relationship?: string[];
  };
  precedingAction?: {
    action: string;
    category?: string;
  };
}

export type HabitCategory = 
  | 'health'
  | 'productivity'
  | 'learning'
  | 'mindfulness'
  | 'social'
  | 'finance'
  | 'creativity'
  | 'custom';

export interface HabitTemplate {
  id: string;
  name: string;
  description: string;
  category: HabitCategory;
  type: 'build' | 'break';
  suggestedCue: string;
  suggestedRoutine: string;
  suggestedReward: string;
  defaultTrackingConfig: Partial<TrackingConfig>;
  popularity: number;
  successRate: number;
  icon: string;
  color: string;
}