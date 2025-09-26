describe('HabitForge Comprehensive Test', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('Homepage Tests', () => {
    it('should display all homepage sections', () => {
      // Hero section
      cy.contains('Transform Your Life').should('be.visible');
      cy.contains('Science-Backed Habit Building').should('be.visible');
      cy.contains('Start Your Journey').should('be.visible');
      
      // Stats
      cy.contains('50,000+').should('be.visible');
      cy.contains('Active Users').should('be.visible');
      
      // Five factors
      cy.contains('Master the Five-Factor System').should('be.visible');
      cy.contains('Location').should('be.visible');
      cy.contains('Emotion').should('be.visible');
      cy.contains('People').should('be.visible');
      cy.contains('Time').should('be.visible');
      cy.contains('Trigger').should('be.visible');
      
      // Features
      cy.contains('Five-Factor Tracking').should('be.visible');
      cy.contains('Rope Visualization').should('be.visible');
      cy.contains('AI-Powered Insights').should('be.visible');
      cy.contains('Community & Accountability').should('be.visible');
      
      // Testimonials
      cy.contains('Sarah Chen').should('be.visible');
      cy.contains('Michael Rodriguez').should('be.visible');
      
      // CTA
      cy.contains('Get Started Free').should('be.visible');
      
      // Footer
      cy.contains('© 2024 HabitForge').should('be.visible');
    });

    it('should navigate to signup from hero button', () => {
      cy.contains('button', 'Start Your Journey').first().click();
      cy.url().should('include', '/signup');
      cy.contains('Create Your Account').should('be.visible');
    });

    it('should navigate to login from nav button', () => {
      cy.contains('button', 'Login').first().click();
      cy.url().should('include', '/login');
      cy.contains('Sign In to Your Account').should('be.visible');
    });
  });

  describe('Login Page Tests', () => {
    beforeEach(() => {
      cy.visit('/login');
    });

    it('should display all login page elements', () => {
      // Header
      cy.contains('Sign In to Your Account').should('be.visible');
      cy.contains('Continue your habit journey').should('be.visible');
      
      // Social login buttons
      cy.contains('button', 'Google').should('be.visible');
      cy.contains('button', 'GitHub').should('be.visible');
      cy.contains('button', 'Twitter').should('be.visible');
      
      // Form fields
      cy.get('input[type="email"]').should('be.visible');
      cy.get('input[type="password"]').should('be.visible');
      
      // Links
      cy.contains('Forgot password?').should('be.visible');
      cy.contains('Create one for free').should('be.visible');
      
      // Security badge
      cy.contains('Secure login with end-to-end encryption').should('be.visible');
      
      // Side panel features
      cy.contains('Everything you need to build lasting habits').should('be.visible');
    });

    it('should validate empty form submission', () => {
      cy.contains('button', 'Sign In').click();
      cy.contains('Email is required').should('be.visible');
      cy.contains('Password is required').should('be.visible');
    });

    it('should validate email format', () => {
      cy.get('input[type="email"]').type('invalid-email');
      cy.contains('button', 'Sign In').click();
      cy.contains('Invalid email format').should('be.visible');
    });

    it('should validate password length', () => {
      cy.get('input[type="email"]').type('test@example.com');
      cy.get('input[type="password"]').type('123');
      cy.contains('button', 'Sign In').click();
      cy.contains('Password must be at least 6 characters').should('be.visible');
    });

    it('should toggle password visibility', () => {
      cy.get('input[type="password"]').type('testpassword');
      cy.get('input[type="password"]').should('have.attr', 'type', 'password');
      
      // Click eye icon (within the password field container)
      cy.get('input[type="password"]').parent().parent().find('[class*="cursor-pointer"]').last().click();
      cy.get('input[type="text"][placeholder*="••••"]').should('exist');
    });

    it('should navigate to signup page', () => {
      cy.contains('Create one for free').click();
      cy.url().should('include', '/signup');
    });

    it('should navigate back to home', () => {
      cy.contains('button', 'Home').click();
      cy.url().should('eq', Cypress.config().baseUrl + '/');
    });
  });

  describe('Sign Up Page Tests', () => {
    beforeEach(() => {
      cy.visit('/signup');
    });

    it('should display all signup page elements', () => {
      // Header
      cy.contains('Create Your Account').should('be.visible');
      cy.contains('Join thousands building lasting habits').should('be.visible');
      
      // Benefits
      cy.contains('Track unlimited habits for free').should('be.visible');
      cy.contains('Science-backed methodology').should('be.visible');
      cy.contains('Beautiful visualizations').should('be.visible');
      
      // Form fields
      cy.get('input[placeholder="John Doe"]').should('be.visible');
      cy.get('input[placeholder="john@example.com"]').should('be.visible');
      cy.get('input[placeholder="Create a strong password"]').should('be.visible');
      cy.get('input[placeholder="Confirm your password"]').should('be.visible');
      
      // Checkboxes
      cy.contains('I agree to the Terms of Service').should('be.visible');
      cy.contains('Send me tips and updates').should('be.visible');
      
      // Trust badges
      cy.contains('SSL Secured').should('be.visible');
      cy.contains('GDPR Compliant').should('be.visible');
    });

    it('should show password strength indicator', () => {
      const passwordField = cy.get('input[placeholder="Create a strong password"]');
      
      // Weak password
      passwordField.type('weak');
      cy.contains('Weak').should('be.visible');
      
      // Strong password
      passwordField.clear().type('StrongPass123!@#');
      cy.contains(/Good|Strong/).should('be.visible');
      
      // Password requirements
      cy.contains('At least 8 characters').should('be.visible');
      cy.contains('One uppercase letter').should('be.visible');
    });

    it('should validate password confirmation', () => {
      cy.get('input[placeholder="Create a strong password"]').type('TestPassword123!');
      cy.get('input[placeholder="Confirm your password"]').type('DifferentPassword');
      cy.contains('Passwords do not match').should('be.visible');
    });

    it('should require terms acceptance', () => {
      // Fill form without checking terms
      cy.get('input[placeholder="John Doe"]').type('Test User');
      cy.get('input[placeholder="john@example.com"]').type('test@example.com');
      cy.get('input[placeholder="Create a strong password"]').type('TestPassword123!');
      cy.get('input[placeholder="Confirm your password"]').type('TestPassword123!');
      
      // Button should be disabled without terms
      cy.contains('button', 'Create Free Account').should('be.disabled');
      
      // Check terms
      cy.get('[type="checkbox"]').first().check();
      cy.contains('button', 'Create Free Account').should('not.be.disabled');
    });

    it('should navigate to login page', () => {
      cy.contains('Sign in instead').click();
      cy.url().should('include', '/login');
    });
  });

  describe('Dashboard Tests (Mock Auth)', () => {
    beforeEach(() => {
      // Mock authentication
      cy.window().then((win) => {
        win.localStorage.setItem('auth-storage', JSON.stringify({
          state: {
            user: {
              uid: 'test-user',
              email: 'test@example.com',
              displayName: 'Test User'
            },
            isAuthenticated: true
          }
        }));
      });
      cy.visit('/dashboard');
    });

    it('should display dashboard with all sections', () => {
      // Welcome message
      cy.contains(/Good morning|Good afternoon|Good evening/).should('be.visible');
      
      // Stats cards
      cy.contains('Active Habits').should('be.visible');
      cy.contains('Total Streak Days').should('be.visible');
      cy.contains('Achievements').should('be.visible');
      cy.contains("Today's Progress").should('be.visible');
      
      // Quick actions
      cy.contains('button', 'Create New Habit').should('be.visible');
      cy.contains('button', 'Check In').should('be.visible');
      cy.contains('button', 'View Analytics').should('be.visible');
      
      // Community section
      cy.contains('Community Highlights').should('be.visible');
      cy.contains('30-Day Meditation').should('be.visible');
      
      // Achievements
      cy.contains('Recent Achievements').should('be.visible');
    });

    it('should navigate to habits page', () => {
      cy.contains('button', 'Habits').click();
      cy.url().should('include', '/habits');
    });

    it('should have logout functionality', () => {
      cy.get('button').find('svg').parent().filter(':has([class*="LogOut"])').click();
      cy.url().should('eq', Cypress.config().baseUrl + '/');
    });
  });

  describe('Habits Page Tests', () => {
    beforeEach(() => {
      // Mock authentication
      cy.window().then((win) => {
        win.localStorage.setItem('auth-storage', JSON.stringify({
          state: {
            user: {
              uid: 'test-user',
              email: 'test@example.com',
              displayName: 'Test User'
            },
            isAuthenticated: true
          }
        }));
      });
      cy.visit('/habits');
    });

    it('should display habits page', () => {
      cy.contains('My Habits').should('be.visible');
      cy.contains('button', 'New Habit').should('be.visible');
    });

    it('should show create habit form', () => {
      cy.contains('button', 'New Habit').click();
      cy.contains('Create New Habit').should('be.visible');
      
      // Form fields
      cy.get('input[placeholder*="Morning meditation"]').should('be.visible');
      cy.contains('Category').should('be.visible');
      cy.contains('Type').should('be.visible');
      cy.contains('Duration (days)').should('be.visible');
    });

    it('should fill and cancel habit form', () => {
      cy.contains('button', 'New Habit').click();
      
      // Fill form
      cy.get('input[placeholder*="Morning meditation"]').type('Test Habit');
      cy.get('textarea').type('Test description');
      
      // Cancel
      cy.contains('button', 'Cancel').click();
      cy.contains('Create New Habit').should('not.exist');
    });
  });

  describe('Settings Page Tests', () => {
    beforeEach(() => {
      // Mock authentication
      cy.window().then((win) => {
        win.localStorage.setItem('auth-storage', JSON.stringify({
          state: {
            user: {
              uid: 'test-user',
              email: 'test@example.com',
              displayName: 'Test User'
            },
            isAuthenticated: true
          }
        }));
      });
      cy.visit('/settings');
    });

    it('should display settings page', () => {
      cy.contains('Settings').should('be.visible');
      cy.contains('Profile Settings').should('be.visible');
      cy.contains('Notification Preferences').should('be.visible');
      cy.contains('Privacy & Security').should('be.visible');
    });
  });

  describe('Admin Panel Tests', () => {
    beforeEach(() => {
      // Mock admin authentication
      cy.window().then((win) => {
        win.localStorage.setItem('auth-storage', JSON.stringify({
          state: {
            user: {
              uid: 'admin-user',
              email: 'admin@example.com',
              displayName: 'Admin User',
              isAdmin: true
            },
            isAuthenticated: true
          }
        }));
      });
    });

    it('should display admin dashboard', () => {
      cy.visit('/admin');
      cy.contains('Admin Dashboard').should('be.visible');
      cy.contains('System Overview').should('be.visible');
    });

    it('should navigate to user management', () => {
      cy.visit('/admin/users');
      cy.contains('User Management').should('be.visible');
      cy.get('input[placeholder*="Search users"]').should('be.visible');
    });

    it('should navigate to system analytics', () => {
      cy.visit('/admin/analytics');
      cy.contains('System Analytics').should('be.visible');
    });
  });

  describe('Responsive Design Tests', () => {
    it('should be responsive on mobile', () => {
      cy.viewport('iphone-x');
      cy.visit('/');
      
      // Main content should be visible
      cy.contains('Transform Your Life').should('be.visible');
      cy.contains('Start Your Journey').should('be.visible');
    });

    it('should handle tablet viewport', () => {
      cy.viewport('ipad-2');
      cy.visit('/');
      
      cy.contains('Transform Your Life').should('be.visible');
      cy.contains('Five-Factor Tracking').should('be.visible');
    });
  });

  describe('Navigation Tests', () => {
    it('should navigate through all public pages', () => {
      // Home -> Login
      cy.contains('button', 'Login').first().click();
      cy.url().should('include', '/login');
      
      // Login -> Sign Up
      cy.contains('Create one for free').click();
      cy.url().should('include', '/signup');
      
      // Sign Up -> Login
      cy.contains('Sign in instead').click();
      cy.url().should('include', '/login');
      
      // Login -> Home
      cy.contains('button', 'Home').click();
      cy.url().should('eq', Cypress.config().baseUrl + '/');
    });
  });
});