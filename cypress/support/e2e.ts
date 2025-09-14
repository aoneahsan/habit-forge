// ***********************************************************
// This file is processed and loaded automatically before
// test files.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Add global configuration
beforeEach(() => {
  // Clear test data before each test
  cy.clearTestData();
  
  // Set default timeout
  cy.window().then((win) => {
    win.localStorage.setItem('cypress-testing', 'true');
  });
});

// Handle uncaught exceptions
Cypress.on('uncaught:exception', (err, runnable) => {
  // Firebase Analytics errors can be ignored in tests
  if (err.message.includes('Firebase') || err.message.includes('analytics')) {
    return false;
  }
  
  // Ignore ResizeObserver errors
  if (err.message.includes('ResizeObserver')) {
    return false;
  }
  
  // Let other errors fail the test
  return true;
});

// Add screenshot configuration
Cypress.Screenshot.defaults({
  screenshotOnRunFailure: true,
  disableTimersAndAnimations: true,
  scale: false,
});

// Configure viewport for consistent testing
Cypress.config('viewportWidth', 1280);
Cypress.config('viewportHeight', 720);