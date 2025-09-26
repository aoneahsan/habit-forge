# HabitForge - Technical Stack & Implementation Guide

## Core Technology Stack

### Frontend Framework
- **React 19**: Latest React with concurrent features
- **TypeScript**: Type safety throughout application
- **Vite**: Build tool for fast development

### Required NPM Packages

#### State Management & Data
```json
"zustand": "^latest"              // Global state management
"@tanstack/react-query": "^latest"  // Server state and caching
"react-hook-form": "^latest"     // Form handling
"@hookform/resolvers": "^latest"  // Form validation
"zod": "^latest"                  // Schema validation
"axios": "^latest"                // HTTP client
"dayjs": "^latest"               // Date manipulation
"date-fns": "^latest"              // Additional date utilities
```

#### Routing & Navigation
```json
"@tanstack/react-router": "^latest"  // Type-safe routing
```

#### UI Components & Styling
```json
"@headlessui/react": "^latest"    // Unstyled accessible components
"@radix-ui/*": [                 // Complete UI component library
  "react-accordion",
  "react-alert-dialog", 
  "react-avatar",
  "react-checkbox",
  "react-dialog",
  "react-dropdown-menu",
  "react-label",
  "react-popover",
  "react-progress",
  "react-radio-group",
  "react-select",
  "react-separator",
  "react-slider",
  "react-switch",
  "react-tabs",
  "react-toast",
  "react-tooltip"
]
"lucide-react": "^latest"       // Icon library
"tailwind-merge": "^latest"       // Tailwind class merging
"clsx": "^latest"                 // Conditional classes
"class-variance-authority": "^latest"  // Component variants
```

#### Data Visualization
```json
"d3": "^latest"                   // Advanced visualizations
"chart.js": "^latest"             // Charts
"react-chartjs-2": "^latest"      // React Chart.js wrapper
```

#### Rich Text Editing
```json
"@tiptap/core": "^latest"         // Rich text editor
"@tiptap/react": "^latest"        
"@tiptap/starter-kit": "^latest"
"@tiptap/extension-*": [         // Editor extensions
  "highlight",
  "image",
  "link",
  "placeholder",
  "table",
  "text-align",
  "typography",
  "underline"
]
```

#### Firebase & Backend
```json
"firebase": "^latest"             // Complete Firebase SDK
```

#### Capacitor (Mobile)
```json
"@capacitor/core": "^latest"      // Core Capacitor
"@capacitor/android": "^latest"   // Android support
"@capacitor/ios": "^latest"       // iOS support
"@capacitor/app": "^latest"       // App API
"@capacitor/camera": "^latest"    // Camera access
"@capacitor/preferences": "^latest"  // Local storage
"@capacitor/push-notifications": "^latest"  // Push notifications
"@capacitor/share": "^latest"     // Native sharing
"@capacitor/splash-screen": "^latest"  // Splash screen
"@capacitor/status-bar": "^latest"     // Status bar control
"@capacitor/toast": "^latest"          // Native toasts
```

#### Capacitor Community Plugins
```json
"@capacitor-community/apple-sign-in": "^latest"  // Apple Sign In
"@codetrix-studio/capacitor-google-auth": "^latest-rc.4"  // Google Auth
"@capawesome/capacitor-app-review": "^latest"     // App store reviews
"@capawesome/capacitor-app-update": "^latest"     // App updates
"@capawesome/capacitor-badge": "^latest"          // App badge
"capacitor-biometric-authentication": "^latest"    // Biometrics
```

#### Utilities
```json
"react-hot-toast": "^latest"      // Toast notifications
"react-helmet-async": "^latest"   // Document head management
"@sentry/react": "^latest"      // Error tracking
"@stripe/stripe-js": "^latest"    // Payment processing
"jspdf": "^latest"                // PDF generation
"i18next": "^latest"             // Internationalization
"react-i18next": "^latest"       // React i18n integration
```

## Package Usage Guide

### State Management with Zustand

#### Use Cases
- **Global App State**: User profile, settings, preferences
- **UI State**: Modals, sidebars, theme
- **Cached Data**: Habits list, recent entries
- **Offline Queue**: Pending sync operations

#### Implementation Areas
```typescript
// stores/userStore.ts
- User authentication state
- Account type (free/premium)
- User preferences
- Notification settings

// stores/habitStore.ts
- Active habits list
- Current habit being tracked
- Tracking entries cache
- Offline entries queue

// stores/uiStore.ts
- Modal states
- Loading states
- Error messages
- Theme settings
```

### Data Fetching with TanStack Query

#### Use Cases
- **API Calls**: All Firebase/backend requests
- **Caching**: Automatic cache management
- **Optimistic Updates**: Instant UI updates
- **Background Refetch**: Keep data fresh
- **Infinite Scroll**: Load more patterns

#### Implementation Areas
```typescript
// queries/habits.ts
- useHabits() - fetch all habits
- useHabit(id) - fetch single habit
- useHabitEntries(habitId) - fetch entries
- useCreateHabit() - mutation
- useUpdateHabit() - mutation

// queries/analytics.ts
- useHabitAnalytics(habitId)
- useUserStatistics()
- usePatternInsights()
```
**keep it as simple as possible, we should use firebase subscriptions, so we will get realtime updates out of box, without having to do much our self**

### UI Components with Radix UI

#### Component Mapping
- **Modals**: @radix-ui/react-dialog
- **Dropdowns**: @radix-ui/react-dropdown-menu
- **Forms**: @radix-ui/react-checkbox, radio-group, switch
- **Feedback**: @radix-ui/react-toast, react-tooltip
- **Navigation**: @radix-ui/react-tabs
- **Data Display**: @radix-ui/react-accordion
- **for any components where radix ui do not have a great package, use some other great package from NPM, with best downloads and everything, instead of creating anything custom**

#### Styling Approach
- **use Radix components, radix UI components are great, fully styled and ready for production level apps, no need to create custom components using tailwindcss, instead use all that radix ui provides and use** tailwindcss as CSS utility to get the best of all worlds
- **only use Tailwind CSS where needed**
- **use radix UI design system, it's theme, colors, styles, and everything, so we will not face any issue atr any point**

### Visualizations with D3.js

#### Rope Visualization
```typescript
// components/RopeVisualization.tsx
- SVG-based rope rendering
- Dynamic thickness based on strength
- Animated strand addition/removal
- Texture and material effects
- Interactive hover states
```

#### Analytics Charts
```typescript
// components/charts/
- HabitCalendarHeatmap.tsx (D3)
- SuccessRateChart.tsx (Chart.js)
- EmotionCorrelation.tsx (D3)
- LocationHeatMap.tsx (D3)
- SocialInfluenceNetwork.tsx (D3)
```

### Mobile Features with Capacitor

#### Native Functionality Implementation

**Biometric Authentication**
```typescript
// services/auth/biometric.ts
- Face ID/Touch ID for iOS
- Fingerprint for Android
- Fallback to PIN
```

**Push Notifications**
```typescript
// services/notifications.ts
- Register device token
- Handle notification tap
- Schedule local notifications
- Smart reminder timing
```

**Camera Integration**
```typescript
// features/habits/PhotoEvidence.tsx
- Capture progress photos
- Gallery selection
- Image compression
- Upload to Firebase Storage
```

**Offline Support**
```typescript
// services/offline.ts
- Capacitor Preferences for local storage
- Queue sync operations
- Conflict resolution
- Background sync
```

### Form Handling with React Hook Form

#### Form Implementations
```typescript
// forms/CreateHabitForm.tsx
- Multi-step wizard
- Dynamic field validation
- Conditional fields
- Auto-save drafts

// forms/TrackingEntryForm.tsx
- Five-factor inputs
- Quick entry mode
- Voice input support
- Photo attachment
```

### Rich Text with Tiptap

#### Use Cases
- **Journal Entries**: Habit reflections
- **Success Stories**: Community sharing
- **Admin Content**: Articles and guides
- **Notifications**: Rich message formatting

### Error Tracking with Sentry

#### Implementation Areas
- **Error Boundaries**: Catch React errors
- **API Errors**: Track failed requests
- **Performance**: Monitor slow operations
- **User Actions**: Track feature usage
- **Custom Events**: Business metrics

### Internationalization with i18next

#### Supported Areas
- **UI Text**: All interface strings
- **Date/Time**: Localized formatting
- **Numbers**: Currency and metrics
- **Notifications**: Translated messages
- **Content**: Localized motivational quotes

## Firebase Architecture

### Firestore Collections

```typescript
// Main Collections
users/
  {userId}/
    profile
    settings
    subscription
    achievements

habits/
  {habitId}/
    metadata
    configuration
    statistics
    milestones

entries/
  {entryId}/
    fiveFactors
    additionalData
    media
    
analytics/
  {userId}/
    patterns
    insights
    predictions

// Admin Collections
system_configs/
  account_limits
  feature_flags
  pricing
  
admin/
  users
  audit_logs
  content
```

### Cloud Functions

```typescript
// Scheduled Functions
- dailyAnalytics
- reminderScheduler
- streakChecker
- subscriptionRenewal

// Triggered Functions
- onHabitCreate
- onEntryCreate
- onStreakBreak
- onAchievementEarned

// API Functions
- processPayment
- generateReport
- exportUserData
- deleteAccount
```

### Security Rules

```typescript
// Firestore Rules
- Row-level security
- User data isolation
- Admin access control
- Rate limiting

// Storage Rules
- User folder isolation
- File size limits
- Content type validation
- Virus scanning
```

## Performance Optimization

### Code Splitting
```typescript
// Lazy load routes
const Analytics = lazy(() => import('./pages/Analytics'))
const AdminPanel = lazy(() => import('./pages/Admin'))

// Lazy load heavy components
const RopeVisualization = lazy(() => import('./components/Rope'))
const D3Charts = lazy(() => import('./components/Charts'))
```

### Caching Strategy
- **React Query**: API response caching
- **Zustand Persist**: Local state persistence
- **Service Worker**: Asset caching
- **CDN**: Static file delivery
- **Firebase**: Firestore offline persistence

### Optimization Techniques
- **Virtual Scrolling**: Large lists (@tanstack/react-table)
- **Image Optimization**: Lazy loading, WebP format
- **Bundle Size**: Tree shaking, minification
- **Render Optimization**: React.memo, useMemo, useCallback
- **Animation**: CSS transforms, requestAnimationFrame

## Development Workflow

### Project Setup
```bash
# Create Vite project
npm create vite@latest habitforge -- --template react-ts

# Install all dependencies
npm install [all packages listed above]

# Setup Capacitor
npx cap init
npx cap add ios
npx cap add android

# Configure Firebase
# Add firebase config to environment variables
```

### Folder Structure
```
src/
  components/      # Reusable UI components
  features/        # Feature modules
    habits/
    analytics/
    community/
    admin/
  hooks/          # Custom React hooks
  services/       # API and external services
  stores/         # Zustand stores
  utils/          # Helper functions
  styles/         # Global styles
  types/          # TypeScript types
  
capacitor/       # Native configurations
firebase/        # Firebase configs
public/          # Static assets
```

### Environment Variables
```env
# Firebase
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

# Stripe
VITE_STRIPE_PUBLIC_KEY=

# Sentry
VITE_SENTRY_DSN=

# API
VITE_API_URL=
```

## Testing Strategy

### Testing Libraries to Add
```json
"@testing-library/react": "latest"
"@testing-library/jest-dom": "latest"
"vitest": "latest"
"@vitest/ui": "latest"
"msw": "latest"  // API mocking
```

### Test Coverage Areas
- **Unit Tests**: Utilities, hooks, stores
- **Component Tests**: UI components
- **Integration Tests**: Feature flows
- **E2E Tests**: Critical user paths
- **Performance Tests**: Load testing

## Deployment

### Web Deployment
- **Hosting**: Firebase Hosting
- **CDN**: Cloudflare
- **Domain**: Custom domain with SSL
- **PWA**: Service worker, manifest

### Mobile Deployment
- **iOS**: App Store via TestFlight
- **Android**: Google Play Console
- **Updates**: CodePush for hot updates
- **Crash Reporting**: Sentry integration

### CI/CD Pipeline
```yaml
# GitHub Actions
- Build and test
- Deploy to staging
- Run E2E tests
- Deploy to production
- Mobile app builds
```

## Monitoring & Analytics

### Application Monitoring
- **Sentry**: Error tracking
- **Firebase Analytics**: User behavior
- **Custom Events**: Business metrics
- **Performance**: Core Web Vitals

### Infrastructure Monitoring
- **Firebase Console**: Usage and costs
- **Stripe Dashboard**: Payment metrics
- **Google Analytics**: Web traffic
- **App Store Analytics**: Downloads and reviews

## Security Considerations

### Authentication
- **Firebase Auth**: Multiple providers
- **Biometric**: Device authentication
- **Session Management**: Secure tokens
- **Password Policy**: Strong requirements

### Data Protection
- **Encryption**: At rest and in transit
- **PII Handling**: GDPR compliance
- **Secure Storage**: Sensitive data
- **API Security**: Rate limiting, CORS

### Privacy
- **Data Minimization**: Collect only necessary
- **User Control**: Export and deletion
- **Transparency**: Clear privacy policy
- **Consent**: Explicit opt-ins

## Conclusion

This technical stack provides a robust foundation for HabitForge, combining modern React development with powerful native capabilities through Capacitor. The chosen packages are industry-standard, well-maintained, and work seamlessly together to create a performant, scalable application.

Key advantages of this stack:
1. **Type Safety**: TypeScript throughout
2. **Performance**: Optimized bundling and caching
3. **Developer Experience**: Modern tooling
4. **Cross-Platform**: Single codebase for web and mobile
5. **Scalability**: Firebase backend scales automatically
6. **Maintainability**: Popular packages with strong communities