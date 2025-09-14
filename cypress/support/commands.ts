/// <reference types="cypress" />

// Custom commands for HabitForge E2E tests

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Sign in with email and password
       */
      signIn(email: string, password: string): Chainable<void>;
      
      /**
       * Sign up with email, password, and display name
       */
      signUp(email: string, password: string, displayName: string): Chainable<void>;
      
      /**
       * Sign out the current user
       */
      signOut(): Chainable<void>;
      
      /**
       * Create a new habit
       */
      createHabit(habitData: {
        name: string;
        category: string;
        type: 'build' | 'break' | 'maintain';
        frequency: string;
        description?: string;
      }): Chainable<void>;
      
      /**
       * Complete a habit for today
       */
      completeHabit(habitName: string): Chainable<void>;
      
      /**
       * Navigate to a specific page
       */
      navigateTo(page: 'dashboard' | 'habits' | 'analytics' | 'community' | 'profile' | 'settings'): Chainable<void>;
      
      /**
       * Wait for the app to load
       */
      waitForApp(): Chainable<void>;
      
      /**
       * Clear all test data
       */
      clearTestData(): Chainable<void>;
      
      /**
       * Check if element is visible with retry
       */
      isVisible(selector: string): Chainable<boolean>;
      
      /**
       * Upload a test image
       */
      uploadImage(selector: string, fileName: string): Chainable<void>;
    }
  }
}

// Sign in command
Cypress.Commands.add('signIn', (email: string, password: string) => {
  cy.visit('/signin');
  cy.get('input[type="email"]').type(email);
  cy.get('input[type="password"]').type(password);
  cy.get('button[type="submit"]').contains(/sign in/i).click();
  cy.url().should('include', '/dashboard');
});

// Sign up command
Cypress.Commands.add('signUp', (email: string, password: string, displayName: string) => {
  cy.visit('/signup');
  cy.get('input[placeholder*="name" i]').type(displayName);
  cy.get('input[type="email"]').type(email);
  cy.get('input[type="password"]').first().type(password);
  cy.get('input[type="password"]').last().type(password); // Confirm password
  cy.get('button[type="submit"]').contains(/sign up/i).click();
  cy.url().should('include', '/dashboard');
});

// Sign out command
Cypress.Commands.add('signOut', () => {
  cy.get('[data-testid="user-menu"], button[aria-label*="user" i]').click();
  cy.get('[data-testid="sign-out"], button').contains(/sign out|log out/i).click();
  cy.url().should('include', '/signin');
});

// Create habit command
Cypress.Commands.add('createHabit', (habitData) => {
  cy.navigateTo('habits');
  cy.get('button').contains(/new habit|add habit|create habit/i).click();
  
  // Fill in habit form
  cy.get('input[name="name"], input[placeholder*="habit name" i]').type(habitData.name);
  
  // Select category
  cy.get('select[name="category"], [data-testid="category-select"]').select(habitData.category);
  
  // Select type
  cy.get(`input[value="${habitData.type}"], label`).contains(habitData.type).click();
  
  // Set frequency
  cy.get('select[name="frequency"], [data-testid="frequency-select"]').select(habitData.frequency);
  
  if (habitData.description) {
    cy.get('textarea[name="description"], textarea[placeholder*="description" i]').type(habitData.description);
  }
  
  // Submit form
  cy.get('button[type="submit"]').contains(/create|save|add/i).click();
  
  // Verify habit was created
  cy.contains(habitData.name).should('be.visible');
});

// Complete habit command
Cypress.Commands.add('completeHabit', (habitName: string) => {
  cy.navigateTo('dashboard');
  cy.contains(habitName)
    .parent()
    .find('button[data-testid="complete-habit"], input[type="checkbox"], button')
    .first()
    .click();
  
  // Wait for completion animation/update
  cy.wait(1000);
});

// Navigation command
Cypress.Commands.add('navigateTo', (page: string) => {
  const routes = {
    dashboard: '/dashboard',
    habits: '/habits',
    analytics: '/analytics',
    community: '/community',
    profile: '/profile',
    settings: '/settings',
  };
  
  cy.visit(routes[page]);
  cy.url().should('include', routes[page]);
});

// Wait for app to load
Cypress.Commands.add('waitForApp', () => {
  // Wait for splash screen to disappear
  cy.get('#splash-screen', { timeout: 10000 }).should('not.exist');
  
  // Wait for main app container
  cy.get('#root, [data-testid="app-container"], main').should('be.visible');
  
  // Wait for any loaders to finish
  cy.get('[data-testid="loader"], .loader, .spinner', { timeout: 5000 }).should('not.exist');
});

// Clear test data command
Cypress.Commands.add('clearTestData', () => {
  cy.window().then((win) => {
    win.localStorage.clear();
    win.sessionStorage.clear();
  });
  cy.clearCookies();
  cy.clearLocalStorage();
});

// Check visibility with retry
Cypress.Commands.add('isVisible', (selector: string) => {
  return cy.get('body').then($body => {
    return $body.find(selector).length > 0 && $body.find(selector).is(':visible');
  });
});

// Upload image command
Cypress.Commands.add('uploadImage', (selector: string, fileName: string) => {
  cy.fixture(fileName, 'base64').then(fileContent => {
    cy.get(selector).attachFile({
      fileContent: fileContent.toString(),
      fileName: fileName,
      mimeType: 'image/png',
    });
  });
});

export {};