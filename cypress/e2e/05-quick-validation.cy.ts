/// <reference types="cypress" />

describe('Quick Validation Tests', () => {
  
  it('1. Homepage loads', () => {
    cy.visit('https://habitforge-a1.web.app');
    cy.get('#root', { timeout: 10000 }).should('be.visible');
  });

  it('2. Signin page loads', () => {
    cy.visit('https://habitforge-a1.web.app/signin');
    cy.get('input[type="email"]', { timeout: 10000 }).should('be.visible');
  });

  it('3. Signup page loads', () => {
    cy.visit('https://habitforge-a1.web.app/signup');
    cy.get('input[type="email"]', { timeout: 10000 }).should('be.visible');
  });

  it('4. Can create account', () => {
    const timestamp = Date.now();
    const email = `quick${timestamp}@test.com`;
    
    cy.visit('https://habitforge-a1.web.app/signup');
    
    // Fill minimal required fields
    cy.get('input').first().type(`Quick Test ${timestamp}`);
    cy.get('input[type="email"]').type(email);
    cy.get('input[type="password"]').first().type('Test123!@#');
    cy.get('input[type="password"]').last().type('Test123!@#');
    
    cy.get('button[type="submit"]').click();
    
    // Check for success (redirect or error)
    cy.url({ timeout: 20000 }).then(url => {
      expect(url).to.satisfy((u) => 
        u.includes('/dashboard') || u.includes('/onboarding')
      );
    });
  });
});