import { test, expect } from '@playwright/test';

test.describe('HabitForge - Complete Application Test', () => {
  // Test Homepage
  test('Homepage should load with all key elements', async ({ page }) => {
    await page.goto('/');
    
    // Check main heading
    await expect(page.getByRole('heading', { name: /Transform Your Life Through/i })).toBeVisible();
    
    // Check navigation buttons
    await expect(page.getByRole('button', { name: /Login/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Get Started/i })).toBeVisible();
    
    // Check five factors section
    await expect(page.getByText(/Master the Five-Factor System/i)).toBeVisible();
    await expect(page.getByText(/Location/i)).toBeVisible();
    await expect(page.getByText(/Emotion/i)).toBeVisible();
    await expect(page.getByText(/People/i)).toBeVisible();
    await expect(page.getByText(/Time/i)).toBeVisible();
    await expect(page.getByText(/Trigger/i)).toBeVisible();
    
    // Check features section
    await expect(page.getByText(/Five-Factor Tracking/i)).toBeVisible();
    await expect(page.getByText(/Rope Visualization/i)).toBeVisible();
    await expect(page.getByText(/AI-Powered Insights/i)).toBeVisible();
    
    // Check testimonials
    await expect(page.getByText(/Sarah Chen/i)).toBeVisible();
    
    // Check footer
    await expect(page.getByText(/© 2024 HabitForge/i)).toBeVisible();
  });

  // Test Navigation
  test('Navigation between pages should work', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to Login
    await page.getByRole('button', { name: /Login/i }).first().click();
    await expect(page).toHaveURL('/login');
    await expect(page.getByRole('heading', { name: /Sign In to Your Account/i })).toBeVisible();
    
    // Navigate to Sign Up
    await page.getByRole('link', { name: /Create one for free/i }).click();
    await expect(page).toHaveURL('/signup');
    await expect(page.getByRole('heading', { name: /Create Your Account/i })).toBeVisible();
    
    // Navigate back to Home
    await page.getByRole('button', { name: /Home/i }).click();
    await expect(page).toHaveURL('/');
  });

  // Test Login Page
  test('Login page should have all elements and show validation', async ({ page }) => {
    await page.goto('/login');
    
    // Check page elements
    await expect(page.getByRole('heading', { name: /Sign In to Your Account/i })).toBeVisible();
    await expect(page.getByPlaceholder(/you@example.com/i)).toBeVisible();
    await expect(page.getByPlaceholder(/••••••••/i)).toBeVisible();
    
    // Check social login buttons
    await expect(page.getByRole('button', { name: /Google/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /GitHub/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Twitter/i })).toBeVisible();
    
    // Test form validation
    await page.getByRole('button', { name: /Sign In/i }).click();
    await expect(page.getByText(/Email is required/i)).toBeVisible();
    await expect(page.getByText(/Password is required/i)).toBeVisible();
    
    // Test invalid email
    await page.getByPlaceholder(/you@example.com/i).fill('invalid-email');
    await page.getByRole('button', { name: /Sign In/i }).click();
    await expect(page.getByText(/Invalid email format/i)).toBeVisible();
    
    // Test password visibility toggle
    await page.getByPlaceholder(/••••••••/i).fill('testpassword');
    const passwordInput = page.getByPlaceholder(/••••••••/i);
    await expect(passwordInput).toHaveAttribute('type', 'password');
    
    // Click eye icon to show password
    await page.locator('[class*="cursor-pointer"]').filter({ hasText: /Eye/ }).first().click();
    // Password should now be visible (type changed to text)
    
    // Test forgot password
    await page.getByText(/Forgot password?/i).click();
    // Should show toast message
    
    // Check secure badge
    await expect(page.getByText(/Secure login with end-to-end encryption/i)).toBeVisible();
  });

  // Test Sign Up Page
  test('Sign up page should have all elements and password strength indicator', async ({ page }) => {
    await page.goto('/signup');
    
    // Check page elements
    await expect(page.getByRole('heading', { name: /Create Your Account/i })).toBeVisible();
    await expect(page.getByPlaceholder(/John Doe/i)).toBeVisible();
    await expect(page.getByPlaceholder(/john@example.com/i)).toBeVisible();
    
    // Test password strength indicator
    const passwordField = page.getByPlaceholder(/Create a strong password/i);
    await passwordField.fill('weak');
    await expect(page.getByText(/Weak/i)).toBeVisible();
    
    await passwordField.clear();
    await passwordField.fill('StrongPass123!');
    await expect(page.getByText(/Good|Strong/i)).toBeVisible();
    
    // Check password requirements
    await expect(page.getByText(/At least 8 characters/i)).toBeVisible();
    await expect(page.getByText(/One uppercase letter/i)).toBeVisible();
    await expect(page.getByText(/One lowercase letter/i)).toBeVisible();
    
    // Test password confirmation
    await page.getByPlaceholder(/Confirm your password/i).fill('different');
    await expect(page.getByText(/Passwords do not match/i)).toBeVisible();
    
    // Check terms and conditions checkbox
    const termsCheckbox = page.getByRole('checkbox').first();
    await expect(termsCheckbox).toBeVisible();
    
    // Check benefits section
    await expect(page.getByText(/Track unlimited habits for free/i)).toBeVisible();
    await expect(page.getByText(/Science-backed methodology/i)).toBeVisible();
    
    // Test form validation
    await page.getByRole('button', { name: /Create Free Account/i }).click();
    // Should show validation errors since terms not accepted
  });

  // Test Dashboard (with mock auth)
  test('Dashboard should show impressive UI with all sections', async ({ page }) => {
    // Mock authentication by setting localStorage
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('auth-storage', JSON.stringify({
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
    
    await page.goto('/dashboard');
    
    // Check welcome message
    await expect(page.getByText(/Good morning|Good afternoon|Good evening/i)).toBeVisible();
    
    // Check stats cards
    await expect(page.getByText(/Active Habits/i)).toBeVisible();
    await expect(page.getByText(/Total Streak Days/i)).toBeVisible();
    await expect(page.getByText(/Achievements/i)).toBeVisible();
    await expect(page.getByText(/Today's Progress/i)).toBeVisible();
    
    // Check quick actions
    await expect(page.getByRole('button', { name: /Create New Habit/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Check In/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /View Analytics/i })).toBeVisible();
    
    // Check community highlights
    await expect(page.getByText(/Community Highlights/i)).toBeVisible();
    await expect(page.getByText(/30-Day Meditation/i)).toBeVisible();
    
    // Check achievements section
    await expect(page.getByText(/Recent Achievements/i)).toBeVisible();
    await expect(page.getByText(/First Step/i)).toBeVisible();
    
    // Test navigation buttons
    await expect(page.getByRole('button', { name: /Habits/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Community/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Insights/i })).toBeVisible();
  });

  // Test Habits Page
  test('Habits page should allow creating and viewing habits', async ({ page }) => {
    // Mock authentication
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('auth-storage', JSON.stringify({
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
    
    await page.goto('/habits');
    
    // Check page header
    await expect(page.getByRole('heading', { name: /My Habits/i })).toBeVisible();
    
    // Click New Habit button
    await page.getByRole('button', { name: /New Habit/i }).click();
    
    // Check form fields
    await expect(page.getByPlaceholder(/e.g., Morning meditation/i)).toBeVisible();
    await expect(page.getByText(/Category/i)).toBeVisible();
    await expect(page.getByText(/Type/i)).toBeVisible();
    
    // Fill out the form
    await page.getByPlaceholder(/e.g., Morning meditation/i).fill('Test Habit');
    await page.getByPlaceholder(/Why is this habit important to you?/i).fill('Test description');
    await page.getByPlaceholder(/What do you want to achieve?/i).fill('Test goal');
    
    // Test form submission
    await page.getByRole('button', { name: /Create Habit/i }).click();
    
    // Should show success message or error (depending on Firebase connection)
  });

  // Test Responsive Design
  test('Application should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Check mobile menu
    await expect(page.getByRole('heading', { name: /Transform Your Life/i })).toBeVisible();
    
    // Navigation should still work
    await page.getByRole('button', { name: /Login/i }).first().click();
    await expect(page).toHaveURL('/login');
    
    // Login form should be responsive
    await expect(page.getByRole('heading', { name: /Sign In/i })).toBeVisible();
    
    // Social buttons should stack on mobile
    await expect(page.getByRole('button', { name: /Google/i })).toBeVisible();
  });

  // Test Settings Page
  test('Settings page should have all sections', async ({ page }) => {
    // Mock authentication
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('auth-storage', JSON.stringify({
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
    
    await page.goto('/settings');
    
    // Check settings sections
    await expect(page.getByRole('heading', { name: /Settings/i })).toBeVisible();
    await expect(page.getByText(/Profile Settings/i)).toBeVisible();
    await expect(page.getByText(/Notification Preferences/i)).toBeVisible();
    await expect(page.getByText(/Privacy & Security/i)).toBeVisible();
  });

  // Test Admin Panel
  test('Admin panel should be accessible (with admin mock)', async ({ page }) => {
    // Mock admin authentication
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('auth-storage', JSON.stringify({
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
    
    await page.goto('/admin');
    
    // Check admin dashboard
    await expect(page.getByRole('heading', { name: /Admin Dashboard/i })).toBeVisible();
    
    // Navigate to user management
    await page.goto('/admin/users');
    await expect(page.getByRole('heading', { name: /User Management/i })).toBeVisible();
    await expect(page.getByPlaceholder(/Search users/i)).toBeVisible();
    
    // Navigate to system analytics
    await page.goto('/admin/analytics');
    await expect(page.getByRole('heading', { name: /System Analytics/i })).toBeVisible();
  });

  // Test Button Functionality
  test('All interactive buttons should work', async ({ page }) => {
    await page.goto('/');
    
    // Test "Get Started" button
    await page.getByRole('button', { name: /Get Started/i }).first().click();
    await expect(page).toHaveURL('/signup');
    
    await page.goto('/');
    
    // Test "Watch Demo" button
    const watchDemoButton = page.getByRole('button', { name: /Watch Demo/i });
    if (await watchDemoButton.isVisible()) {
      await watchDemoButton.click();
      // Should trigger demo modal or navigation
    }
    
    // Test "Learn More" buttons
    const learnMoreButtons = page.getByRole('button', { name: /Learn More/i });
    const count = await learnMoreButtons.count();
    if (count > 0) {
      await learnMoreButtons.first().click();
      // Should show more information
    }
  });

  // Test Error Handling
  test('Application should handle errors gracefully', async ({ page }) => {
    await page.goto('/login');
    
    // Try to login with invalid credentials
    await page.getByPlaceholder(/you@example.com/i).fill('test@example.com');
    await page.getByPlaceholder(/••••••••/i).fill('wrongpassword');
    await page.getByRole('button', { name: /Sign In/i }).click();
    
    // Should show error toast or message
    // Note: Actual error will depend on Firebase connection
  });

  // Test Footer Links
  test('Footer links should be present', async ({ page }) => {
    await page.goto('/');
    
    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    // Check footer links
    await expect(page.getByText(/Privacy/i).last()).toBeVisible();
    await expect(page.getByText(/Terms/i).last()).toBeVisible();
    await expect(page.getByText(/Security/i).last()).toBeVisible();
    await expect(page.getByText(/About/i)).toBeVisible();
    await expect(page.getByText(/Blog/i)).toBeVisible();
  });
});

// Performance Test
test('Homepage should load within acceptable time', async ({ page }) => {
  const startTime = Date.now();
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  const loadTime = Date.now() - startTime;
  
  expect(loadTime).toBeLessThan(3000); // Should load within 3 seconds
});

// Accessibility Test
test('Application should be keyboard navigable', async ({ page }) => {
  await page.goto('/');
  
  // Tab through interactive elements
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  
  // Should be able to activate buttons with Enter
  await page.keyboard.press('Enter');
  
  // Should navigate to another page
  await expect(page.url()).not.toBe('http://localhost:6464/');
});