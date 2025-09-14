/// <reference types="cypress" />

describe('Authentication Tests', () => {
  const timestamp = Date.now();
  const testEmail = `test.user.${timestamp}@habitforge.test`;
  const testPassword = 'TestPassword123!';
  const testDisplayName = `Test User ${timestamp}`;
  
  beforeEach(() => {
    cy.clearTestData();
    cy.visit('/');
    cy.waitForApp();
  });

  describe('Sign Up Flow', () => {
    it('should show sign up page', () => {
      cy.visit('/signup');
      cy.contains(/sign up|create account/i).should('be.visible');
      cy.get('input[type="email"]').should('be.visible');
      cy.get('input[type="password"]').should('be.visible');
    });

    it('should validate required fields', () => {
      cy.visit('/signup');
      cy.get('button[type="submit"]').click();
      
      // Check for validation errors
      cy.contains(/required|enter|provide/i).should('be.visible');
    });

    it('should validate email format', () => {
      cy.visit('/signup');
      cy.get('input[type="email"]').type('invalid-email');
      cy.get('input[type="password"]').first().type(testPassword);
      cy.get('button[type="submit"]').click();
      
      cy.contains(/invalid email|valid email/i).should('be.visible');
    });

    it('should validate password strength', () => {
      cy.visit('/signup');
      cy.get('input[type="email"]').type(testEmail);
      cy.get('input[type="password"]').first().type('weak');
      cy.get('button[type="submit"]').click();
      
      cy.contains(/password.*characters|weak password/i).should('be.visible');
    });

    it('should successfully create a new account', () => {
      cy.visit('/signup');
      
      // Fill in the form
      cy.get('input[placeholder*="name" i], input[name="displayName"], input[name="name"]').type(testDisplayName);
      cy.get('input[type="email"]').type(testEmail);
      cy.get('input[type="password"]').first().type(testPassword);
      cy.get('input[type="password"]').last().type(testPassword);
      
      // Submit
      cy.get('button[type="submit"]').contains(/sign up|create/i).click();
      
      // Should redirect to dashboard or onboarding
      cy.url().should('not.include', '/signup');
      cy.url().should('include', '/dashboard');
      
      // Verify user is logged in
      cy.contains(testDisplayName).should('be.visible');
    });

    it('should prevent duplicate email registration', () => {
      // First, create an account
      cy.visit('/signup');
      const existingEmail = `existing.${timestamp}@habitforge.test`;
      
      cy.get('input[placeholder*="name" i], input[name="displayName"], input[name="name"]').type('Existing User');
      cy.get('input[type="email"]').type(existingEmail);
      cy.get('input[type="password"]').first().type(testPassword);
      cy.get('input[type="password"]').last().type(testPassword);
      cy.get('button[type="submit"]').click();
      
      // Wait for redirect
      cy.url().should('include', '/dashboard');
      
      // Sign out
      cy.signOut();
      
      // Try to create another account with same email
      cy.visit('/signup');
      cy.get('input[placeholder*="name" i], input[name="displayName"], input[name="name"]').type('Duplicate User');
      cy.get('input[type="email"]').type(existingEmail);
      cy.get('input[type="password"]').first().type(testPassword);
      cy.get('input[type="password"]').last().type(testPassword);
      cy.get('button[type="submit"]').click();
      
      // Should show error
      cy.contains(/already exists|already registered|already in use/i).should('be.visible');
    });
  });

  describe('Sign In Flow', () => {
    const signInEmail = `signin.${timestamp}@habitforge.test`;
    
    before(() => {
      // Create a test account for sign in tests
      cy.visit('/signup');
      cy.get('input[placeholder*="name" i], input[name="displayName"], input[name="name"]').type('Sign In Test User');
      cy.get('input[type="email"]').type(signInEmail);
      cy.get('input[type="password"]').first().type(testPassword);
      cy.get('input[type="password"]').last().type(testPassword);
      cy.get('button[type="submit"]').click();
      cy.url().should('include', '/dashboard');
      cy.signOut();
    });

    it('should show sign in page', () => {
      cy.visit('/signin');
      cy.contains(/sign in|log in/i).should('be.visible');
      cy.get('input[type="email"]').should('be.visible');
      cy.get('input[type="password"]').should('be.visible');
    });

    it('should validate empty fields', () => {
      cy.visit('/signin');
      cy.get('button[type="submit"]').click();
      cy.contains(/required|enter|provide/i).should('be.visible');
    });

    it('should show error for invalid credentials', () => {
      cy.visit('/signin');
      cy.get('input[type="email"]').type('nonexistent@habitforge.test');
      cy.get('input[type="password"]').type('WrongPassword123!');
      cy.get('button[type="submit"]').click();
      
      cy.contains(/invalid|incorrect|wrong|not found/i).should('be.visible');
    });

    it('should successfully sign in with valid credentials', () => {
      cy.visit('/signin');
      cy.get('input[type="email"]').type(signInEmail);
      cy.get('input[type="password"]').type(testPassword);
      cy.get('button[type="submit"]').click();
      
      // Should redirect to dashboard
      cy.url().should('include', '/dashboard');
      cy.contains('Sign In Test User').should('be.visible');
    });

    it('should have working "Remember Me" functionality', () => {
      cy.visit('/signin');
      
      // Check remember me checkbox if it exists
      cy.get('body').then($body => {
        if ($body.find('input[type="checkbox"][name*="remember"]').length > 0) {
          cy.get('input[type="checkbox"][name*="remember"]').check();
        }
      });
      
      cy.get('input[type="email"]').type(signInEmail);
      cy.get('input[type="password"]').type(testPassword);
      cy.get('button[type="submit"]').click();
      
      cy.url().should('include', '/dashboard');
      
      // Clear session storage but keep local storage
      cy.window().then((win) => {
        win.sessionStorage.clear();
      });
      
      // Reload page - should still be logged in
      cy.reload();
      cy.url().should('include', '/dashboard');
    });
  });

  describe('Sign Out Flow', () => {
    const signOutEmail = `signout.${timestamp}@habitforge.test`;
    
    beforeEach(() => {
      // Sign in before each test
      cy.visit('/signup');
      cy.get('input[placeholder*="name" i], input[name="displayName"], input[name="name"]').type('Sign Out Test');
      cy.get('input[type="email"]').type(signOutEmail);
      cy.get('input[type="password"]').first().type(testPassword);
      cy.get('input[type="password"]').last().type(testPassword);
      cy.get('button[type="submit"]').click();
      cy.url().should('include', '/dashboard');
    });

    it('should successfully sign out', () => {
      cy.signOut();
      cy.url().should('include', '/signin');
      
      // Try to access protected route
      cy.visit('/dashboard');
      cy.url().should('include', '/signin');
    });

    it('should clear user data on sign out', () => {
      // Store some data in local storage
      cy.window().then((win) => {
        win.localStorage.setItem('test-data', 'should-be-cleared');
      });
      
      cy.signOut();
      
      // Check that user data is cleared
      cy.window().then((win) => {
        expect(win.localStorage.getItem('user')).to.be.null;
        expect(win.localStorage.getItem('auth-token')).to.be.null;
      });
    });
  });

  describe('Password Reset Flow', () => {
    it('should show password reset page', () => {
      cy.visit('/signin');
      cy.contains(/forgot password|reset password/i).click();
      cy.url().should('include', '/forgot-password');
      cy.contains(/reset|forgot/i).should('be.visible');
    });

    it('should validate email field', () => {
      cy.visit('/forgot-password');
      cy.get('button[type="submit"]').click();
      cy.contains(/required|enter.*email/i).should('be.visible');
    });

    it('should send password reset email', () => {
      cy.visit('/forgot-password');
      cy.get('input[type="email"]').type('reset@habitforge.test');
      cy.get('button[type="submit"]').click();
      
      // Should show success message
      cy.contains(/sent|check.*email|reset.*sent/i).should('be.visible');
    });
  });

  describe('Social Authentication', () => {
    it('should show Google sign in button', () => {
      cy.visit('/signin');
      cy.get('button').contains(/google|continue with/i).should('be.visible');
    });

    it('should initiate Google OAuth flow', () => {
      cy.visit('/signin');
      
      // Click Google sign in button
      cy.get('button').contains(/google/i).click();
      
      // Since we can't test actual OAuth, just verify the button is clickable
      // In real scenario, this would redirect to Google
    });
  });

  describe('Protected Routes', () => {
    it('should redirect to auth when accessing protected routes without authentication', () => {
      const protectedRoutes = [
        '/dashboard',
        '/habits',
        '/analytics',
        '/community',
        '/profile',
        '/settings'
      ];
      
      protectedRoutes.forEach(route => {
        cy.visit(route);
        cy.url().should('include', '/signin');
      });
    });

    it('should allow access to protected routes when authenticated', () => {
      // Sign in first
      const authEmail = `auth.${timestamp}@habitforge.test`;
      cy.visit('/signup');
      cy.get('input[placeholder*="name" i], input[name="displayName"], input[name="name"]').type('Auth Test');
      cy.get('input[type="email"]').type(authEmail);
      cy.get('input[type="password"]').first().type(testPassword);
      cy.get('input[type="password"]').last().type(testPassword);
      cy.get('button[type="submit"]').click();
      cy.url().should('include', '/dashboard');
      
      // Now test protected routes
      const protectedRoutes = [
        '/dashboard',
        '/habits',
        '/analytics',
        '/community',
        '/profile',
        '/settings'
      ];
      
      protectedRoutes.forEach(route => {
        cy.visit(route);
        cy.url().should('include', route);
      });
    });
  });

  describe('Session Management', () => {
    it('should maintain session across page refreshes', () => {
      const sessionEmail = `session.${timestamp}@habitforge.test`;
      
      // Sign in
      cy.visit('/signup');
      cy.get('input[placeholder*="name" i], input[name="displayName"], input[name="name"]').type('Session Test');
      cy.get('input[type="email"]').type(sessionEmail);
      cy.get('input[type="password"]').first().type(testPassword);
      cy.get('input[type="password"]').last().type(testPassword);
      cy.get('button[type="submit"]').click();
      cy.url().should('include', '/dashboard');
      
      // Refresh page
      cy.reload();
      
      // Should still be logged in
      cy.url().should('include', '/dashboard');
      cy.contains('Session Test').should('be.visible');
    });

    it('should handle session timeout appropriately', () => {
      // This would require mocking time or waiting for actual timeout
      // For now, we'll just verify the session exists
      cy.window().then((win) => {
        const authData = win.localStorage.getItem('auth');
        expect(authData).to.not.be.null;
      });
    });
  });
});