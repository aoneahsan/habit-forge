import { redirect } from '@tanstack/react-router';

interface AuthContext {
  auth: {
    isAuthenticated: boolean;
    isLoading?: boolean;
  };
}

/**
 * Guard for routes that require authentication
 * Redirects to signin if user is not authenticated
 */
export const requireAuth = ({ context }: { context: AuthContext }) => {
  if (!context.auth.isAuthenticated) {
    throw redirect({
      to: '/signin',
      search: {
        redirect: window.location.pathname,
      },
    });
  }
};

/**
 * Guard for routes that should only be accessible to non-authenticated users
 * Redirects to dashboard if user is already authenticated
 */
export const requireGuest = ({ context }: { context: AuthContext }) => {
  if (context.auth.isAuthenticated) {
    throw redirect({
      to: '/dashboard',
    });
  }
};

/**
 * Guard for the root route
 * Redirects based on authentication status
 */
export const rootRedirect = ({ context }: { context: AuthContext }) => {
  if (context.auth.isAuthenticated) {
    throw redirect({
      to: '/dashboard',
    });
  } else {
    throw redirect({
      to: '/signin',
      search: { redirect: undefined },
    });
  }
};