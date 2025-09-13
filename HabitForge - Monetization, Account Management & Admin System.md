# HabitForge - Monetization, Account Management & Admin System

## Table of Contents
1. [Account Types & Monetization Strategy](#account-types--monetization-strategy)
2. [Dynamic Limitation System](#dynamic-limitation-system)
3. [Admin Panel Specifications](#admin-panel-specifications)
4. [Backend Configuration Management](#backend-configuration-management)
5. [Implementation Architecture](#implementation-architecture)
6. [User Experience for Account Types](#user-experience-for-account-types)

---

## Account Types & Monetization Strategy

### Account Tiers

#### 1. Free Account (HabitForge Basic)
**Purpose**: Allow users to experience core value while encouraging upgrade

**Dynamic Limitations (Configurable via Admin):**
- **Habit Creation**: Default 3 active habits (adjustable)
- **Records Per Habit**: Default 30 entries/month (adjustable)
- **AI Features**: Limited to basic insights (configurable)
- **Visualizations**: Basic rope view only (configurable)
- **Notifications**: Standard reminders only (configurable)
- **Analytics History**: Last 30 days (adjustable)
- **Community Features**: Read-only access (configurable)
- **Export Options**: None (configurable)
- **Support**: Community support only

#### 2. Premium Account (HabitForge Pro)
**Purpose**: Full experience for committed users

**Features (All Configurable):**
- **Unlimited Habits**: No restrictions
- **Unlimited Records**: Track without limits
- **Full AI Suite**: All predictions, insights, coaching
- **Advanced Visualizations**: All rope effects, materials, animations
- **Smart Notifications**: AI-optimized timing and content
- **Complete Analytics**: Full history and advanced insights
- **Community Features**: Full participation, challenges, buddy system
- **Data Export**: All formats (CSV, JSON, PDF reports)
- **Priority Support**: Direct support channel
- **Exclusive Content**: Premium guides and programs

### Future Account Types (Prepared in Architecture)
- **Team/Family Plans**: Shared accountability
- **Enterprise**: Corporate wellness programs
- **Coach/Therapist**: Professional tools

---

## Dynamic Limitation System

### Core Principle
**ALL limitations are stored in Firestore and cached for performance. NOTHING is hardcoded.**

### Database Structure for Configurations

```javascript
// Firestore Collection: system_configs/account_limits
{
  "free_tier": {
    "limits": {
      "habits": {
        "max_active": 3,
        "max_total": 5,
        "can_archive": true,
        "can_delete": true
      },
      "records": {
        "max_per_habit_per_month": 30,
        "max_per_habit_per_day": 3,
        "max_total_per_month": 100,
        "allow_backdating": false,
        "backdate_limit_days": 7
      },
      "ai_features": {
        "basic_insights": true,
        "pattern_recognition": false,
        "predictive_analytics": false,
        "ai_coaching": false,
        "smart_reminders": false,
        "correlation_analysis": false,
        "success_prediction": false,
        "personalized_recommendations": false,
        "max_ai_requests_per_day": 5
      },
      "visualizations": {
        "basic_rope": true,
        "animated_rope": false,
        "material_progression": false,
        "special_effects": false,
        "advanced_charts": false,
        "heat_maps": false,
        "correlation_matrix": false,
        "custom_themes": false
      },
      "notifications": {
        "basic_reminders": true,
        "smart_scheduling": false,
        "location_based": false,
        "motivational_messages": true,
        "max_per_day": 5,
        "custom_sounds": false,
        "snooze_enabled": true
      },
      "analytics": {
        "history_days": 30,
        "basic_stats": true,
        "advanced_insights": false,
        "export_enabled": false,
        "comparison_charts": false,
        "trend_analysis": false
      },
      "community": {
        "view_posts": true,
        "create_posts": false,
        "join_challenges": false,
        "create_challenges": false,
        "buddy_system": false,
        "direct_messaging": false,
        "share_achievements": true
      },
      "storage": {
        "max_photos_per_entry": 0,
        "max_total_storage_mb": 50,
        "cloud_backup": false
      },
      "support": {
        "community_forum": true,
        "email_support": false,
        "priority_support": false,
        "live_chat": false
      }
    },
    "ui_restrictions": {
      "show_upgrade_prompts": true,
      "prompt_frequency_days": 7,
      "locked_features_visible": true,
      "watermark_exports": true
    }
  },
  "premium_tier": {
    "limits": {
      "habits": {
        "max_active": -1,  // -1 means unlimited
        "max_total": -1,
        "can_archive": true,
        "can_delete": true
      },
      "records": {
        "max_per_habit_per_month": -1,
        "max_per_habit_per_day": -1,
        "max_total_per_month": -1,
        "allow_backdating": true,
        "backdate_limit_days": 365
      },
      "ai_features": {
        "basic_insights": true,
        "pattern_recognition": true,
        "predictive_analytics": true,
        "ai_coaching": true,
        "smart_reminders": true,
        "correlation_analysis": true,
        "success_prediction": true,
        "personalized_recommendations": true,
        "max_ai_requests_per_day": -1
      },
      // ... all features set to true or unlimited
    }
  }
}
```

### Feature Flag System

```javascript
// Firestore Collection: system_configs/feature_flags
{
  "global_features": {
    "maintenance_mode": false,
    "new_user_registration": true,
    "payment_processing": true,
    "community_features": true,
    "ai_services": true,
    "third_party_integrations": true
  },
  "experimental_features": {
    "ar_visualization": false,
    "voice_commands": false,
    "wearable_sync": false,
    "beta_ai_coach": true,
    "users_whitelist": ["userId1", "userId2"]  // For gradual rollout
  },
  "emergency_overrides": {
    "disable_all_ai": false,
    "disable_all_notifications": false,
    "force_offline_mode": false,
    "emergency_message": null
  }
}
```

### Pricing Configuration

```javascript
// Firestore Collection: system_configs/pricing
{
  "premium": {
    "monthly": {
      "price": 9.99,
      "currency": "USD",
      "stripe_price_id": "price_xxx",
      "trial_days": 7,
      "active": true
    },
    "yearly": {
      "price": 99.99,
      "currency": "USD", 
      "stripe_price_id": "price_yyy",
      "trial_days": 14,
      "discount_percentage": 17,
      "active": true
    },
    "lifetime": {
      "price": 299.99,
      "currency": "USD",
      "stripe_price_id": "price_zzz",
      "active": false,
      "limited_time_offer": false
    }
  },
  "promotions": {
    "active_codes": [
      {
        "code": "LAUNCH50",
        "discount_percentage": 50,
        "valid_until": "2025-12-31",
        "max_uses": 1000,
        "current_uses": 42
      }
    ],
    "seasonal_pricing": {
      "new_year_special": {
        "active": false,
        "discount_percentage": 30,
        "start_date": "2025-12-26",
        "end_date": "2026-01-07"
      }
    }
  }
}
```

---

## Admin Panel Specifications

### Admin Dashboard Overview

#### 1. Main Dashboard
**Real-time Metrics Display:**
- Total users (free/premium breakdown)
- Active users (DAU/WAU/MAU)
- Revenue metrics (MRR, ARR, LTV)
- Conversion rates
- System health indicators
- AI usage and costs
- Top performing habits categories

#### 2. User Management

**User Search & Filter:**
```javascript
{
  "search_criteria": {
    "email": "string",
    "username": "string",
    "user_id": "string",
    "account_type": ["free", "premium"],
    "registration_date_range": {
      "from": "date",
      "to": "date"
    },
    "last_active_range": {
      "from": "date",
      "to": "date"
    },
    "habit_count_range": {
      "min": "number",
      "max": "number"
    },
    "subscription_status": ["active", "canceled", "expired"],
    "country": "string",
    "referral_source": "string"
  }
}
```

**User Actions:**
- View detailed user profile
- Modify account type
- Grant/revoke features
- Reset user data
- Send direct messages
- Issue refunds
- Ban/unban users
- View user's habits and progress
- Access support tickets
- Manual subscription adjustments

#### 3. Configuration Management

**Dynamic Settings Editor:**

```javascript
// Admin UI Component Structure
{
  "sections": [
    {
      "title": "Free Tier Limits",
      "settings": [
        {
          "key": "max_active_habits",
          "type": "number",
          "label": "Maximum Active Habits",
          "description": "Number of habits free users can track simultaneously",
          "min": 1,
          "max": 10,
          "current_value": 3,
          "default_value": 3,
          "requires_confirmation": true,
          "affects_existing_users": true
        },
        {
          "key": "ai_requests_per_day",
          "type": "number",
          "label": "Daily AI Requests",
          "description": "Maximum AI-powered insights per day",
          "min": 0,
          "max": 100,
          "current_value": 5,
          "default_value": 5,
          "requires_confirmation": true
        },
        {
          "key": "smart_reminders_enabled",
          "type": "boolean",
          "label": "Smart Reminders",
          "description": "Enable AI-optimized reminder timing",
          "current_value": false,
          "default_value": false
        }
      ]
    }
  ]
}
```

**Configuration Change Workflow:**
1. Admin modifies setting
2. Preview impact (number of affected users)
3. Set activation time (immediate/scheduled)
4. Confirmation required for critical changes
5. Automatic backup of previous configuration
6. Change logged with admin details
7. Optional user notification
8. Rollback capability

#### 4. Analytics & Insights

**Custom Report Builder:**
- Drag-and-drop metrics selection
- Date range selection
- User segment filtering
- Export capabilities (CSV, PDF, JSON)
- Scheduled report generation
- Email delivery of reports

**Key Reports:**
- User acquisition funnel
- Feature usage heat map
- Conversion analysis
- Churn prediction
- Revenue forecasting
- AI usage and costs
- Habit success rates by category
- Geographic distribution

#### 5. Content Management

**Manage App Content:**
- Motivational quotes database
- Habit tips and guides
- Challenge templates
- Achievement definitions
- Notification templates
- Email templates
- In-app announcements
- Terms of service
- Privacy policy

#### 6. Financial Management

**Revenue Dashboard:**
- Payment processing status
- Failed payment recovery
- Refund management
- Coupon/promotion creation
- Invoice generation
- Tax reporting
- Stripe webhook monitoring
- Subscription lifecycle management

#### 7. Support Tools

**Customer Support Interface:**
- Ticket queue management
- User conversation history
- Canned responses
- Issue categorization
- Priority levels
- SLA tracking
- Escalation workflows
- Knowledge base management

#### 8. System Administration

**Technical Controls:**
- Firebase usage monitoring
- API rate limit configuration
- Cache management
- Database maintenance
- Backup scheduling
- Security audit logs
- Performance monitoring
- Error tracking
- Feature flag management
- A/B test configuration

---

## Backend Configuration Management

### Configuration Service Architecture

```typescript
// services/ConfigurationService.ts
interface ConfigurationService {
  // Fetch configurations with caching
  getUserLimits(userId: string, tier: 'free' | 'premium'): Promise<UserLimits>;
  
  // Check specific permissions
  canCreateHabit(userId: string): Promise<boolean>;
  canAddRecord(userId: string, habitId: string): Promise<boolean>;
  canUseAIFeature(userId: string, feature: string): Promise<boolean>;
  
  // Update configurations (admin only)
  updateTierLimits(tier: string, limits: Partial<TierLimits>): Promise<void>;
  updateFeatureFlag(flag: string, value: any): Promise<void>;
  updatePricing(plan: string, pricing: PricingConfig): Promise<void>;
  
  // Cache management
  invalidateCache(key?: string): Promise<void>;
  preloadConfigurations(): Promise<void>;
}
```

### Caching Strategy

```javascript
// Cache configuration in Redis/Memory
{
  "cache_keys": {
    "tier_limits:free": {
      "data": {/* limits object */},
      "ttl": 3600,  // 1 hour
      "last_updated": "timestamp"
    },
    "tier_limits:premium": {
      "data": {/* limits object */},
      "ttl": 3600,
      "last_updated": "timestamp"
    },
    "feature_flags": {
      "data": {/* flags object */},
      "ttl": 300,  // 5 minutes for faster updates
      "last_updated": "timestamp"
    },
    "user:userId:limits": {
      "data": {/* computed user limits */},
      "ttl": 1800,  // 30 minutes
      "last_updated": "timestamp"
    }
  }
}
```

### Configuration Change Propagation

```javascript
// Cloud Function: onConfigurationChange
exports.onConfigurationChange = functions.firestore
  .document('system_configs/{configType}')
  .onUpdate(async (change, context) => {
    const configType = context.params.configType;
    const before = change.before.data();
    const after = change.after.data();
    
    // Log the change
    await logConfigChange(configType, before, after, context.auth);
    
    // Invalidate relevant caches
    await invalidateCache(configType);
    
    // Notify affected users if needed
    if (shouldNotifyUsers(configType, before, after)) {
      await notifyAffectedUsers(configType, after);
    }
    
    // Update analytics
    await trackConfigChange(configType, before, after);
    
    // Trigger any dependent updates
    await updateDependentSystems(configType, after);
  });
```

### User Limit Checking Middleware

```typescript
// middleware/LimitChecker.ts
export class LimitChecker {
  async checkHabitCreation(userId: string): Promise<void> {
    const limits = await getUserLimits(userId);
    const currentHabits = await getUserHabitCount(userId);
    
    if (limits.habits.max_active !== -1 && 
        currentHabits >= limits.habits.max_active) {
      throw new LimitExceededError('habit_limit_reached', {
        limit: limits.habits.max_active,
        current: currentHabits,
        upgrade_required: true
      });
    }
  }
  
  async checkRecordCreation(userId: string, habitId: string): Promise<void> {
    const limits = await getUserLimits(userId);
    const monthlyRecords = await getMonthlyRecordCount(userId, habitId);
    
    if (limits.records.max_per_habit_per_month !== -1 && 
        monthlyRecords >= limits.records.max_per_habit_per_month) {
      throw new LimitExceededError('record_limit_reached', {
        limit: limits.records.max_per_habit_per_month,
        current: monthlyRecords,
        upgrade_required: true
      });
    }
  }
  
  async checkAIUsage(userId: string, feature: string): Promise<void> {
    const limits = await getUserLimits(userId);
    const dailyUsage = await getAIDailyUsage(userId);
    
    if (!limits.ai_features[feature]) {
      throw new FeatureLockedError(feature, {
        upgrade_required: true
      });
    }
    
    if (limits.ai_features.max_ai_requests_per_day !== -1 && 
        dailyUsage >= limits.ai_features.max_ai_requests_per_day) {
      throw new LimitExceededError('ai_daily_limit_reached', {
        limit: limits.ai_features.max_ai_requests_per_day,
        current: dailyUsage,
        resets_at: getNextResetTime()
      });
    }
  }
}
```

---

## Implementation Architecture

### Admin Panel Tech Stack

```javascript
// Admin Panel Structure (separate Next.js app)
admin/
  components/
    Dashboard/
      MetricsGrid.tsx
      RevenueChart.tsx
      UserActivityMap.tsx
    UserManagement/
      UserTable.tsx
      UserDetails.tsx
      UserActions.tsx
    Configuration/
      LimitEditor.tsx
      FeatureFlagManager.tsx
      PricingEditor.tsx
    Analytics/
      ReportBuilder.tsx
      ChartLibrary.tsx
      ExportTools.tsx
    Support/
      TicketQueue.tsx
      ConversationView.tsx
      ResponseTemplates.tsx
  services/
    AdminAuthService.ts
    ConfigurationService.ts
    UserManagementService.ts
    AnalyticsService.ts
    SupportService.ts
  hooks/
    useAdminAuth.ts
    useRealtimeMetrics.ts
    useConfiguration.ts
  pages/
    dashboard.tsx
    users/
    configuration/
    analytics/
    support/
    settings/
```

### Security for Admin Panel

```typescript
// Admin Authentication & Authorization
interface AdminUser {
  uid: string;
  email: string;
  role: 'super_admin' | 'admin' | 'support' | 'analyst';
  permissions: string[];
  twoFactorEnabled: boolean;
  lastLogin: Date;
  ipWhitelist: string[];
}

// Permission-based access control
const permissions = {
  'super_admin': ['*'],  // All permissions
  'admin': [
    'users:read',
    'users:write',
    'config:read',
    'config:write',
    'analytics:read',
    'support:read',
    'support:write'
  ],
  'support': [
    'users:read',
    'support:read',
    'support:write'
  ],
  'analyst': [
    'users:read',
    'analytics:read'
  ]
};

// Audit logging for all admin actions
interface AuditLog {
  timestamp: Date;
  adminId: string;
  action: string;
  target: string;
  changes: object;
  ipAddress: string;
  userAgent: string;
}
```

### Database Rules for Configuration

```javascript
// Firestore Security Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // System configurations - only admins can write
    match /system_configs/{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                      request.auth.token.admin == true;
    }
    
    // User limits cache - computed by Cloud Functions
    match /user_limits/{userId} {
      allow read: if request.auth != null && 
                     request.auth.uid == userId;
      allow write: if false; // Only Cloud Functions can write
    }
    
    // Audit logs - admins only
    match /audit_logs/{document=**} {
      allow read: if request.auth != null && 
                     request.auth.token.admin == true;
      allow write: if false; // Only Cloud Functions can write
    }
  }
}
```

---

## User Experience for Account Types

### Free User Experience

#### Upgrade Prompts (Configurable)

```typescript
interface UpgradePrompt {
  trigger: 'limit_reached' | 'feature_locked' | 'periodic' | 'achievement';
  title: string;
  message: string;
  benefits: string[];
  cta_text: string;
  dismissible: boolean;
  show_pricing: boolean;
  special_offer?: {
    discount: number;
    expires_in: number;  // hours
  };
}

// Dynamic upgrade prompts based on user behavior
const getUpgradePrompt = (context: UserContext): UpgradePrompt => {
  if (context.trigger === 'habit_limit') {
    return {
      trigger: 'limit_reached',
      title: 'Unlock Unlimited Habits',
      message: `You've reached your limit of ${context.limit} habits.`,
      benefits: [
        'Track unlimited habits',
        'AI-powered insights',
        'Advanced visualizations',
        'Priority support'
      ],
      cta_text: 'Upgrade to Pro',
      dismissible: true,
      show_pricing: true
    };
  }
  // ... other prompt configurations
};
```

#### Feature Locking UI

```typescript
// Component for locked features
const LockedFeature: React.FC<{feature: string}> = ({feature, children}) => {
  const userTier = useUserTier();
  const limits = useUserLimits();
  
  if (!limits[feature] && userTier === 'free') {
    return (
      <div className="locked-feature">
        <div className="blur-overlay">
          {children}
        </div>
        <div className="lock-message">
          <LockIcon />
          <p>This feature is available in HabitForge Pro</p>
          <button onClick={showUpgradeModal}>
            Unlock Now
          </button>
        </div>
      </div>
    );
  }
  
  return children;
};
```

### Premium User Benefits Display

```typescript
// Premium user dashboard enhancements
const PremiumBadges = () => (
  <div className="premium-indicators">
    <Badge variant="gold">PRO</Badge>
    <div className="benefits-summary">
      <span>Unlimited Habits</span>
      <span>AI Insights Active</span>
      <span>Priority Support</span>
    </div>
  </div>
);

// Exclusive premium features
const PremiumFeatures = {
  aiCoaching: {
    dailyCoaching: true,
    personalizedPlans: true,
    advancedPredictions: true
  },
  visualizations: {
    ropeEffects: ['gold', 'rainbow', 'fire', 'ice'],
    advancedCharts: true,
    exportQuality: 'high'
  },
  community: {
    createChallenges: true,
    privateChallenges: true,
    coachingAccess: true
  }
};
```

### Subscription Management Interface

```typescript
// User's subscription settings page
interface SubscriptionView {
  current_plan: {
    name: string;
    price: number;
    billing_cycle: 'monthly' | 'yearly';
    next_billing_date: Date;
    status: 'active' | 'canceled' | 'past_due';
  };
  usage: {
    habits_used: number;
    habits_limit: number | 'unlimited';
    ai_requests_today: number;
    ai_requests_limit: number | 'unlimited';
    storage_used_mb: number;
    storage_limit_mb: number | 'unlimited';
  };
  available_actions: {
    upgrade: boolean;
    downgrade: boolean;
    cancel: boolean;
    change_payment: boolean;
    apply_promo: boolean;
  };
  billing_history: Transaction[];
}
```

---

## Admin Panel Features Priority

### Phase 1: Essential Admin Tools (Week 1-2)
1. Basic admin authentication
2. User search and view
3. Configuration editor for limits
4. Basic metrics dashboard
5. Manual user account modifications

### Phase 2: Advanced Management (Week 3-4)
1. Complete configuration management
2. Feature flag system
3. Advanced user actions
4. Basic analytics
5. Audit logging

### Phase 3: Analytics & Support (Week 5-6)
1. Custom report builder
2. Revenue analytics
3. Support ticket system
4. Content management
5. A/B testing framework

### Phase 4: Automation & Scale (Week 7-8)
1. Automated workflows
2. Bulk user operations
3. Advanced security features
4. Performance monitoring
5. API for external integrations

---

## Critical Implementation Notes

### 1. Configuration Loading Strategy
```typescript
// Load configurations on app initialization
const initializeApp = async () => {
  // Cache configurations locally
  const configs = await ConfigService.loadAllConfigurations();
  
  // Store in context/redux
  store.dispatch(setConfigurations(configs));
  
  // Set up real-time listeners for changes
  ConfigService.subscribeToChanges((updates) => {
    store.dispatch(updateConfigurations(updates));
  });
  
  // Refresh cache periodically
  setInterval(() => {
    ConfigService.refreshCache();
  }, CACHE_REFRESH_INTERVAL);
};
```

### 2. Graceful Degradation
```typescript
// Handle configuration fetch failures
const getLimit = async (limitKey: string): Promise<number> => {
  try {
    const config = await ConfigService.getLimit(limitKey);
    return config;
  } catch (error) {
    console.error('Failed to fetch limit:', error);
    // Fall back to cached value
    const cached = await CacheService.get(limitKey);
    if (cached) return cached;
    // Final fallback to conservative default
    return DEFAULT_LIMITS[limitKey];
  }
};
```

### 3. User Communication
```typescript
// Notify users of configuration changes
const notifyConfigChange = async (change: ConfigChange) => {
  if (change.affects_users) {
    const notification = {
      title: 'App Update',
      message: change.user_message || 'We've made improvements to HabitForge!',
      type: 'system',
      priority: change.priority || 'normal'
    };
    
    await NotificationService.sendToAffectedUsers(
      change.affected_user_ids || 'all',
      notification
    );
  }
};
```

### 4. Testing Configuration Changes
```typescript
// Test configuration changes before applying
const testConfiguration = async (newConfig: Configuration) => {
  // Create test environment
  const testEnv = await createTestEnvironment();
  
  // Apply configuration
  await testEnv.applyConfiguration(newConfig);
  
  // Run automated tests
  const results = await testEnv.runTests([
    'user_limit_enforcement',
    'feature_access_control',
    'payment_processing',
    'notification_delivery'
  ]);
  
  // Validate results
  if (results.passed) {
    return { success: true, results };
  } else {
    return { success: false, errors: results.errors };
  }
};
```

---

## Conclusion

This comprehensive system ensures that HabitForge can scale effectively with complete control over monetization, user limits, and feature access. The dynamic configuration system allows for:

1. **Flexible Monetization**: Adjust pricing and limits without code changes
2. **A/B Testing**: Test different limit configurations for optimization
3. **Market Adaptation**: Quickly respond to competitive pressures
4. **User Segmentation**: Create custom tiers for different user groups
5. **Revenue Optimization**: Fine-tune the free/premium balance

The admin panel provides complete control while maintaining security and audit trails. All configurations are stored in Firestore, cached for performance, and can be updated in real-time without requiring app updates.

This architecture supports growth from launch to millions of users while maintaining flexibility to adapt to market needs and user feedback.