# HabitForge - Claude AI Development Guide

This document contains project-specific instructions for Claude AI to maintain consistency and quality when working on the HabitForge project.

## Project Overview

HabitForge is a comprehensive habit tracking application that uses a unique rope strength visualization metaphor to represent habit consistency. Built with React, TypeScript, Firebase, and Capacitor.

## Important Project-Specific Rules

### 1. Firebase Configuration
- **Project Prefix**: Always use `hf2024_` prefix for all Firestore collections and storage paths
- **Environment Variables**: Never commit Firebase config directly. Always use environment variables
- **Security Rules**: Maintain strict user-based access control in Firestore rules

### 2. Code Standards
- **TypeScript**: Use strict mode. All variables, functions, and components must be properly typed
- **Components**: Keep components under 500 lines. Split larger components into smaller, reusable ones
- **Imports**: Always use absolute imports with `@/` alias pointing to the `src` folder
- **State Management**: Use Zustand for global state, React Query for server state

### 3. Habit Data Structure
```typescript
interface Habit {
  id: string;
  userId: string;
  name: string;
  category: HabitCategory;
  type: 'build' | 'break' | 'maintain';
  trackingConfig: TrackingConfig;
  fiveFactors: FiveFactors;
  habitLoop: HabitLoop;
  progress: HabitProgress;
  settings: HabitSettings;
  status: 'active' | 'paused' | 'archived' | 'completed';
}
```

### 4. Testing Requirements
- Run `yarn build` before any deployment
- Ensure no TypeScript errors
- Test offline functionality
- Verify Firebase rules work correctly

### 5. Deployment Process
```bash
# Always in this order:
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
firebase deploy --only storage
firebase deploy --only hosting
```

## Key Features to Maintain

### Rope Visualization
- Uses D3.js for rendering
- Rope strength based on:
  - Current streak (40% weight)
  - Consistency (30% weight)
  - Total completions (30% weight)
- Visual states: thread → string → rope → cable → chain

### Five-Factor Analysis
Based on "The Power of Habit":
1. **Cue**: What triggers the habit
2. **Routine**: The habit itself
3. **Reward**: What you gain from it
4. **Craving**: Why you want it
5. **Investment**: What you put into it

### Community Features
- Posts are stored in `hf2024_posts`
- Leaderboard calculated from user stats
- Challenges in `hf2024_challenges`
- Friend relationships in `hf2024_relationships`

## API Integration Points

### Authentication
```typescript
// Always use these methods:
signUpWithEmail(email, password, displayName)
signInWithEmail(email, password)
signInWithGoogle()
signOutUser()
```

### Habit Operations
```typescript
// CRUD operations
createHabit(userId, habitData)
updateHabit(habitId, updates)
deleteHabit(habitId)
getHabits(userId)
completeHabit(habitId)
```

### User Profile
```typescript
getUserProfile(userId)
createUserProfile(firebaseUser)
updateUserProfile(userId, updates)
```

## Common Issues & Solutions

### Build Errors
- **Type imports**: Use `import type` for type-only imports
- **Undefined properties**: Add null checks or default values
- **Route types**: Regenerate with `npx @tanstack/router-cli generate`

### Firebase Issues
- **Permission denied**: Check Firestore rules
- **Offline data**: Enable offline persistence in Firebase config
- **Large files**: Implement chunked upload for files > 5MB

## Development Workflow

1. **Before starting work**:
   ```bash
   git pull
   yarn install
   yarn dev
   ```

2. **Before committing**:
   ```bash
   yarn build  # Must pass without errors
   yarn lint   # Fix any linting issues
   ```

3. **Testing checklist**:
   - [ ] Create new habit
   - [ ] Complete habit (check streak update)
   - [ ] View analytics
   - [ ] Test offline mode
   - [ ] Check responsive design
   - [ ] Verify dark mode

## Performance Targets
- Lighthouse Performance: > 90
- Bundle size: < 700KB gzipped
- Time to Interactive: < 3s on 3G
- First Contentful Paint: < 1.5s

## Security Checklist
- [ ] No API keys in code
- [ ] Firestore rules restrict user data access
- [ ] Storage rules validate file types/sizes
- [ ] Input validation on all forms
- [ ] XSS protection (React handles this)
- [ ] HTTPS only deployment

## PWA Requirements
- Service worker for offline support
- App manifest for installability
- Icons for all platforms
- Splash screens configured
- Cache strategy implemented

## Mobile App Considerations
- Use Capacitor APIs over web APIs when available
- Test on both iOS and Android
- Handle device-specific features gracefully
- Implement proper back button handling
- Support both portrait and landscape

## Future Enhancements (Planned)
1. AI-powered habit recommendations
2. Voice input for habit tracking
3. Wearable device integration
4. Team habits for organizations
5. Habit coaching with AI assistant
6. Advanced analytics with ML insights
7. Gamification improvements
8. Social accountability features

## Important Links
- Live App: https://habitforge-a1.web.app
- Firebase Console: https://console.firebase.google.com/project/habitforge-a1
- Design System: Tailwind CSS with custom theme
- Icons: Lucide React icons

## Contact for Issues
If you encounter any issues:
1. Check this document first
2. Review recent commits for context
3. Test in development environment
4. Document the issue with steps to reproduce

## Remember
- Quality over speed
- User experience is paramount
- Security cannot be compromised
- Performance affects user retention
- Consistency in code style matters
- Documentation helps future development

---

Last Updated: January 2025
Version: 1.0.0