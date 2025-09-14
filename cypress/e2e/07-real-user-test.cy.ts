/// <reference types="cypress" />

describe('Real User Account Test', () => {
  const timestamp = Date.now();
  const realEmail = `realuser${timestamp}@habitforge.test`;
  const realPassword = 'RealPass123!@#';
  const realName = `Real User ${timestamp}`;

  describe('Create and Use Real Account', () => {
    it('Step 1: Create new account', () => {
      cy.visit('https://habitforge-a1.web.app/signup', { timeout: 30000 });
      
      // Wait for page to fully load
      cy.get('#root', { timeout: 10000 }).should('be.visible');
      
      // Check if form exists
      cy.get('form').should('be.visible');
      
      // Fill the signup form
      cy.get('input[name="name"]').type(realName, { delay: 50 });
      cy.get('input[name="email"]').type(realEmail, { delay: 50 });
      cy.get('input[name="password"]').type(realPassword, { delay: 50 });
      cy.get('input[name="confirmPassword"]').type(realPassword, { delay: 50 });
      
      // Submit form
      cy.get('button[type="submit"]').click();
      
      // Wait for redirect (with longer timeout for account creation)
      cy.url({ timeout: 30000 }).should('include', '/dashboard');
      
      // Verify we're logged in
      cy.contains(realName, { timeout: 10000 }).should('be.visible');
      
      // Store credentials for next tests
      cy.window().then((win) => {
        win.localStorage.setItem('test-email', realEmail);
        win.localStorage.setItem('test-password', realPassword);
        win.localStorage.setItem('test-name', realName);
      });
    });

    it('Step 2: Sign out', () => {
      // Get stored credentials
      cy.window().then((win) => {
        const email = win.localStorage.getItem('test-email') || realEmail;
        const password = win.localStorage.getItem('test-password') || realPassword;
        
        // Sign in first if needed
        cy.visit('https://habitforge-a1.web.app/signin');
        cy.get('input[type="email"]').type(email);
        cy.get('input[type="password"]').type(password);
        cy.get('button[type="submit"]').click();
        cy.url({ timeout: 15000 }).should('include', '/dashboard');
      });
      
      // Now sign out
      cy.get('button, [data-testid="user-menu"]').first().click();
      cy.contains(/sign out|log out/i).click();
      
      // Should redirect to signin
      cy.url().should('include', '/signin');
    });

    it('Step 3: Sign in with created account', () => {
      cy.window().then((win) => {
        const email = win.localStorage.getItem('test-email') || realEmail;
        const password = win.localStorage.getItem('test-password') || realPassword;
        const name = win.localStorage.getItem('test-name') || realName;
        
        cy.visit('https://habitforge-a1.web.app/signin');
        
        // Sign in
        cy.get('input[type="email"]').type(email);
        cy.get('input[type="password"]').type(password);
        cy.get('button[type="submit"]').click();
        
        // Should redirect to dashboard
        cy.url({ timeout: 15000 }).should('include', '/dashboard');
        
        // Should show user name
        cy.contains(name).should('be.visible');
      });
    });

    it('Step 4: Create a habit', () => {
      cy.window().then((win) => {
        const email = win.localStorage.getItem('test-email') || realEmail;
        const password = win.localStorage.getItem('test-password') || realPassword;
        
        // Sign in
        cy.visit('https://habitforge-a1.web.app/signin');
        cy.get('input[type="email"]').type(email);
        cy.get('input[type="password"]').type(password);
        cy.get('button[type="submit"]').click();
        cy.url({ timeout: 15000 }).should('include', '/dashboard');
      });
      
      // Navigate to habits
      cy.visit('https://habitforge-a1.web.app/habits');
      
      // Create new habit
      cy.get('button').contains(/new|add|create|\+/i).click();
      
      // Fill habit form
      const habitName = `Test Habit ${timestamp}`;
      cy.get('input[name="name"]').type(habitName);
      cy.get('select[name="category"]').select('Health');
      cy.get('input[value="build"]').check({ force: true });
      cy.get('select[name="frequency"]').select('Daily');
      cy.get('textarea').first().type('Test habit for E2E testing');
      
      // Submit
      cy.get('button[type="submit"]').click();
      
      // Verify habit created
      cy.url({ timeout: 10000 }).should('include', '/habits');
      cy.contains(habitName).should('be.visible');
    });

    it('Step 5: Complete the habit', () => {
      cy.window().then((win) => {
        const email = win.localStorage.getItem('test-email') || realEmail;
        const password = win.localStorage.getItem('test-password') || realPassword;
        
        // Sign in
        cy.visit('https://habitforge-a1.web.app/signin');
        cy.get('input[type="email"]').type(email);
        cy.get('input[type="password"]').type(password);
        cy.get('button[type="submit"]').click();
        cy.url({ timeout: 15000 }).should('include', '/dashboard');
      });
      
      // Go to dashboard
      cy.visit('https://habitforge-a1.web.app/dashboard');
      
      // Find and complete first habit
      cy.get('[data-testid="habit-card"], .habit-card, article')
        .first()
        .within(() => {
          cy.get('button, input[type="checkbox"]').first().click();
        });
      
      // Should show completion
      cy.contains(/completed|done|✓/i).should('be.visible');
    });
  });
});