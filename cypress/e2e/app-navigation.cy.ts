describe('HabitForge App Navigation', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should load the homepage', () => {
    cy.contains('h1', 'Transform Your Life').should('be.visible');
    cy.contains('Build habits that last').should('be.visible');
    cy.get('button').contains('Get Started').should('be.visible');
    cy.get('a').contains('Login').should('be.visible');
  });

  it('should navigate to login page', () => {
    cy.get('a').contains('Login').click();
    cy.url().should('include', '/login');
    cy.contains('h2', 'Welcome Back').should('be.visible');
    cy.get('input[type="email"]').should('be.visible');
    cy.get('input[type="password"]').should('be.visible');
    cy.get('button[type="submit"]').contains('Login').should('be.visible');
  });

  it('should navigate to signup page', () => {
    cy.get('button').contains('Get Started').click();
    cy.url().should('include', '/signup');
    cy.contains('h2', 'Create Your Account').should('be.visible');
    cy.get('input[placeholder="John Doe"]').should('be.visible');
    cy.get('input[type="email"]').should('be.visible');
    cy.get('input[type="password"]').should('be.visible');
    cy.get('button[type="submit"]').contains('Sign Up').should('be.visible');
  });

  it('should show form validation errors', () => {
    cy.visit('/login');
    cy.get('button[type="submit"]').click();
    cy.contains('Email is required').should('be.visible');
    cy.contains('Password is required').should('be.visible');
  });

  it('should show password requirements on signup', () => {
    cy.visit('/signup');
    cy.get('input[type="password"]').type('weak');
    cy.get('button[type="submit"]').click();
    cy.contains('Password must be at least 8 characters').should('be.visible');
  });

  it('should handle responsive navigation', () => {
    // Mobile view
    cy.viewport(375, 667);
    cy.visit('/');
    cy.contains('Transform Your Life').should('be.visible');
    
    // Tablet view
    cy.viewport(768, 1024);
    cy.contains('Transform Your Life').should('be.visible');
    
    // Desktop view
    cy.viewport(1920, 1080);
    cy.contains('Transform Your Life').should('be.visible');
  });
});

describe('HabitForge Dashboard (Mock Auth)', () => {
  beforeEach(() => {
    // Mock authentication by setting local storage
    cy.window().then((win) => {
      win.localStorage.setItem('auth-storage', JSON.stringify({
        state: {
          user: {
            uid: 'test-user',
            email: 'test@example.com',
            displayName: 'Test User',
            photoURL: null
          },
          isAuthenticated: true
        }
      }));
    });
  });

  it('should show dashboard when authenticated', () => {
    cy.visit('/dashboard');
    cy.contains('Your Habits').should('be.visible');
    cy.contains('Statistics').should('be.visible');
  });

  it('should show habits page', () => {
    cy.visit('/habits');
    cy.contains('h1', 'My Habits').should('be.visible');
    cy.contains('button', 'New Habit').should('be.visible');
  });
});

describe('HabitForge UI Components', () => {
  it('should render all key UI elements on homepage', () => {
    cy.visit('/');
    
    // Check hero section
    cy.get('.text-6xl').should('exist');
    cy.get('.text-xl').should('exist');
    
    // Check buttons
    cy.get('button').should('have.length.at.least', 1);
    
    // Check navigation
    cy.get('nav').should('exist');
    
    // Check feature cards
    cy.get('.grid').should('exist');
  });

  it('should have proper form elements', () => {
    cy.visit('/signup');
    
    // Check all form fields
    cy.get('form').within(() => {
      cy.get('input[name="name"]').should('exist');
      cy.get('input[name="email"]').should('exist');
      cy.get('input[name="password"]').should('exist');
      cy.get('button[type="submit"]').should('exist');
    });
  });
});

describe('HabitForge Admin Panel (Mock Admin)', () => {
  beforeEach(() => {
    // Mock admin authentication
    cy.window().then((win) => {
      win.localStorage.setItem('auth-storage', JSON.stringify({
        state: {
          user: {
            uid: 'admin-user',
            email: 'admin@habitforge.com',
            displayName: 'Admin User',
            isAdmin: true,
            photoURL: null
          },
          isAuthenticated: true
        }
      }));
    });
  });

  it('should access admin dashboard', () => {
    cy.visit('/admin/dashboard');
    cy.contains('Admin Dashboard').should('be.visible');
    cy.contains('System overview').should('be.visible');
  });

  it('should access user management', () => {
    cy.visit('/admin/users');
    cy.contains('User Management').should('be.visible');
    cy.get('input[placeholder="Search users..."]').should('be.visible');
  });
});