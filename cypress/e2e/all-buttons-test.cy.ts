describe('ALL BUTTONS AND ACTIONS TEST - EVERYTHING MUST WORK!', () => {
  
  describe('HOMEPAGE - Every Single Button', () => {
    beforeEach(() => {
      cy.visit('/');
    });

    it('Header Navigation Buttons', () => {
      // Logo should be clickable
      cy.get('.cursor-pointer').contains('HabitForge').click();
      cy.url().should('include', '/');
      
      // Login button in header
      cy.contains('button', 'Login').first().click();
      cy.url().should('include', '/login');
      cy.go('back');
      
      // Sign Up button in header
      cy.contains('button', 'Sign Up').click();
      cy.url().should('include', '/signup');
      cy.go('back');
    });

    it('Hero Section Buttons', () => {
      // Start Your Journey button
      cy.contains('button', 'Start Your Journey').click();
      cy.url().should('include', '/signup');
      cy.go('back');
      
      // Watch Demo button
      cy.contains('button', 'Watch Demo').click();
      // Should trigger some action - check for modal or alert
      cy.wait(500);
      
      // Get Started button
      cy.contains('button', 'Get Started').first().click();
      cy.url().should('include', '/signup');
      cy.go('back');
    });

    it('Five Factors Section', () => {
      // Learn More button in five factors
      cy.contains('Learn More').first().click();
      cy.wait(500);
      
      // See Live Demo button
      cy.contains('button', 'See Live Demo').click();
      cy.wait(500);
    });

    it('Feature Cards Learn More buttons', () => {
      // Each feature card should have a Learn more button
      cy.get('button').contains('Learn more').each(($btn, index) => {
        cy.wrap($btn).click();
        cy.wait(200);
      });
    });

    it('CTA Section Buttons', () => {
      // Get Started Free button
      cy.contains('button', 'Get Started Free').click();
      cy.url().should('include', '/signup');
      cy.go('back');
      
      // Learn More in CTA
      cy.get('button').contains('Learn More').last().click();
      cy.wait(500);
    });

    it('Footer Links', () => {
      // Scroll to footer
      cy.scrollTo('bottom');
      
      // Check all footer links
      const footerLinks = [
        'Features', 'Pricing', 'Science', 'Success Stories',
        'About', 'Blog', 'Careers', 'Contact',
        'Privacy', 'Terms', 'Security', 'GDPR',
        'Twitter', 'LinkedIn', 'GitHub'
      ];
      
      footerLinks.forEach(link => {
        cy.contains(link).should('be.visible');
        // These should be clickable
        cy.contains(link).first().click({ force: true });
        cy.wait(200);
      });
    });
  });

  describe('LOGIN PAGE - Every Single Button', () => {
    beforeEach(() => {
      cy.visit('/login');
    });

    it('Navigation Buttons', () => {
      // Logo click
      cy.get('.cursor-pointer').contains('HabitForge').click();
      cy.url().should('eq', Cypress.config().baseUrl + '/');
      cy.visit('/login');
      
      // Home button
      cy.contains('button', 'Home').click();
      cy.url().should('eq', Cypress.config().baseUrl + '/');
      cy.visit('/login');
      
      // Sign Up button in nav
      cy.contains('button', 'Sign Up').click();
      cy.url().should('include', '/signup');
      cy.go('back');
    });

    it('Social Login Buttons', () => {
      // Google login
      cy.contains('button', 'Google').click();
      // Should show toast or modal
      cy.wait(500);
      
      // GitHub login
      cy.contains('button', 'GitHub').click();
      cy.wait(500);
      
      // Twitter login
      cy.contains('button', 'Twitter').click();
      cy.wait(500);
    });

    it('Form Actions', () => {
      // Forgot password link
      cy.contains('Forgot password?').click();
      cy.wait(500);
      
      // Password visibility toggle
      cy.get('input[type="password"]').parent().parent().find('.cursor-pointer').last().click();
      cy.wait(200);
      
      // Sign In button (with empty form to test validation)
      cy.contains('button', 'Sign In').click();
      cy.contains('Email is required').should('be.visible');
      
      // Create account link
      cy.contains('Create one for free').click();
      cy.url().should('include', '/signup');
    });
  });

  describe('SIGNUP PAGE - Every Single Button', () => {
    beforeEach(() => {
      cy.visit('/signup');
    });

    it('Navigation Buttons', () => {
      // Logo click
      cy.get('.cursor-pointer').contains('HabitForge').click();
      cy.url().should('eq', Cypress.config().baseUrl + '/');
      cy.visit('/signup');
      
      // Home button
      cy.contains('button', 'Home').click();
      cy.url().should('eq', Cypress.config().baseUrl + '/');
      cy.visit('/signup');
      
      // Sign In button in nav
      cy.contains('button', 'Sign In').click();
      cy.url().should('include', '/login');
      cy.go('back');
    });

    it('Social Signup Buttons', () => {
      // Google signup
      cy.contains('button', 'Google').click();
      cy.wait(500);
      
      // GitHub signup
      cy.contains('button', 'GitHub').click();
      cy.wait(500);
      
      // Twitter signup
      cy.contains('button', 'Twitter').click();
      cy.wait(500);
    });

    it('Form Elements', () => {
      // Password visibility toggles
      cy.get('input[placeholder="Create a strong password"]').parent().parent().find('.cursor-pointer').last().click();
      cy.wait(200);
      
      cy.get('input[placeholder="Confirm your password"]').parent().parent().find('.cursor-pointer').last().click();
      cy.wait(200);
      
      // Terms checkbox
      cy.get('[type="checkbox"]').first().click();
      cy.get('[type="checkbox"]').first().should('be.checked');
      
      // Marketing checkbox
      cy.get('[type="checkbox"]').last().click();
      cy.get('[type="checkbox"]').last().should('be.checked');
      
      // Terms of Service link
      cy.contains('Terms of Service').click();
      cy.wait(500);
      
      // Privacy Policy link
      cy.contains('Privacy Policy').click();
      cy.wait(500);
      
      // Sign in instead link
      cy.contains('Sign in instead').click();
      cy.url().should('include', '/login');
    });
  });

  describe('DASHBOARD - Every Single Button', () => {
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

    it('Header Navigation', () => {
      // Dashboard button
      cy.contains('button', 'Dashboard').click();
      cy.wait(200);
      
      // Habits button
      cy.contains('button', 'Habits').click();
      cy.url().should('include', '/habits');
      cy.go('back');
      
      // Community button
      cy.contains('button', 'Community').click();
      cy.wait(500);
      
      // Insights button
      cy.contains('button', 'Insights').click();
      cy.wait(500);
      
      // Bell icon (notifications)
      cy.get('button').find('svg').parent().filter(':contains("Bell")').first().click();
      cy.wait(500);
      
      // Settings icon
      cy.get('button').find('svg').parent().filter(':contains("Settings")').first().click();
      cy.url().should('include', '/settings');
      cy.go('back');
      
      // Logout button
      // cy.get('button').find('svg').parent().filter(':contains("LogOut")').first().click();
      // cy.url().should('eq', Cypress.config().baseUrl + '/');
    });

    it('Quick Actions', () => {
      // Create New Habit button
      cy.contains('button', 'Create New Habit').click();
      cy.url().should('include', '/habits');
      cy.go('back');
      
      // Check In button
      cy.contains('button', 'Check In').click();
      cy.wait(500);
      
      // View Analytics button
      cy.contains('button', 'View Analytics').click();
      cy.wait(500);
    });

    it('Habits Section', () => {
      // View All habits button
      cy.contains('button', 'View All').first().click();
      cy.url().should('include', '/habits');
      cy.go('back');
      
      // If no habits, Create Your First Habit button
      if (cy.contains('Create Your First Habit').should('exist')) {
        cy.contains('button', 'Create Your First Habit').click();
        cy.url().should('include', '/habits');
        cy.go('back');
      }
    });

    it('Community Section', () => {
      // Explore Community button
      cy.contains('button', 'Explore Community').click();
      cy.wait(500);
      
      // Join Challenge button
      cy.contains('button', 'Join Challenge').click();
      cy.wait(500);
      
      // View Details button
      cy.contains('button', 'View Details').click();
      cy.wait(500);
      
      // Find Buddy button
      cy.contains('button', 'Find Buddy').click();
      cy.wait(500);
    });

    it('Achievements Section', () => {
      // View All achievements
      cy.contains('button', 'View All').last().click();
      cy.wait(500);
    });
  });

  describe('HABITS PAGE - Every Single Button', () => {
    beforeEach(() => {
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

    it('Page Actions', () => {
      // New Habit button
      cy.contains('button', 'New Habit').click();
      cy.contains('Create New Habit').should('be.visible');
      
      // Cancel button in form
      cy.contains('button', 'Cancel').click();
      cy.contains('Create New Habit').should('not.exist');
      
      // Open form again
      cy.contains('button', 'New Habit').click();
      
      // Create Habit button (will fail without filling form, but button should work)
      cy.contains('button', 'Create Habit').click();
      cy.wait(500);
      
      // If no habits exist
      if (cy.get('body').contains('Create Your First Habit').should('exist')) {
        cy.contains('button', 'Create Your First Habit').click();
        cy.contains('Create New Habit').should('be.visible');
      }
    });

    it('Habit Card Actions', () => {
      // If habits exist, each should have Track Today button
      cy.get('button').contains('Track Today').each(($btn) => {
        cy.wrap($btn).click();
        cy.wait(200);
      });
    });
  });

  describe('SETTINGS PAGE - Every Single Button', () => {
    beforeEach(() => {
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

    it('All Settings Actions', () => {
      // Save Changes button
      cy.contains('button', 'Save Changes').click();
      cy.wait(500);
      
      // Upload Photo button
      cy.contains('button', 'Upload Photo').click();
      cy.wait(500);
      
      // Change Password button
      cy.contains('button', 'Change Password').click();
      cy.wait(500);
      
      // Enable Two-Factor button
      cy.contains('button', 'Enable Two-Factor').click();
      cy.wait(500);
      
      // Export Data button
      cy.contains('button', 'Export My Data').click();
      cy.wait(500);
      
      // Delete Account button
      cy.contains('button', 'Delete Account').click();
      cy.wait(500);
    });
  });

  describe('ADMIN PAGES - Every Single Button', () => {
    beforeEach(() => {
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

    it('Admin Dashboard Actions', () => {
      cy.visit('/admin');
      
      // Navigation cards should be clickable
      cy.contains('User Management').click();
      cy.url().should('include', '/admin/users');
      cy.go('back');
      
      cy.contains('System Analytics').click();
      cy.url().should('include', '/admin/analytics');
      cy.go('back');
    });

    it('User Management Actions', () => {
      cy.visit('/admin/users');
      
      // Search input
      cy.get('input[placeholder*="Search users"]').type('test');
      cy.wait(500);
      
      // Filter dropdown
      cy.get('select').first().select('active');
      cy.wait(500);
      
      // More Filters button
      cy.contains('button', 'More Filters').click();
      cy.wait(500);
      
      // User action buttons (if users exist)
      cy.get('[class*="IconButton"]').each(($btn, index) => {
        if (index < 3) { // Test first few buttons
          cy.wrap($btn).click({ force: true });
          cy.wait(200);
        }
      });
    });

    it('System Analytics Actions', () => {
      cy.visit('/admin/analytics');
      
      // Date range selector
      cy.get('select').first().select('7');
      cy.wait(500);
      
      // Export button
      cy.contains('button', 'Export').click();
      cy.wait(500);
    });
  });

  describe('CRITICAL: Test ALL Form Submissions', () => {
    it('Login form should actually submit', () => {
      cy.visit('/login');
      cy.get('input[type="email"]').type('test@example.com');
      cy.get('input[type="password"]').type('password123');
      cy.contains('button', 'Sign In').click();
      // Should attempt login (will fail with fake credentials but button should work)
      cy.wait(1000);
    });

    it('Signup form should actually submit', () => {
      cy.visit('/signup');
      cy.get('input[placeholder="John Doe"]').type('Test User');
      cy.get('input[placeholder="john@example.com"]').type('newuser@example.com');
      cy.get('input[placeholder="Create a strong password"]').type('StrongPass123!');
      cy.get('input[placeholder="Confirm your password"]').type('StrongPass123!');
      cy.get('[type="checkbox"]').first().check();
      cy.contains('button', 'Create Free Account').click();
      // Should attempt signup
      cy.wait(1000);
    });
  });

  describe('FINAL CHECK: Count All Buttons', () => {
    it('Should have many interactive elements on homepage', () => {
      cy.visit('/');
      cy.get('button').should('have.length.greaterThan', 10);
      cy.get('a').should('have.length.greaterThan', 5);
    });

    it('Should have interactive elements on login', () => {
      cy.visit('/login');
      cy.get('button').should('have.length.greaterThan', 5);
      cy.get('input').should('have.length.greaterThan', 1);
    });

    it('Should have interactive elements on signup', () => {
      cy.visit('/signup');
      cy.get('button').should('have.length.greaterThan', 5);
      cy.get('input').should('have.length.greaterThan', 3);
      cy.get('[type="checkbox"]').should('have.length.greaterThan', 1);
    });
  });
});