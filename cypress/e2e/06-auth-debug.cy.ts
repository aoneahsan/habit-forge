/// <reference types="cypress" />

describe('Authentication Debug Tests', () => {
  const timestamp = Date.now();
  const testEmail = `debug${timestamp}@test.com`;
  const testPassword = 'TestPass123!';
  const testName = `Debug User ${timestamp}`;

  it('should inspect signup form structure', () => {
    cy.visit('https://habitforge-a1.web.app/signup');
    
    // Log all input fields found
    cy.get('input').each(($input, index) => {
      cy.log(`Input ${index}: type=${$input.attr('type')}, name=${$input.attr('name')}, id=${$input.attr('id')}`);
    });
    
    // Check for specific fields
    cy.get('input[name="name"]').should('exist');
    cy.get('input[name="email"]').should('exist');
    cy.get('input[name="password"]').should('exist');
    cy.get('input[name="confirmPassword"]').should('exist');
  });

  it('should fill and submit signup form correctly', () => {
    cy.visit('https://habitforge-a1.web.app/signup');
    
    // Wait for form to be ready
    cy.wait(2000);
    
    // Fill in the form using name attributes
    cy.get('input[name="name"]').type(testName);
    cy.get('input[name="email"]').type(testEmail);
    cy.get('input[name="password"]').type(testPassword);
    cy.get('input[name="confirmPassword"]').type(testPassword);
    
    // Take a screenshot before submitting
    cy.screenshot('before-submit');
    
    // Submit the form
    cy.get('button[type="submit"]').click();
    
    // Wait for response
    cy.wait(5000);
    
    // Take a screenshot after submitting
    cy.screenshot('after-submit');
    
    // Check the URL
    cy.url().then(url => {
      cy.log(`Current URL: ${url}`);
    });
    
    // Check for any error messages
    cy.get('body').then($body => {
      if ($body.text().includes('error') || $body.text().includes('Error')) {
        cy.log('Error found on page');
        cy.screenshot('error-state');
      }
    });
  });

  it('should check Firebase configuration', () => {
    cy.visit('https://habitforge-a1.web.app');
    
    cy.window().then((win) => {
      // Check if Firebase is loaded
      cy.log('Checking for Firebase in window');
      
      // Check localStorage for any Firebase data
      const storage = win.localStorage;
      Object.keys(storage).forEach(key => {
        if (key.includes('firebase') || key.includes('auth')) {
          cy.log(`Found key: ${key}`);
        }
      });
    });
  });

  it('should test signin with error details', () => {
    cy.visit('https://habitforge-a1.web.app/signin');
    
    // Try to sign in with non-existent account
    cy.get('input[type="email"]').type('nonexistent@test.com');
    cy.get('input[type="password"]').type('TestPass123!');
    cy.get('button[type="submit"]').click();
    
    // Wait for error
    cy.wait(3000);
    
    // Check for error message
    cy.get('[role="alert"], .error, [class*="error"], [class*="danger"]').should('exist');
    
    // Log the error text
    cy.get('body').then($body => {
      const text = $body.text();
      if (text.includes('error') || text.includes('Error')) {
        cy.log('Error text found:', text.match(/.*error.*/gi));
      }
    });
  });

  it('should check console for errors', () => {
    let consoleErrors = [];
    
    cy.on('window:before:load', (win) => {
      const originalError = win.console.error;
      win.console.error = (...args) => {
        consoleErrors.push(args.join(' '));
        originalError.apply(win.console, args);
      };
    });
    
    cy.visit('https://habitforge-a1.web.app/signup');
    cy.wait(3000);
    
    cy.then(() => {
      if (consoleErrors.length > 0) {
        cy.log('Console errors found:');
        consoleErrors.forEach(error => {
          cy.log(error);
        });
      } else {
        cy.log('No console errors found');
      }
    });
  });
});