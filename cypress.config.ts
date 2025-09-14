import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'https://habitforge-a1.web.app',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    pageLoadTimeout: 30000,
    retries: {
      runMode: 2,
      openMode: 0,
    },
    env: {
      // Test user credentials
      TEST_EMAIL: 'test.user@habitforge.com',
      TEST_PASSWORD: 'TestPassword123!',
      TEST_DISPLAY_NAME: 'Test User',
      // Firebase config for testing
      FIREBASE_API_KEY: 'AIzaSyBwzGMeSmBdve0v7WRn3L1eEqe1GHBr4qU',
      FIREBASE_AUTH_DOMAIN: 'habitforge-a1.firebaseapp.com',
      FIREBASE_PROJECT_ID: 'habitforge-a1',
    },
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on('task', {
        log(message) {
          console.log(message);
          return null;
        },
        table(message) {
          console.table(message);
          return null;
        },
      });
      
      return config;
    },
    experimentalStudio: true,
    experimentalWebKitSupport: true,
    chromeWebSecurity: false,
  },
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
    specPattern: 'cypress/component/**/*.cy.{js,jsx,ts,tsx}',
  },
});