/// <reference types="cypress" />

describe('Smoke Tests - Basic App Functionality', () => {
  
  it('should load the homepage', () => {
    cy.visit('/', { timeout: 30000 });
    
    // Check if app loads (either shows auth page or dashboard)
    cy.get('body').should('be.visible');
    
    // Wait for splash screen to disappear if present
    cy.get('#splash-screen', { timeout: 10000 }).should('not.exist');
    
    // Check if main app container exists
    cy.get('#root').should('be.visible');
  });

  it('should have proper page title', () => {
    cy.visit('/');
    cy.title().should('contain', 'HabitForge');
  });

  it('should load authentication page', () => {
    cy.visit('/signin');
    
    // Check for sign in form elements
    cy.get('input[type="email"]', { timeout: 10000 }).should('be.visible');
    cy.get('input[type="password"]').should('be.visible');
    cy.contains(/sign in|log in/i).should('be.visible');
  });

  it('should navigate to sign up page', () => {
    cy.visit('/signup');
    
    // Check for sign up form elements
    cy.get('input[type="email"]', { timeout: 10000 }).should('be.visible');
    cy.get('input[type="password"]').should('be.visible');
    cy.contains(/sign up|create account/i).should('be.visible');
  });

  it('should redirect unauthenticated users to auth', () => {
    cy.visit('/dashboard');
    cy.url().should('include', '/signin');
  });

  it('should load static assets', () => {
    cy.visit('/');
    
    // Check if CSS is loaded
    cy.document().then((doc) => {
      const styleSheets = doc.styleSheets;
      expect(styleSheets.length).to.be.greaterThan(0);
    });
    
    // Check if JavaScript is loaded and executed
    cy.window().then((win) => {
      // Check that window is defined and has expected properties
      expect(win).to.exist;
      expect(win.document).to.exist;
    });
  });

  it('should not have console errors', () => {
    let consoleErrors = [];
    
    cy.on('window:before:load', (win) => {
      const originalError = win.console.error;
      win.console.error = (...args) => {
        consoleErrors.push(args.join(' '));
        originalError.apply(win.console, args);
      };
    });
    
    cy.visit('/');
    cy.wait(3000);
    
    cy.then(() => {
      // Filter out expected warnings
      const criticalErrors = consoleErrors.filter(error => 
        !error.includes('Firebase') &&
        !error.includes('analytics') &&
        !error.includes('ResizeObserver') &&
        !error.includes('DevTools')
      );
      
      expect(criticalErrors).to.have.length(0);
    });
  });
});