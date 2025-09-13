# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

HabitForge is a habit transformation application that combines scientific habit tracking methodology from "The Power of Habit" with visual reinforcement techniques. The app uses a React/TypeScript frontend with Capacitor for mobile deployment and Firebase as the backend.

## Development Commands

### Initial Setup
```bash
# Initialize project with Vite React TypeScript template
yarn create vite@latest habitforge -- --template react-ts

# Install dependencies (always use yarn)
yarn install

# Update all packages to latest versions
yarn upgrade --latest

# Setup Capacitor for mobile
npx cap init
npx cap add ios
npx cap add android

# Initialize Firebase
firebase init
```

### Development
```bash
# Start development server (DO NOT RUN - user handles this)
# yarn dev

# Build for production
yarn build

# Preview production build
yarn preview

# Type checking
yarn type-check

# Linting
yarn lint
yarn lint:fix

# Testing
yarn test
yarn test:watch
yarn test:coverage

# Format code
yarn prettier:write
```

### Mobile Development
```bash
# Sync web assets to native projects
npx cap sync

# Open native IDEs
npx cap open ios
npx cap open android

# Run on devices
npx cap run ios
npx cap run android
```

### Firebase Commands
```bash
# Deploy to Firebase
firebase deploy

# Deploy specific services
firebase deploy --only hosting
firebase deploy --only functions
firebase deploy --only firestore:rules

# Use Firebase emulators for local development (when USE_FIREBASE_EMULATOR=true)
firebase emulators:start
```

## Architecture & Structure

### Technology Stack
- **Frontend**: React 19 with TypeScript, Vite build tool
- **State Management**: Zustand for global state, TanStack Query for server state
- **Routing**: TanStack Router with type-safe routes
- **UI Components**: Radix UI (unstyled) + Tailwind CSS for styling
- **Forms**: React Hook Form with Zod validation
- **Visualizations**: D3.js for rope visualization and analytics charts
- **Mobile**: Capacitor for iOS/Android with native plugins
- **Backend**: Firebase (Firestore, Auth, Functions, Storage)
- **Rich Text**: Tiptap editor for journal entries
- **Payments**: Stripe integration
- **Error Tracking**: Sentry
- **Internationalization**: i18next

### Project Structure
```
src/
  components/      # Reusable UI components
    ui/           # Base UI components (Button, Modal, etc.)
    charts/       # D3.js and Chart.js visualizations
    rope/         # Rope visualization components
  features/        # Feature modules
    habits/       # Habit tracking functionality
    analytics/    # Analytics and insights
    community/    # Social features
    admin/        # Admin panel
  hooks/          # Custom React hooks
  services/       # External service integrations
    firebase/     # Firebase configuration and helpers
    stripe/       # Payment processing
    offline/      # Offline sync management
  stores/         # Zustand stores
    userStore.ts  # User state and preferences
    habitStore.ts # Habits and tracking data
    uiStore.ts    # UI state management
  queries/        # TanStack Query hooks
  utils/          # Helper functions
  types/          # TypeScript type definitions
  styles/         # Global styles and Tailwind config
```

### Key Architectural Patterns

1. **Offline-First Architecture**: 
   - Use Capacitor Preferences for local storage
   - Queue sync operations when offline
   - Automatic background sync when online

2. **Dynamic Configuration**:
   - All limits (habits, features) controlled via Firebase admin panel
   - No hardcoded limitations in code
   - Feature flags managed through Firestore

3. **Five-Factor Habit Tracking** (from "The Power of Habit"):
   - Location tracking
   - Time of day
   - Emotional state
   - Other people present
   - Immediately preceding action

4. **Rope Visualization**:
   - SVG-based rendering with D3.js
   - Dynamic thickness based on habit strength
   - Animated strand addition/removal
   - Interactive hover states

### Firebase Structure
```
Collections:
- users/{userId}/
  - profile, settings, subscription, achievements
- habits/{habitId}/
  - metadata, configuration, statistics, milestones  
- entries/{entryId}/
  - fiveFactors, additionalData, media
- analytics/{userId}/
  - patterns, insights, predictions
- system_configs/
  - account_limits, feature_flags, pricing
```

### State Management Strategy
- **Zustand**: Global app state (user, UI, cached data)
- **TanStack Query**: Server state with caching and optimistic updates
- **React Hook Form**: Form state with validation
- **URL State**: Use TanStack Router for shareable UI state

## Development Guidelines

### Code Quality
- Always use TypeScript with strict mode
- Prefer named exports over default exports
- Use absolute imports with path aliases (@/)
- Keep components under 500 lines
- Create small, reusable components
- Follow React best practices (hooks rules, memoization)

### Testing Requirements
- Use Vitest for unit tests
- Use Cypress for E2E tests (not Jest)
- Maintain minimum 70% code coverage
- Test critical user paths

### Mobile Considerations
- Always enable Y-axis scrolling on all screens
- Design responsive layouts for all device sizes
- Use Capacitor APIs over web APIs when available
- Implement biometric authentication
- Support offline mode with sync queue

### Performance Optimization
- Lazy load routes and heavy components
- Use React.memo for expensive components
- Implement virtual scrolling for long lists
- Optimize images (WebP, lazy loading)
- Use React Query for API response caching

### Security & Privacy
- Never hardcode secrets or API keys
- Use environment variables for configuration
- Implement proper Firebase security rules
- Encrypt sensitive data
- Follow GDPR compliance for user data

## Common Development Tasks

### Adding a New Habit Feature
1. Create feature module in `src/features/habits/`
2. Add Zustand store slice if needed
3. Create TanStack Query hooks for API calls
4. Build UI components with Radix UI + Tailwind
5. Add form validation with React Hook Form + Zod
6. Implement offline support with queue
7. Add tests for critical paths

### Implementing Visualizations
1. Use D3.js for complex interactive charts
2. Use Chart.js for simple charts
3. Implement in `src/components/charts/`
4. Ensure mobile responsiveness
5. Add loading and error states

### Setting Up Firebase Functions
1. Use Node.js version 22 (not 24)
2. Set in package.json: `"engines": { "node": "22" }`
3. Create .nvmrc with `22.17.0`
4. Implement in `firebase/functions/src/`
5. Use TypeScript for all functions

## Important Notes

- Project uses freemium model with dynamic backend-controlled limitations
- All package versions should be kept up-to-date
- Use yarn for all package management (not npm)
- Firebase emulators only when USE_FIREBASE_EMULATOR=true
- Create Firebase indexes for all queries
- Run linting after completing each module
- Project prefix for Firebase collections: "hf2024_" (example: "hf2024_habits")