/// <reference types="cypress" />

describe('Deployed App Comprehensive Test', () => {
  const timestamp = Date.now();
  const testEmail = `test.${timestamp}@habitforge.com`;
  const testPassword = 'Test@Pass123!';
  const testName = `Test User ${timestamp}`;

  describe('1. Basic Site Functionality', () => {
    it('should load the homepage', () => {
      cy.visit('https://habitforge-a1.web.app', { timeout: 30000 });
      cy.get('#root').should('be.visible');
    });

    it('should have correct title and meta tags', () => {
      cy.visit('/');
      cy.title().should('contain', 'HabitForge');
      cy.document().get('meta[name="description"]').should('exist');
    });

    it('should load CSS and styling correctly', () => {
      cy.visit('/');
      cy.get('body').should('have.css', 'font-family');
      // Check if Tailwind classes are working
      cy.get('.min-h-screen').should('exist');
    });

    it('should redirect to signin when not authenticated', () => {
      cy.visit('/dashboard');
      cy.url().should('include', '/signin');
    });
  });

  describe('2. Authentication Pages', () => {
    it('should display signin page correctly', () => {
      cy.visit('/signin');
      cy.get('input[type="email"]').should('be.visible');
      cy.get('input[type="password"]').should('be.visible');
      cy.get('button[type="submit"]').should('be.visible');
      cy.contains(/sign in|log in/i).should('be.visible');
    });

    it('should display signup page correctly', () => {
      cy.visit('/signup');
      cy.get('input[type="email"]').should('be.visible');
      cy.get('input[type="password"]').should('be.visible');
      cy.contains(/sign up|create account/i).should('be.visible');
    });

    it('should navigate between signin and signup', () => {
      cy.visit('/signin');
      cy.contains(/don't have an account|sign up/i).click();
      cy.url().should('include', '/signup');
      
      cy.contains(/already have an account|sign in/i).click();
      cy.url().should('include', '/signin');
    });

    it('should show forgot password page', () => {
      cy.visit('/signin');
      cy.contains(/forgot password/i).click();
      cy.url().should('include', '/forgot-password');
      cy.get('input[type="email"]').should('be.visible');
    });
  });

  describe('3. User Registration Flow', () => {
    it('should validate required fields on signup', () => {
      cy.visit('/signup');
      cy.get('button[type="submit"]').click();
      // Should show validation errors
      cy.contains(/required|please/i).should('be.visible');
    });

    it('should validate email format', () => {
      cy.visit('/signup');
      cy.get('input[type="email"]').type('invalid-email');
      cy.get('button[type="submit"]').click();
      cy.contains(/invalid email|valid email/i).should('be.visible');
    });

    it('should validate password strength', () => {
      cy.visit('/signup');
      cy.get('input[type="email"]').type(testEmail);
      cy.get('input[type="password"]').first().type('weak');
      cy.get('button[type="submit"]').click();
      cy.contains(/password.*characters|weak/i).should('be.visible');
    });

    it('should create a new account successfully', () => {
      cy.visit('/signup');
      
      // Fill the form
      cy.get('input[name="name"], input[name="displayName"], input[placeholder*="name" i]')
        .type(testName);
      cy.get('input[type="email"]').type(testEmail);
      cy.get('input[type="password"]').first().type(testPassword);
      cy.get('input[type="password"]').last().type(testPassword);
      
      // Submit
      cy.get('button[type="submit"]').click();
      
      // Should redirect to dashboard
      cy.url({ timeout: 20000 }).should('include', '/dashboard');
      
      // Should show user name
      cy.contains(testName, { timeout: 10000 }).should('be.visible');
    });
  });

  describe('4. Dashboard Functionality', () => {
    beforeEach(() => {
      // Sign in before each test
      cy.visit('/signin');
      cy.get('input[type="email"]').type(testEmail);
      cy.get('input[type="password"]').type(testPassword);
      cy.get('button[type="submit"]').click();
      cy.url({ timeout: 15000 }).should('include', '/dashboard');
    });

    it('should display dashboard elements', () => {
      cy.contains(/dashboard|overview|today/i).should('be.visible');
      cy.get('[data-testid="habit-list"], .habit-list, main').should('be.visible');
    });

    it('should show navigation menu', () => {
      cy.get('nav, [role="navigation"]').should('be.visible');
      cy.contains(/habits/i).should('be.visible');
      cy.contains(/analytics/i).should('be.visible');
      cy.contains(/community/i).should('be.visible');
    });

    it('should navigate to different sections', () => {
      // Navigate to Habits
      cy.contains(/habits/i).click();
      cy.url().should('include', '/habits');
      
      // Navigate to Analytics
      cy.contains(/analytics/i).click();
      cy.url().should('include', '/analytics');
      
      // Navigate to Community
      cy.contains(/community/i).click();
      cy.url().should('include', '/community');
    });
  });

  describe('5. Habit Management', () => {
    beforeEach(() => {
      cy.visit('/signin');
      cy.get('input[type="email"]').type(testEmail);
      cy.get('input[type="password"]').type(testPassword);
      cy.get('button[type="submit"]').click();
      cy.url({ timeout: 15000 }).should('include', '/dashboard');
    });

    it('should navigate to create habit page', () => {
      cy.visit('/habits');
      cy.get('button').contains(/new|add|create|\+/i).click();
      cy.url().should('include', '/habits/new');
    });

    it('should display habit creation form', () => {
      cy.visit('/habits/new');
      cy.get('input[name="name"], input[placeholder*="name" i]').should('be.visible');
      cy.get('select[name="category"], [data-testid="category-select"]').should('be.visible');
      cy.get('button[type="submit"]').should('be.visible');
    });

    it('should create a new habit', () => {
      const habitName = `Test Habit ${timestamp}`;
      
      cy.visit('/habits/new');
      
      // Fill form
      cy.get('input[name="name"], input[placeholder*="name" i]').type(habitName);
      cy.get('select[name="category"], [data-testid="category-select"]').select('Health');
      
      // Select habit type
      cy.get('input[value="build"], label').contains(/build/i).click();
      
      // Select frequency
      cy.get('select[name="frequency"], [data-testid="frequency-select"]').select('Daily');
      
      // Add description
      cy.get('textarea[name="description"], textarea').first().type('Test habit description');
      
      // Submit
      cy.get('button[type="submit"]').click();
      
      // Should redirect to habits list
      cy.url({ timeout: 10000 }).should('include', '/habits');
      
      // Should show the created habit
      cy.contains(habitName).should('be.visible');
    });

    it('should display habit in dashboard', () => {
      cy.visit('/dashboard');
      cy.get('[data-testid="habit-card"], .habit-card, article').should('exist');
    });
  });

  describe('6. Settings and Profile', () => {
    beforeEach(() => {
      cy.visit('/signin');
      cy.get('input[type="email"]').type(testEmail);
      cy.get('input[type="password"]').type(testPassword);
      cy.get('button[type="submit"]').click();
      cy.url({ timeout: 15000 }).should('include', '/dashboard');
    });

    it('should navigate to settings page', () => {
      cy.visit('/settings');
      cy.contains(/settings|preferences/i).should('be.visible');
    });

    it('should display user profile information', () => {
      cy.visit('/settings');
      cy.contains(testName).should('be.visible');
      cy.contains(testEmail).should('be.visible');
    });

    it('should have theme toggle', () => {
      cy.visit('/settings');
      cy.get('[data-testid="theme-toggle"], button').contains(/theme|dark|light/i).should('exist');
    });
  });

  describe('7. Sign Out Flow', () => {
    beforeEach(() => {
      cy.visit('/signin');
      cy.get('input[type="email"]').type(testEmail);
      cy.get('input[type="password"]').type(testPassword);
      cy.get('button[type="submit"]').click();
      cy.url({ timeout: 15000 }).should('include', '/dashboard');
    });

    it('should sign out successfully', () => {
      // Find user menu
      cy.get('[data-testid="user-menu"], [aria-label*="menu" i], button').first().click();
      
      // Click sign out
      cy.contains(/sign out|log out/i).click();
      
      // Should redirect to signin
      cy.url().should('include', '/signin');
      
      // Should not be able to access protected routes
      cy.visit('/dashboard');
      cy.url().should('include', '/signin');
    });
  });

  describe('8. Error Handling', () => {
    it('should handle invalid signin gracefully', () => {
      cy.visit('/signin');
      cy.get('input[type="email"]').type('nonexistent@example.com');
      cy.get('input[type="password"]').type('wrongpassword');
      cy.get('button[type="submit"]').click();
      
      // Should show error message
      cy.contains(/invalid|incorrect|not found|error/i, { timeout: 10000 }).should('be.visible');
    });

    it('should handle network errors', () => {
      // Intercept API calls and force error
      cy.intercept('POST', '**/identitytoolkit/**', { statusCode: 500 }).as('authError');
      
      cy.visit('/signin');
      cy.get('input[type="email"]').type(testEmail);
      cy.get('input[type="password"]').type(testPassword);
      cy.get('button[type="submit"]').click();
      
      // Should show error message
      cy.contains(/error|failed|try again/i, { timeout: 10000 }).should('be.visible');
    });
  });

  describe('9. Performance Checks', () => {
    it('should load pages within acceptable time', () => {
      const pages = ['/signin', '/signup', '/forgot-password'];
      
      pages.forEach(page => {
        cy.visit(page);
        // Page should be interactive within 3 seconds
        cy.get('#root', { timeout: 3000 }).should('be.visible');
      });
    });

    it('should not have console errors on main pages', () => {
      const pages = ['/signin', '/signup'];
      
      pages.forEach(page => {
        cy.visit(page);
        
        cy.window().then((win) => {
          cy.spy(win.console, 'error');
          cy.wait(2000);
          cy.wrap(win.console.error).should('not.be.called');
        });
      });
    });
  });
});