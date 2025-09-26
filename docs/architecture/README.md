# Architecture Documentation

## System Overview
HabitForge follows a modern, scalable architecture with clear separation of concerns and type-safe implementations throughout.

## Frontend Architecture

### Component Structure
```
src/
├── components/
│   ├── layout/           # App layout components
│   ├── habits/           # Habit-related components
│   ├── community/        # Social features
│   └── visualizations/   # D3.js visualizations
├── pages/                # Route-based pages
├── stores/               # Zustand state management
├── services/             # Firebase service layer
├── hooks/                # Custom React hooks
├── utils/                # Utility functions
└── types/                # TypeScript definitions
```

### State Management
We use Zustand for state management with the following stores:
- **authStore**: User authentication and profile
- **habitStore**: Habit data and operations
- **achievementStore**: User achievements and badges
- **uiStore**: UI state and preferences

### Routing
TanStack Router provides type-safe routing with:
- File-based route generation
- Type-safe navigation
- Route guards for authentication
- Nested layouts

## Backend Architecture

### Firebase Services
```
Firebase
├── Authentication       # User auth with email/password
├── Firestore            # NoSQL database
│   ├── hf2024_users    # User profiles
│   ├── hf2024_habits   # Habit definitions
│   ├── hf2024_completions # Daily completions
│   ├── hf2024_achievements # Achievement definitions
│   ├── hf2024_posts    # Community posts
│   ├── hf2024_challenges # Community challenges
│   └── hf2024_relationships # Friend connections
├── Storage             # File storage for avatars
└── Hosting             # Static site hosting
```

### Service Layer Pattern
All Firebase operations go through service classes:
- **Singleton Pattern**: One instance per service
- **Repository Pattern**: Abstracted data operations
- **Type Safety**: Full TypeScript coverage
- **Error Handling**: Centralized error management

### Security Model
- **Authentication**: Firebase Auth with JWT tokens
- **Authorization**: Firestore security rules
- **Data Validation**: Client and server-side validation
- **Rate Limiting**: Firebase built-in protections
- **Encryption**: TLS for data in transit

## Data Flow

### Creating a Habit
```mermaid
User Input → Validation → habitStore.createHabit() 
→ HabitService.create() → Firestore → Success/Error
→ Update habitStore → Update UI
```

### Daily Check-in
```mermaid
Mark Complete → Five-Factor Form → completionStore.create()
→ CompletionService.log() → Firestore → Calculate Streak
→ Update Achievements → Update Rope Visualization
```

## Design Patterns

### 1. Singleton Services
```typescript
class HabitService {
  private static instance: HabitService;
  
  static getInstance() {
    if (!this.instance) {
      this.instance = new HabitService();
    }
    return this.instance;
  }
}
```

### 2. Repository Pattern
```typescript
interface IHabitRepository {
  create(habit: HabitInput): Promise<Habit>;
  update(id: string, data: Partial<Habit>): Promise<void>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<Habit>;
  findByUser(userId: string): Promise<Habit[]>;
}
```

### 3. Observer Pattern (Zustand)
```typescript
const useHabitStore = create<HabitState>((set, get) => ({
  habits: [],
  loading: false,
  fetchHabits: async () => {
    // Implementation
  }
}));
```

## Performance Optimizations

### Frontend
- **Code Splitting**: Route-based lazy loading
- **Bundle Optimization**: Tree shaking, minification
- **Image Optimization**: Lazy loading, WebP format
- **Caching Strategy**: Service worker, local storage
- **Memoization**: React.memo, useMemo, useCallback

### Backend
- **Firestore Indexes**: Optimized query performance
- **Data Denormalization**: Reduced reads
- **Batch Operations**: Grouped writes
- **Pagination**: Limit query results
- **CDN**: Static assets via Firebase Hosting

## Scalability Considerations

### Horizontal Scaling
- Stateless frontend can scale infinitely
- Firebase handles backend scaling automatically
- CDN distribution for global performance

### Data Partitioning
- User data isolated by userId
- Time-based partitioning for analytics
- Sharding strategy for large collections

### Caching Layers
- Browser cache for static assets
- Firestore offline persistence
- React Query cache for API responses
- CDN edge caching

## Monitoring & Observability

### Application Monitoring
- Error tracking with Sentry (planned)
- Performance monitoring with Firebase
- Custom analytics events
- User behavior tracking

### Infrastructure Monitoring
- Firebase console metrics
- Uptime monitoring
- Budget alerts
- Security alerts

## Deployment Pipeline

### Development
```
Local Development → Git Push → PR Review → Merge to main
```

### Production
```
main branch → GitHub Actions → Build → Test → Deploy to Firebase
```

### Rollback Strategy
- Firebase hosting versions
- Git revert for code
- Firestore backup/restore
- Feature flags for gradual rollout