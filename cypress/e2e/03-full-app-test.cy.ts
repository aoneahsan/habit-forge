/// <reference types="cypress" />

describe('Full Application E2E Test', () => {
  const timestamp = Date.now();
  const testEmail = `e2e.test.${timestamp}@habitforge.test`;
  const testPassword = 'TestPassword123!@#';
  const testDisplayName = `E2E Test User ${timestamp}`;
  
  describe('User Registration and Authentication', () => {
    it('should successfully create a new user account', () => {
      cy.visit('/signup');
      cy.waitForApp();
      
      // Fill registration form
      cy.get('input[placeholder*="name" i], input[name="displayName"], input[name="name"]')
        .should('be.visible')
        .type(testDisplayName);
      
      cy.get('input[type="email"]')
        .should('be.visible')
        .type(testEmail);
      
      cy.get('input[type="password"]').first()
        .should('be.visible')
        .type(testPassword);
      
      cy.get('input[type="password"]').last()
        .should('be.visible')
        .type(testPassword);
      
      // Submit form
      cy.get('button[type="submit"]')
        .contains(/sign up|create account|register/i)
        .click();
      
      // Should redirect to dashboard
      cy.url({ timeout: 15000 }).should('include', '/dashboard');
      
      // Verify user is logged in
      cy.contains(testDisplayName, { timeout: 10000 }).should('be.visible');
    });
    
    it('should sign out successfully', () => {
      // Find and click user menu
      cy.get('[data-testid="user-menu"], [aria-label*="user" i], button').first().click();
      
      // Click sign out
      cy.get('[data-testid="sign-out"], button')
        .contains(/sign out|log out/i)
        .click();
      
      // Should redirect to auth
      cy.url().should('include', '/signin');
    });
    
    it('should sign in with existing account', () => {
      cy.visit('/signin');
      cy.waitForApp();
      
      cy.get('input[type="email"]')
        .should('be.visible')
        .type(testEmail);
      
      cy.get('input[type="password"]')
        .should('be.visible')
        .type(testPassword);
      
      cy.get('button[type="submit"]')
        .contains(/sign in|log in/i)
        .click();
      
      // Should redirect to dashboard
      cy.url({ timeout: 15000 }).should('include', '/dashboard');
      cy.contains(testDisplayName).should('be.visible');
    });
  });
  
  describe('Habit Management', () => {
    beforeEach(() => {
      // Ensure we're logged in
      cy.visit('/signin');
      cy.get('input[type="email"]').type(testEmail);
      cy.get('input[type="password"]').type(testPassword);
      cy.get('button[type="submit"]').click();
      cy.url({ timeout: 15000 }).should('include', '/dashboard');
    });
    
    it('should create a new habit', () => {
      const habitName = `Morning Exercise ${timestamp}`;
      
      // Navigate to habits page
      cy.visit('/habits');
      cy.waitForApp();
      
      // Click create habit button
      cy.get('button')
        .contains(/new habit|add habit|create habit|\+/i)
        .click();
      
      // Fill habit form
      cy.get('input[name="name"], input[placeholder*="habit name" i]')
        .should('be.visible')
        .type(habitName);
      
      // Select category
      cy.get('select[name="category"], [data-testid="category-select"]')
        .select('Health');
      
      // Select type - Build
      cy.get('input[value="build"], input[type="radio"]')
        .first()
        .check({ force: true });
      
      // Select frequency
      cy.get('select[name="frequency"], [data-testid="frequency-select"]')
        .select('Daily');
      
      // Add description
      cy.get('textarea[name="description"], textarea[placeholder*="description" i]')
        .type('Daily morning exercise routine for better health');
      
      // Submit form
      cy.get('button[type="submit"]')
        .contains(/create|save|add/i)
        .click();
      
      // Verify habit was created
      cy.contains(habitName).should('be.visible');
    });
    
    it('should complete a habit', () => {
      cy.visit('/dashboard');
      cy.waitForApp();
      
      // Find a habit and complete it
      cy.get('[data-testid="habit-card"], .habit-card')
        .first()
        .within(() => {
          cy.get('button[data-testid="complete-habit"], input[type="checkbox"], button')
            .first()
            .click();
        });
      
      // Should show completion state
      cy.get('[data-testid="habit-card"], .habit-card')
        .first()
        .should('have.class', 'completed')
        .or('contain', '✓')
        .or('contain', 'Done');
    });
    
    it('should view habit analytics', () => {
      cy.visit('/habits');
      cy.waitForApp();
      
      // Click on a habit to view details
      cy.get('[data-testid="habit-card"], .habit-card')
        .first()
        .click();
      
      // Should show analytics
      cy.contains(/streak|progress|analytics/i).should('be.visible');
      
      // Should show rope visualization
      cy.get('svg, canvas, [data-testid="rope-visualization"]').should('be.visible');
    });
  });
  
  describe('Community Features', () => {
    beforeEach(() => {
      // Ensure we're logged in
      cy.visit('/signin');
      cy.get('input[type="email"]').type(testEmail);
      cy.get('input[type="password"]').type(testPassword);
      cy.get('button[type="submit"]').click();
      cy.url({ timeout: 15000 }).should('include', '/dashboard');
    });
    
    it('should navigate to community page', () => {
      cy.visit('/community');
      cy.waitForApp();
      
      // Should show community features
      cy.contains(/community|posts|challenges|leaderboard/i).should('be.visible');
    });
    
    it('should create a community post', () => {
      cy.visit('/community');
      cy.waitForApp();
      
      const postContent = `Test post from E2E test ${timestamp}`;
      
      // Find and click create post button
      cy.get('button')
        .contains(/new post|create post|share|write/i)
        .click();
      
      // Write post content
      cy.get('textarea[placeholder*="share" i], textarea[placeholder*="write" i], textarea')
        .first()
        .type(postContent);
      
      // Submit post
      cy.get('button')
        .contains(/post|share|submit/i)
        .click();
      
      // Verify post was created
      cy.contains(postContent).should('be.visible');
    });
  });
  
  describe('Profile and Settings', () => {
    beforeEach(() => {
      // Ensure we're logged in
      cy.visit('/signin');
      cy.get('input[type="email"]').type(testEmail);
      cy.get('input[type="password"]').type(testPassword);
      cy.get('button[type="submit"]').click();
      cy.url({ timeout: 15000 }).should('include', '/dashboard');
    });
    
    it('should navigate to settings page', () => {
      cy.visit('/settings');
      cy.waitForApp();
      
      // Should show settings options
      cy.contains(/settings|preferences|profile/i).should('be.visible');
    });
    
    it('should toggle dark mode', () => {
      cy.visit('/settings');
      cy.waitForApp();
      
      // Find and click dark mode toggle
      cy.get('[data-testid="dark-mode-toggle"], button')
        .contains(/dark|theme/i)
        .click();
      
      // Check if dark mode is applied
      cy.get('html, body').should('have.class', 'dark');
    });
    
    it('should update profile information', () => {
      cy.visit('/settings');
      cy.waitForApp();
      
      const newBio = `Updated bio for E2E test user ${timestamp}`;
      
      // Find bio field and update it
      cy.get('textarea[name="bio"], textarea[placeholder*="bio" i]')
        .clear()
        .type(newBio);
      
      // Save changes
      cy.get('button')
        .contains(/save|update/i)
        .click();
      
      // Should show success message
      cy.contains(/saved|updated|success/i).should('be.visible');
    });
  });
  
  describe('Analytics Dashboard', () => {
    beforeEach(() => {
      // Ensure we're logged in
      cy.visit('/signin');
      cy.get('input[type="email"]').type(testEmail);
      cy.get('input[type="password"]').type(testPassword);
      cy.get('button[type="submit"]').click();
      cy.url({ timeout: 15000 }).should('include', '/dashboard');
    });
    
    it('should display analytics overview', () => {
      cy.visit('/analytics');
      cy.waitForApp();
      
      // Should show analytics components
      cy.contains(/statistics|overview|progress/i).should('be.visible');
      
      // Should show charts or visualizations
      cy.get('svg, canvas, [data-testid*="chart"]').should('exist');
    });
    
    it('should show streak information', () => {
      cy.visit('/analytics');
      cy.waitForApp();
      
      // Should display streak data
      cy.contains(/streak/i).should('be.visible');
      cy.contains(/total habits/i).should('be.visible');
      cy.contains(/completion rate/i).should('be.visible');
    });
  });
  
  describe('Error Handling', () => {
    it('should handle 404 pages gracefully', () => {
      cy.visit('/non-existent-page', { failOnStatusCode: false });
      
      // Should show 404 or redirect
      cy.contains(/not found|404|dashboard/i).should('be.visible');
    });
    
    it('should handle network errors gracefully', () => {
      // Intercept and fail a request
      cy.intercept('GET', '**/api/**', { forceNetworkError: true }).as('networkError');
      
      cy.visit('/');
      
      // App should still load
      cy.get('#root').should('be.visible');
    });
  });
  
  describe('Performance Tests', () => {
    it('should load pages quickly', () => {
      const pages = ['/signin', '/signup', '/dashboard', '/habits', '/analytics', '/community'];
      
      pages.forEach(page => {
        cy.visit(page);
        
        // Page should load within 3 seconds
        cy.get('#root', { timeout: 3000 }).should('be.visible');
      });
    });
    
    it('should have no memory leaks on navigation', () => {
      // Navigate between pages multiple times
      for (let i = 0; i < 5; i++) {
        cy.visit('/signin');
        cy.visit('/signup');
      }
      
      // Check that memory usage is reasonable
      cy.window().then((win) => {
        if (win.performance && win.performance.memory) {
          const usedMemory = win.performance.memory.usedJSHeapSize;
          const limitMemory = win.performance.memory.jsHeapSizeLimit;
          const memoryUsageRatio = usedMemory / limitMemory;
          
          // Memory usage should be less than 50%
          expect(memoryUsageRatio).to.be.lessThan(0.5);
        }
      });
    });
  });
  
  describe('Accessibility Tests', () => {
    it('should have proper ARIA labels', () => {
      cy.visit('/signin');
      
      // Check for ARIA labels on interactive elements
      cy.get('button').each(($button) => {
        cy.wrap($button).should('have.attr', 'aria-label')
          .or('have.attr', 'aria-labelledby')
          .or('contain.text');
      });
      
      cy.get('input').each(($input) => {
        cy.wrap($input).should('have.attr', 'aria-label')
          .or('have.attr', 'aria-labelledby')
          .or('have.attr', 'name');
      });
    });
    
    it('should be keyboard navigable', () => {
      cy.visit('/signin');
      
      // Tab through form elements
      cy.get('body').tab();
      cy.focused().should('have.attr', 'type', 'email');
      
      cy.focused().tab();
      cy.focused().should('have.attr', 'type', 'password');
      
      cy.focused().tab();
      cy.focused().should('have.attr', 'type', 'submit');
    });
  });
});