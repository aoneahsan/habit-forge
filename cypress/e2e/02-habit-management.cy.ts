/// <reference types="cypress" />

describe('Habit Management Tests', () => {
  const timestamp = Date.now();
  const testEmail = `habit.test.${timestamp}@habitforge.test`;
  const testPassword = 'TestPassword123!';
  const testDisplayName = `Habit Tester ${timestamp}`;
  
  before(() => {
    // Create a test account and sign in
    cy.clearTestData();
    cy.visit('/auth/signup');
    cy.waitForApp();
    
    cy.get('input[placeholder*="name" i], input[name="displayName"], input[name="name"]').type(testDisplayName);
    cy.get('input[type="email"]').type(testEmail);
    cy.get('input[type="password"]').first().type(testPassword);
    cy.get('input[type="password"]').last().type(testPassword);
    cy.get('button[type="submit"]').click();
    
    cy.url().should('include', '/dashboard');
  });

  beforeEach(() => {
    // Ensure we're signed in before each test
    cy.window().then((win) => {
      const authData = win.localStorage.getItem('auth');
      if (!authData) {
        cy.signIn(testEmail, testPassword);
      }
    });
    cy.visit('/habits');
    cy.waitForApp();
  });

  describe('Create Habit', () => {
    it('should display create habit button', () => {
      cy.get('button').contains(/new habit|add habit|create habit|\+/i).should('be.visible');
    });

    it('should open create habit form', () => {
      cy.get('button').contains(/new habit|add habit|create habit|\+/i).click();
      cy.contains(/create.*habit|new.*habit|add.*habit/i).should('be.visible');
      cy.get('form, [role="form"]').should('be.visible');
    });

    it('should validate required fields', () => {
      cy.get('button').contains(/new habit|add habit|create habit|\+/i).click();
      cy.get('button[type="submit"]').click();
      cy.contains(/required|enter|provide/i).should('be.visible');
    });

    it('should create a BUILD habit', () => {
      const habitName = `Morning Exercise ${timestamp}`;
      
      cy.get('button').contains(/new habit|add habit|create habit|\+/i).click();
      
      // Fill form
      cy.get('input[name="name"], input[placeholder*="habit name" i]').type(habitName);
      cy.get('select[name="category"], [data-testid="category-select"]').select('Health');
      cy.get('input[value="build"], label').contains(/build/i).click();
      cy.get('select[name="frequency"], [data-testid="frequency-select"]').select('Daily');
      cy.get('textarea[name="description"], textarea[placeholder*="description" i]')
        .type('Daily morning exercise routine for better health');
      
      // Set cue
      cy.get('input[name="cue"], input[placeholder*="cue" i], textarea[name="cue"]')
        .type('After waking up and drinking water');
      
      // Set routine
      cy.get('input[name="routine"], input[placeholder*="routine" i], textarea[name="routine"]')
        .type('20 minutes of cardio and stretching');
      
      // Set reward
      cy.get('input[name="reward"], input[placeholder*="reward" i], textarea[name="reward"]')
        .type('Healthy breakfast and energy boost');
      
      // Submit
      cy.get('button[type="submit"]').contains(/create|save|add/i).click();
      
      // Verify habit was created
      cy.contains(habitName).should('be.visible');
      cy.contains('Health').should('be.visible');
      cy.contains(/build/i).should('be.visible');
    });

    it('should create a BREAK habit', () => {
      const habitName = `Stop Late Night Snacking ${timestamp}`;
      
      cy.get('button').contains(/new habit|add habit|create habit|\+/i).click();
      
      cy.get('input[name="name"], input[placeholder*="habit name" i]').type(habitName);
      cy.get('select[name="category"], [data-testid="category-select"]').select('Health');
      cy.get('input[value="break"], label').contains(/break/i).click();
      cy.get('select[name="frequency"], [data-testid="frequency-select"]').select('Daily');
      cy.get('textarea[name="description"], textarea[placeholder*="description" i]')
        .type('Stop eating snacks after 8 PM');
      
      cy.get('button[type="submit"]').contains(/create|save|add/i).click();
      
      cy.contains(habitName).should('be.visible');
      cy.contains(/break/i).should('be.visible');
    });

    it('should create a MAINTAIN habit', () => {
      const habitName = `Daily Meditation ${timestamp}`;
      
      cy.get('button').contains(/new habit|add habit|create habit|\+/i).click();
      
      cy.get('input[name="name"], input[placeholder*="habit name" i]').type(habitName);
      cy.get('select[name="category"], [data-testid="category-select"]').select('Mindfulness');
      cy.get('input[value="maintain"], label').contains(/maintain/i).click();
      cy.get('select[name="frequency"], [data-testid="frequency-select"]').select('Daily');
      cy.get('textarea[name="description"], textarea[placeholder*="description" i]')
        .type('Maintain daily meditation practice');
      
      cy.get('button[type="submit"]').contains(/create|save|add/i).click();
      
      cy.contains(habitName).should('be.visible');
      cy.contains(/maintain/i).should('be.visible');
    });

    it('should handle different frequencies', () => {
      const frequencies = ['Daily', 'Weekly', 'Monthly'];
      
      frequencies.forEach((frequency, index) => {
        const habitName = `${frequency} Habit ${timestamp}-${index}`;
        
        cy.get('button').contains(/new habit|add habit|create habit|\+/i).click();
        
        cy.get('input[name="name"], input[placeholder*="habit name" i]').type(habitName);
        cy.get('select[name="category"], [data-testid="category-select"]').select('Productivity');
        cy.get('input[value="build"], label').contains(/build/i).click();
        cy.get('select[name="frequency"], [data-testid="frequency-select"]').select(frequency);
        
        cy.get('button[type="submit"]').contains(/create|save|add/i).click();
        
        cy.contains(habitName).should('be.visible');
        cy.contains(frequency).should('be.visible');
      });
    });

    it('should handle all categories', () => {
      const categories = ['Health', 'Productivity', 'Mindfulness', 'Learning', 'Fitness', 'Creativity'];
      
      categories.forEach((category, index) => {
        const habitName = `${category} Test ${timestamp}-${index}`;
        
        cy.get('button').contains(/new habit|add habit|create habit|\+/i).click();
        
        cy.get('input[name="name"], input[placeholder*="habit name" i]').type(habitName);
        cy.get('select[name="category"], [data-testid="category-select"]').select(category);
        cy.get('input[value="build"], label').contains(/build/i).click();
        cy.get('select[name="frequency"], [data-testid="frequency-select"]').select('Daily');
        
        cy.get('button[type="submit"]').contains(/create|save|add/i).click();
        
        cy.contains(habitName).should('be.visible');
        cy.contains(category).should('be.visible');
      });
    });
  });

  describe('Edit Habit', () => {
    const editHabitName = `Edit Test Habit ${timestamp}`;
    
    before(() => {
      // Create a habit to edit
      cy.visit('/habits');
      cy.get('button').contains(/new habit|add habit|create habit|\+/i).click();
      
      cy.get('input[name="name"], input[placeholder*="habit name" i]').type(editHabitName);
      cy.get('select[name="category"], [data-testid="category-select"]').select('Health');
      cy.get('input[value="build"], label').contains(/build/i).click();
      cy.get('select[name="frequency"], [data-testid="frequency-select"]').select('Daily');
      
      cy.get('button[type="submit"]').contains(/create|save|add/i).click();
    });

    it('should open edit form', () => {
      cy.contains(editHabitName)
        .parent()
        .find('button[aria-label*="edit" i], button[aria-label*="more" i], button')
        .contains(/edit|⋮|…/i)
        .click();
      
      cy.contains(/edit.*habit|update.*habit/i).should('be.visible');
    });

    it('should update habit name', () => {
      const updatedName = `${editHabitName} - Updated`;
      
      cy.contains(editHabitName)
        .parent()
        .find('button')
        .contains(/edit|⋮|…/i)
        .click();
      
      cy.get('input[name="name"], input[value*="' + editHabitName + '"]')
        .clear()
        .type(updatedName);
      
      cy.get('button[type="submit"]').contains(/save|update/i).click();
      
      cy.contains(updatedName).should('be.visible');
    });

    it('should update habit category', () => {
      cy.contains(editHabitName)
        .parent()
        .find('button')
        .contains(/edit|⋮|…/i)
        .click();
      
      cy.get('select[name="category"], [data-testid="category-select"]').select('Productivity');
      
      cy.get('button[type="submit"]').contains(/save|update/i).click();
      
      cy.contains('Productivity').should('be.visible');
    });

    it('should update habit frequency', () => {
      cy.contains(editHabitName)
        .parent()
        .find('button')
        .contains(/edit|⋮|…/i)
        .click();
      
      cy.get('select[name="frequency"], [data-testid="frequency-select"]').select('Weekly');
      
      cy.get('button[type="submit"]').contains(/save|update/i).click();
      
      cy.contains('Weekly').should('be.visible');
    });
  });

  describe('Delete Habit', () => {
    const deleteHabitName = `Delete Test Habit ${timestamp}`;
    
    beforeEach(() => {
      // Create a habit to delete
      cy.visit('/habits');
      cy.get('button').contains(/new habit|add habit|create habit|\+/i).click();
      
      cy.get('input[name="name"], input[placeholder*="habit name" i]').type(deleteHabitName);
      cy.get('select[name="category"], [data-testid="category-select"]').select('Health');
      cy.get('input[value="build"], label').contains(/build/i).click();
      cy.get('select[name="frequency"], [data-testid="frequency-select"]').select('Daily');
      
      cy.get('button[type="submit"]').contains(/create|save|add/i).click();
      cy.contains(deleteHabitName).should('be.visible');
    });

    it('should show delete confirmation', () => {
      cy.contains(deleteHabitName)
        .parent()
        .find('button')
        .contains(/delete|remove|⋮|…/i)
        .click();
      
      // If dropdown menu, click delete option
      cy.get('body').then($body => {
        if ($body.find('[role="menu"]').length > 0) {
          cy.get('[role="menu"]').contains(/delete|remove/i).click();
        }
      });
      
      cy.contains(/confirm|are you sure|delete.*habit/i).should('be.visible');
    });

    it('should cancel delete operation', () => {
      cy.contains(deleteHabitName)
        .parent()
        .find('button')
        .contains(/delete|remove|⋮|…/i)
        .click();
      
      cy.get('body').then($body => {
        if ($body.find('[role="menu"]').length > 0) {
          cy.get('[role="menu"]').contains(/delete|remove/i).click();
        }
      });
      
      cy.get('button').contains(/cancel|no/i).click();
      cy.contains(deleteHabitName).should('be.visible');
    });

    it('should delete habit permanently', () => {
      cy.contains(deleteHabitName)
        .parent()
        .find('button')
        .contains(/delete|remove|⋮|…/i)
        .click();
      
      cy.get('body').then($body => {
        if ($body.find('[role="menu"]').length > 0) {
          cy.get('[role="menu"]').contains(/delete|remove/i).click();
        }
      });
      
      cy.get('button').contains(/confirm|yes|delete/i).last().click();
      
      cy.contains(deleteHabitName).should('not.exist');
    });
  });

  describe('Complete Habit', () => {
    const completeHabitName = `Complete Test Habit ${timestamp}`;
    
    before(() => {
      // Create a habit to complete
      cy.visit('/habits');
      cy.get('button').contains(/new habit|add habit|create habit|\+/i).click();
      
      cy.get('input[name="name"], input[placeholder*="habit name" i]').type(completeHabitName);
      cy.get('select[name="category"], [data-testid="category-select"]').select('Health');
      cy.get('input[value="build"], label').contains(/build/i).click();
      cy.get('select[name="frequency"], [data-testid="frequency-select"]').select('Daily');
      
      cy.get('button[type="submit"]').contains(/create|save|add/i).click();
    });

    it('should mark habit as complete for today', () => {
      cy.visit('/dashboard');
      
      cy.contains(completeHabitName)
        .parent()
        .find('button[data-testid="complete-habit"], input[type="checkbox"], button.complete, button')
        .first()
        .click();
      
      // Should show completion indicator
      cy.contains(completeHabitName)
        .parent()
        .should('have.class', 'completed')
        .or('contain', '✓')
        .or('contain', 'Completed');
    });

    it('should update streak count', () => {
      cy.visit('/dashboard');
      
      // Get initial streak count
      cy.contains(completeHabitName)
        .parent()
        .find('[data-testid="streak"], .streak')
        .invoke('text')
        .then((initialStreak) => {
          // Complete habit
          cy.contains(completeHabitName)
            .parent()
            .find('button[data-testid="complete-habit"], input[type="checkbox"], button')
            .first()
            .click();
          
          // Check streak increased
          cy.contains(completeHabitName)
            .parent()
            .find('[data-testid="streak"], .streak')
            .invoke('text')
            .should('not.equal', initialStreak);
        });
    });

    it('should show rope visualization update', () => {
      cy.visit('/habits');
      
      cy.contains(completeHabitName).click();
      
      // Check for rope visualization
      cy.get('svg, canvas, [data-testid="rope-visualization"]').should('be.visible');
      
      // Complete habit
      cy.get('button[data-testid="complete-habit"], button').contains(/complete|done|check/i).click();
      
      // Rope should update (color or thickness change)
      cy.get('svg, canvas, [data-testid="rope-visualization"]')
        .should('have.attr', 'data-strength')
        .or('have.class', 'strong');
    });

    it('should prevent double completion on same day', () => {
      cy.visit('/dashboard');
      
      // First completion
      cy.contains(completeHabitName)
        .parent()
        .find('button[data-testid="complete-habit"], input[type="checkbox"], button')
        .first()
        .click();
      
      // Try to complete again
      cy.contains(completeHabitName)
        .parent()
        .find('button[data-testid="complete-habit"], input[type="checkbox"], button')
        .should('be.disabled')
        .or('have.class', 'completed');
    });
  });

  describe('Habit Analytics', () => {
    const analyticsHabitName = `Analytics Test Habit ${timestamp}`;
    
    before(() => {
      // Create and complete a habit multiple times
      cy.visit('/habits');
      cy.get('button').contains(/new habit|add habit|create habit|\+/i).click();
      
      cy.get('input[name="name"], input[placeholder*="habit name" i]').type(analyticsHabitName);
      cy.get('select[name="category"], [data-testid="category-select"]').select('Health');
      cy.get('input[value="build"], label').contains(/build/i).click();
      cy.get('select[name="frequency"], [data-testid="frequency-select"]').select('Daily');
      
      cy.get('button[type="submit"]').contains(/create|save|add/i).click();
      
      // Complete the habit
      cy.visit('/dashboard');
      cy.contains(analyticsHabitName)
        .parent()
        .find('button[data-testid="complete-habit"], input[type="checkbox"], button')
        .first()
        .click();
    });

    it('should display habit details page', () => {
      cy.visit('/habits');
      cy.contains(analyticsHabitName).click();
      
      cy.contains(analyticsHabitName).should('be.visible');
      cy.contains(/streak|progress|analytics/i).should('be.visible');
    });

    it('should show completion history', () => {
      cy.visit('/habits');
      cy.contains(analyticsHabitName).click();
      
      cy.contains(/history|calendar|completions/i).should('be.visible');
      cy.get('[data-testid="completion-history"], .calendar, .history').should('be.visible');
    });

    it('should display streak information', () => {
      cy.visit('/habits');
      cy.contains(analyticsHabitName).click();
      
      cy.contains(/current streak/i).should('be.visible');
      cy.contains(/longest streak/i).should('be.visible');
      cy.contains(/total completions/i).should('be.visible');
    });

    it('should show rope strength visualization', () => {
      cy.visit('/habits');
      cy.contains(analyticsHabitName).click();
      
      cy.get('svg, canvas, [data-testid="rope-visualization"]').should('be.visible');
      cy.contains(/rope strength|habit strength/i).should('be.visible');
    });

    it('should display consistency percentage', () => {
      cy.visit('/habits');
      cy.contains(analyticsHabitName).click();
      
      cy.contains(/consistency|completion rate/i).should('be.visible');
      cy.contains(/%/).should('be.visible');
    });
  });

  describe('Habit Filtering and Sorting', () => {
    before(() => {
      // Create habits in different categories
      const categories = ['Health', 'Productivity', 'Mindfulness'];
      categories.forEach(category => {
        cy.visit('/habits');
        cy.get('button').contains(/new habit|add habit|create habit|\+/i).click();
        
        cy.get('input[name="name"], input[placeholder*="habit name" i]')
          .type(`Filter Test ${category} ${timestamp}`);
        cy.get('select[name="category"], [data-testid="category-select"]').select(category);
        cy.get('input[value="build"], label').contains(/build/i).click();
        cy.get('select[name="frequency"], [data-testid="frequency-select"]').select('Daily');
        
        cy.get('button[type="submit"]').contains(/create|save|add/i).click();
      });
    });

    it('should filter habits by category', () => {
      cy.visit('/habits');
      
      // Filter by Health
      cy.get('select[data-testid="category-filter"], button').contains(/all|filter/i).click();
      cy.contains('Health').click();
      
      cy.contains(`Filter Test Health ${timestamp}`).should('be.visible');
      cy.contains(`Filter Test Productivity ${timestamp}`).should('not.exist');
    });

    it('should filter habits by type', () => {
      cy.visit('/habits');
      
      // Filter by Build type
      cy.get('select[data-testid="type-filter"], button').contains(/all|type/i).click();
      cy.contains(/build/i).click();
      
      cy.contains(/build/i).should('be.visible');
    });

    it('should filter habits by status', () => {
      cy.visit('/habits');
      
      // Filter by Active status
      cy.get('select[data-testid="status-filter"], button').contains(/all|status/i).click();
      cy.contains(/active/i).click();
      
      cy.get('[data-testid="habit-card"]').should('have.length.greaterThan', 0);
    });

    it('should sort habits by name', () => {
      cy.visit('/habits');
      
      cy.get('select[data-testid="sort-by"], button').contains(/sort/i).click();
      cy.contains(/name/i).click();
      
      // Verify alphabetical order
      cy.get('[data-testid="habit-name"], .habit-name')
        .then($elements => {
          const names = [...$elements].map(el => el.innerText);
          const sortedNames = [...names].sort();
          expect(names).to.deep.equal(sortedNames);
        });
    });

    it('should sort habits by streak', () => {
      cy.visit('/habits');
      
      cy.get('select[data-testid="sort-by"], button').contains(/sort/i).click();
      cy.contains(/streak/i).click();
      
      // Verify streak order
      cy.get('[data-testid="streak"], .streak')
        .then($elements => {
          const streaks = [...$elements].map(el => parseInt(el.innerText) || 0);
          const sortedStreaks = [...streaks].sort((a, b) => b - a);
          expect(streaks).to.deep.equal(sortedStreaks);
        });
    });
  });

  describe('Habit Pause and Resume', () => {
    const pauseHabitName = `Pause Test Habit ${timestamp}`;
    
    before(() => {
      cy.visit('/habits');
      cy.get('button').contains(/new habit|add habit|create habit|\+/i).click();
      
      cy.get('input[name="name"], input[placeholder*="habit name" i]').type(pauseHabitName);
      cy.get('select[name="category"], [data-testid="category-select"]').select('Health');
      cy.get('input[value="build"], label').contains(/build/i).click();
      cy.get('select[name="frequency"], [data-testid="frequency-select"]').select('Daily');
      
      cy.get('button[type="submit"]').contains(/create|save|add/i).click();
    });

    it('should pause a habit', () => {
      cy.visit('/habits');
      
      cy.contains(pauseHabitName)
        .parent()
        .find('button')
        .contains(/pause|⋮|…/i)
        .click();
      
      cy.get('body').then($body => {
        if ($body.find('[role="menu"]').length > 0) {
          cy.get('[role="menu"]').contains(/pause/i).click();
        }
      });
      
      cy.contains(pauseHabitName)
        .parent()
        .should('contain', 'Paused')
        .or('have.class', 'paused');
    });

    it('should not show paused habits in dashboard', () => {
      cy.visit('/dashboard');
      cy.contains(pauseHabitName).should('not.exist');
    });

    it('should resume a paused habit', () => {
      cy.visit('/habits');
      
      cy.contains(pauseHabitName)
        .parent()
        .find('button')
        .contains(/resume|activate|⋮|…/i)
        .click();
      
      cy.get('body').then($body => {
        if ($body.find('[role="menu"]').length > 0) {
          cy.get('[role="menu"]').contains(/resume|activate/i).click();
        }
      });
      
      cy.contains(pauseHabitName)
        .parent()
        .should('not.contain', 'Paused')
        .and('not.have.class', 'paused');
    });
  });

  describe('Habit Archive', () => {
    const archiveHabitName = `Archive Test Habit ${timestamp}`;
    
    before(() => {
      cy.visit('/habits');
      cy.get('button').contains(/new habit|add habit|create habit|\+/i).click();
      
      cy.get('input[name="name"], input[placeholder*="habit name" i]').type(archiveHabitName);
      cy.get('select[name="category"], [data-testid="category-select"]').select('Health');
      cy.get('input[value="build"], label').contains(/build/i).click();
      cy.get('select[name="frequency"], [data-testid="frequency-select"]').select('Daily');
      
      cy.get('button[type="submit"]').contains(/create|save|add/i).click();
    });

    it('should archive a habit', () => {
      cy.visit('/habits');
      
      cy.contains(archiveHabitName)
        .parent()
        .find('button')
        .contains(/archive|⋮|…/i)
        .click();
      
      cy.get('body').then($body => {
        if ($body.find('[role="menu"]').length > 0) {
          cy.get('[role="menu"]').contains(/archive/i).click();
        }
      });
      
      // Confirm archive
      cy.get('button').contains(/confirm|yes|archive/i).last().click();
      
      // Should not be visible in active habits
      cy.contains(archiveHabitName).should('not.exist');
    });

    it('should show archived habits in archive view', () => {
      cy.visit('/habits');
      
      // Switch to archive view
      cy.get('button, select').contains(/archived|archive/i).click();
      
      cy.contains(archiveHabitName).should('be.visible');
    });

    it('should restore archived habit', () => {
      cy.visit('/habits');
      
      // Switch to archive view
      cy.get('button, select').contains(/archived|archive/i).click();
      
      cy.contains(archiveHabitName)
        .parent()
        .find('button')
        .contains(/restore|unarchive|⋮|…/i)
        .click();
      
      cy.get('body').then($body => {
        if ($body.find('[role="menu"]').length > 0) {
          cy.get('[role="menu"]').contains(/restore|unarchive/i).click();
        }
      });
      
      // Switch back to active view
      cy.get('button, select').contains(/active|all/i).click();
      
      cy.contains(archiveHabitName).should('be.visible');
    });
  });
});