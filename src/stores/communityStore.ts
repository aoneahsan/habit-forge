import { create } from 'zustand';
import { db, PROJECT_PREFIX } from '@/config/firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  updateDoc, 
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  arrayUnion,
  arrayRemove,
  increment
} from 'firebase/firestore';
import toast from 'react-hot-toast';

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: number; // in days
  startDate: Date;
  endDate: Date;
  participants: string[];
  participantCount: number;
  createdBy: string;
  rules: string[];
  rewards: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  status: 'upcoming' | 'active' | 'completed';
  imageUrl?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Buddy {
  id: string;
  userId: string;
  displayName: string;
  bio: string;
  interests: string[];
  habitCategories: string[];
  timezone: string;
  preferredTime: 'morning' | 'afternoon' | 'evening';
  matchScore?: number;
  status: 'available' | 'matched' | 'inactive';
  currentBuddyId?: string;
  stats: {
    habitsCompleted: number;
    currentStreak: number;
    accountabilityScore: number;
  };
  createdAt: Date;
}

export interface BuddyMatch {
  id: string;
  user1Id: string;
  user2Id: string;
  status: 'pending' | 'active' | 'ended';
  sharedHabits: string[];
  messages: Message[];
  startDate: Date;
  endDate?: Date;
  matchScore: number;
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'motivation' | 'achievement';
}

interface CommunityState {
  challenges: Challenge[];
  buddies: Buddy[];
  myMatches: BuddyMatch[];
  loading: boolean;
  error: string | null;
  
  // Challenge functions
  fetchChallenges: () => Promise<void>;
  joinChallenge: (challengeId: string, userId: string) => Promise<void>;
  leaveChallenge: (challengeId: string, userId: string) => Promise<void>;
  createChallenge: (challenge: Partial<Challenge>) => Promise<string>;
  
  // Buddy functions
  findBuddies: (userId: string, preferences: any) => Promise<Buddy[]>;
  requestBuddy: (userId: string, buddyId: string) => Promise<void>;
  acceptBuddyRequest: (matchId: string) => Promise<void>;
  endBuddyMatch: (matchId: string) => Promise<void>;
  sendMessage: (matchId: string, message: Partial<Message>) => Promise<void>;
}

export const useCommunityStore = create<CommunityState>((set, get) => ({
  challenges: [],
  buddies: [],
  myMatches: [],
  loading: false,
  error: null,
  
  fetchChallenges: async () => {
    set({ loading: true });
    try {
      const q = query(
        collection(db, `${PROJECT_PREFIX}challenges`),
        where('status', 'in', ['upcoming', 'active']),
        orderBy('participantCount', 'desc'),
        limit(20)
      );
      
      const snapshot = await getDocs(q);
      const challenges = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          startDate: data.startDate?.toDate() || new Date(),
          endDate: data.endDate?.toDate() || new Date(),
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        } as Challenge;
      });
      
      set({ challenges, loading: false });
    } catch (error: any) {
      console.error('Error fetching challenges:', error);
      set({ error: error.message, loading: false });
    }
  },
  
  joinChallenge: async (challengeId, userId) => {
    try {
      const challengeRef = doc(db, `${PROJECT_PREFIX}challenges`, challengeId);
      
      await updateDoc(challengeRef, {
        participants: arrayUnion(userId),
        participantCount: increment(1),
        updatedAt: Timestamp.now()
      });
      
      // Update local state
      set(state => ({
        challenges: state.challenges.map(c => 
          c.id === challengeId 
            ? { 
                ...c, 
                participants: [...c.participants, userId],
                participantCount: c.participantCount + 1 
              }
            : c
        )
      }));
      
      toast.success('🎯 Challenge joined successfully!');
    } catch (error: any) {
      toast.error('Failed to join challenge');
      throw error;
    }
  },
  
  leaveChallenge: async (challengeId, userId) => {
    try {
      const challengeRef = doc(db, `${PROJECT_PREFIX}challenges`, challengeId);
      
      await updateDoc(challengeRef, {
        participants: arrayRemove(userId),
        participantCount: increment(-1),
        updatedAt: Timestamp.now()
      });
      
      // Update local state
      set(state => ({
        challenges: state.challenges.map(c => 
          c.id === challengeId 
            ? { 
                ...c, 
                participants: c.participants.filter(p => p !== userId),
                participantCount: Math.max(0, c.participantCount - 1)
              }
            : c
        )
      }));
      
      toast('Left the challenge', { icon: 'ℹ️' });
    } catch (error: any) {
      toast.error('Failed to leave challenge');
      throw error;
    }
  },
  
  createChallenge: async (challengeData) => {
    const id = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const challenge: Challenge = {
      id,
      title: challengeData.title || '',
      description: challengeData.description || '',
      category: challengeData.category || 'general',
      duration: challengeData.duration || 30,
      startDate: challengeData.startDate || new Date(),
      endDate: challengeData.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      participants: challengeData.participants || [],
      participantCount: challengeData.participantCount || 0,
      createdBy: challengeData.createdBy || '',
      rules: challengeData.rules || [],
      rewards: challengeData.rewards || [],
      difficulty: challengeData.difficulty || 'medium',
      status: challengeData.status || 'upcoming',
      tags: challengeData.tags || [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    try {
      await setDoc(doc(db, `${PROJECT_PREFIX}challenges`, id), {
        ...challenge,
        startDate: Timestamp.fromDate(challenge.startDate),
        endDate: Timestamp.fromDate(challenge.endDate),
        createdAt: Timestamp.fromDate(challenge.createdAt),
        updatedAt: Timestamp.fromDate(challenge.updatedAt)
      });
      
      set(state => ({ challenges: [...state.challenges, challenge] }));
      toast.success('🚀 Challenge created successfully!');
      return id;
    } catch (error: any) {
      toast.error('Failed to create challenge');
      throw error;
    }
  },
  
  findBuddies: async (userId, preferences) => {
    set({ loading: true });
    try {
      // In a real app, this would use a matching algorithm
      const q = query(
        collection(db, `${PROJECT_PREFIX}buddies`),
        where('status', '==', 'available'),
        where('userId', '!=', userId),
        limit(10)
      );
      
      const snapshot = await getDocs(q);
      const buddies = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          createdAt: data.createdAt?.toDate() || new Date()
        } as Buddy;
      });
      
      // Calculate match scores based on preferences
      const scoredBuddies = buddies.map(buddy => {
        let score = 0;
        
        // Match based on categories
        if (preferences.categories) {
          const commonCategories = buddy.habitCategories.filter(c => 
            preferences.categories.includes(c)
          );
          score += commonCategories.length * 20;
        }
        
        // Match based on preferred time
        if (preferences.preferredTime === buddy.preferredTime) {
          score += 30;
        }
        
        // Match based on timezone (prefer same or close timezones)
        if (preferences.timezone === buddy.timezone) {
          score += 25;
        }
        
        // Bonus for high accountability score
        score += (buddy.stats.accountabilityScore / 100) * 25;
        
        return { ...buddy, matchScore: Math.min(100, score) };
      });
      
      // Sort by match score
      scoredBuddies.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
      
      set({ buddies: scoredBuddies, loading: false });
      return scoredBuddies;
    } catch (error: any) {
      console.error('Error finding buddies:', error);
      set({ error: error.message, loading: false });
      return [];
    }
  },
  
  requestBuddy: async (userId, buddyId) => {
    const id = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const match: BuddyMatch = {
      id,
      user1Id: userId,
      user2Id: buddyId,
      status: 'pending',
      sharedHabits: [],
      messages: [],
      startDate: new Date(),
      matchScore: 0
    };
    
    try {
      await setDoc(doc(db, `${PROJECT_PREFIX}matches`, id), {
        ...match,
        startDate: Timestamp.fromDate(match.startDate)
      });
      
      set(state => ({ myMatches: [...state.myMatches, match] }));
      toast.success('🤝 Buddy request sent!');
    } catch (error: any) {
      toast.error('Failed to send buddy request');
      throw error;
    }
  },
  
  acceptBuddyRequest: async (matchId) => {
    try {
      await updateDoc(doc(db, `${PROJECT_PREFIX}matches`, matchId), {
        status: 'active',
        updatedAt: Timestamp.now()
      });
      
      set(state => ({
        myMatches: state.myMatches.map(m => 
          m.id === matchId ? { ...m, status: 'active' } : m
        )
      }));
      
      toast.success('🎉 Buddy match accepted!');
    } catch (error: any) {
      toast.error('Failed to accept buddy request');
      throw error;
    }
  },
  
  endBuddyMatch: async (matchId) => {
    try {
      await updateDoc(doc(db, `${PROJECT_PREFIX}matches`, matchId), {
        status: 'ended',
        endDate: Timestamp.now()
      });
      
      set(state => ({
        myMatches: state.myMatches.map(m => 
          m.id === matchId 
            ? { ...m, status: 'ended', endDate: new Date() } 
            : m
        )
      }));
      
      toast('Buddy match ended', { icon: 'ℹ️' });
    } catch (error: any) {
      toast.error('Failed to end buddy match');
      throw error;
    }
  },
  
  sendMessage: async (matchId, messageData) => {
    const id = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const message: Message = {
      id,
      senderId: messageData.senderId || '',
      content: messageData.content || '',
      timestamp: new Date(),
      type: messageData.type || 'text'
    };
    
    try {
      await updateDoc(doc(db, `${PROJECT_PREFIX}matches`, matchId), {
        messages: arrayUnion({
          ...message,
          timestamp: Timestamp.fromDate(message.timestamp)
        }),
        updatedAt: Timestamp.now()
      });
      
      set(state => ({
        myMatches: state.myMatches.map(m => 
          m.id === matchId 
            ? { ...m, messages: [...m.messages, message] } 
            : m
        )
      }));
      
      toast.success('Message sent!');
    } catch (error: any) {
      toast.error('Failed to send message');
      throw error;
    }
  }
}));