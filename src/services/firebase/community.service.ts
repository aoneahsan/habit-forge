import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  increment,
} from 'firebase/firestore';
import { db } from '@/config/firebase.config';
import { APP_CONFIG } from '@/constants/app.constants';

const POSTS_COLLECTION = `${APP_CONFIG.firebase.projectPrefix}posts`;
const CHALLENGES_COLLECTION = `${APP_CONFIG.firebase.projectPrefix}challenges`;
const RELATIONSHIPS_COLLECTION = `${APP_CONFIG.firebase.projectPrefix}relationships`;

// Post Management
export async function createPost(userId: string, content: string, attachments?: string[]) {
  try {
    const postRef = await addDoc(collection(db, POSTS_COLLECTION), {
      userId,
      content,
      attachments: attachments || [],
      likes: [],
      comments: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    
    return postRef.id;
  } catch (error) {
    console.error('Error creating post:', error);
    throw new Error('Failed to create post');
  }
}

export async function getPosts(limitCount = 20) {
  try {
    const q = query(
      collection(db, POSTS_COLLECTION),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
    }));
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw new Error('Failed to fetch posts');
  }
}

export async function likePost(postId: string, userId: string) {
  try {
    const postRef = doc(db, POSTS_COLLECTION, postId);
    const postDoc = await getDoc(postRef);
    
    if (!postDoc.exists()) {
      throw new Error('Post not found');
    }
    
    const likes = postDoc.data().likes || [];
    const isLiked = likes.includes(userId);
    
    if (isLiked) {
      // Unlike
      await updateDoc(postRef, {
        likes: likes.filter((id: string) => id !== userId),
      });
    } else {
      // Like
      await updateDoc(postRef, {
        likes: [...likes, userId],
      });
    }
    
    return !isLiked;
  } catch (error) {
    console.error('Error liking post:', error);
    throw new Error('Failed to like post');
  }
}

export async function addComment(postId: string, userId: string, comment: string) {
  try {
    const postRef = doc(db, POSTS_COLLECTION, postId);
    const commentData = {
      userId,
      comment,
      createdAt: new Date(),
    };
    
    await updateDoc(postRef, {
      comments: [...((await getDoc(postRef)).data()?.comments || []), commentData],
    });
    
    return commentData;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw new Error('Failed to add comment');
  }
}

// Challenge Management
export async function getChallenges() {
  try {
    const snapshot = await getDocs(collection(db, CHALLENGES_COLLECTION));
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      startDate: doc.data().startDate?.toDate() || new Date(),
      endDate: doc.data().endDate?.toDate() || new Date(),
    }));
  } catch (error) {
    console.error('Error fetching challenges:', error);
    throw new Error('Failed to fetch challenges');
  }
}

export async function joinChallenge(challengeId: string, userId: string) {
  try {
    const challengeRef = doc(db, CHALLENGES_COLLECTION, challengeId);
    const challengeDoc = await getDoc(challengeRef);
    
    if (!challengeDoc.exists()) {
      throw new Error('Challenge not found');
    }
    
    const participants = challengeDoc.data().participants || [];
    
    if (!participants.includes(userId)) {
      await updateDoc(challengeRef, {
        participants: [...participants, userId],
        participantCount: increment(1),
      });
    }
    
    return true;
  } catch (error) {
    console.error('Error joining challenge:', error);
    throw new Error('Failed to join challenge');
  }
}

// Friend Management
export async function sendFriendRequest(fromUserId: string, toUserId: string) {
  try {
    const relationshipRef = await addDoc(collection(db, RELATIONSHIPS_COLLECTION), {
      fromUserId,
      toUserId,
      status: 'pending',
      createdAt: serverTimestamp(),
    });
    
    return relationshipRef.id;
  } catch (error) {
    console.error('Error sending friend request:', error);
    throw new Error('Failed to send friend request');
  }
}

export async function acceptFriendRequest(relationshipId: string) {
  try {
    await updateDoc(doc(db, RELATIONSHIPS_COLLECTION, relationshipId), {
      status: 'accepted',
      acceptedAt: serverTimestamp(),
    });
    
    return true;
  } catch (error) {
    console.error('Error accepting friend request:', error);
    throw new Error('Failed to accept friend request');
  }
}

export async function getFriends(userId: string) {
  try {
    const q1 = query(
      collection(db, RELATIONSHIPS_COLLECTION),
      where('fromUserId', '==', userId),
      where('status', '==', 'accepted')
    );
    
    const q2 = query(
      collection(db, RELATIONSHIPS_COLLECTION),
      where('toUserId', '==', userId),
      where('status', '==', 'accepted')
    );
    
    const [snapshot1, snapshot2] = await Promise.all([getDocs(q1), getDocs(q2)]);
    
    const friends = new Set<string>();
    
    snapshot1.docs.forEach(doc => {
      friends.add(doc.data().toUserId);
    });
    
    snapshot2.docs.forEach(doc => {
      friends.add(doc.data().fromUserId);
    });
    
    return Array.from(friends);
  } catch (error) {
    console.error('Error fetching friends:', error);
    throw new Error('Failed to fetch friends');
  }
}

// Leaderboard
export async function getLeaderboard(limitCount = 10) {
  try {
    const q = query(
      collection(db, `${APP_CONFIG.firebase.projectPrefix}users`),
      orderBy('stats.totalPoints', 'desc'),
      limit(limitCount)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc, index) => ({
      rank: index + 1,
      userId: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    throw new Error('Failed to fetch leaderboard');
  }
}