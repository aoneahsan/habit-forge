import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  type User as FirebaseUser
} from 'firebase/auth';
import { auth } from '@/config/firebase';

// Singleton pattern for auth service
class AuthService {
  private static instance: AuthService;

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async signIn(email: string, password: string): Promise<FirebaseUser> {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (error) {
      this.handleAuthError(error);
      throw error;
    }
  }

  async signUp(email: string, password: string): Promise<FirebaseUser> {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (error) {
      this.handleAuthError(error);
      throw error;
    }
  }

  async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      this.handleAuthError(error);
      throw error;
    }
  }

  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      this.handleAuthError(error);
      throw error;
    }
  }

  async updateUserProfile(displayName?: string, photoURL?: string): Promise<void> {
    const user = auth.currentUser;
    if (!user) throw new Error('No authenticated user');

    try {
      await updateProfile(user, { displayName, photoURL });
    } catch (error) {
      this.handleAuthError(error);
      throw error;
    }
  }

  getCurrentUser(): FirebaseUser | null {
    return auth.currentUser;
  }

  private handleAuthError(error: any): void {
    // Log error securely without exposing sensitive information
    console.error('Auth error:', error.code);
    
    // Map Firebase error codes to user-friendly messages
    const errorMessages: { [key: string]: string } = {
      'auth/email-already-in-use': 'This email is already registered',
      'auth/invalid-email': 'Invalid email address',
      'auth/weak-password': 'Password must be at least 6 characters',
      'auth/user-not-found': 'No account found with this email',
      'auth/wrong-password': 'Incorrect password',
      'auth/too-many-requests': 'Too many attempts. Please try again later',
    };

    error.userMessage = errorMessages[error.code] || 'An authentication error occurred';
  }
}

export const authService = AuthService.getInstance();