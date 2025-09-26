# HabitForge - Admin Panel & Dynamic Configuration System

## Core Principle
**ZERO HARDCODED LIMITS** - Every limitation, feature flag, and configuration is stored in Firestore and controlled through the admin panel.

---

## Database-Driven Configuration System

### Firestore Configuration Structure

```javascript
// Collection: system_configs/settings
{
  "account_tiers": {
    "free": {
      "limits": {
        "habits": {
          "max_active": 3,
          "max_total": 5,
          "can_create": true,
          "can_delete": true,
          "can_archive": true
        },
        "entries": {
          "max_per_habit_monthly": 30,
          "max_per_habit_daily": 3,
          "max_total_monthly": 100,
          "can_backdate": false,
          "backdate_days_limit": 7,
          "can_add_photos": false,
          "max_photos_per_entry": 0,
          "can_add_voice_notes": false
        },
        "tracking": {
          "five_factors_enabled": true,
          "additional_fields_enabled": false,
          "quick_entry_enabled": true,
          "batch_entry_enabled": false
        },
        "ai": {
          "basic_insights": true,
          "pattern_recognition": false,
          "predictive_analytics": false,
          "smart_coaching": false,
          "personalized_recommendations": false,
          "success_prediction": false,
          "risk_warnings": false,
          "daily_ai_requests": 5,
          "ai_generated_tips": true
        },
        "visualizations": {
          "basic_rope": true,
          "animated_effects": false,
          "material_progression": false,
          "particle_effects": false,
          "milestone_animations": false,
          "custom_colors": false,
          "advanced_charts": false,
          "heat_maps": false,
          "correlation_matrix": false,
          "export_charts": false
        },
        "notifications": {
          "basic_reminders": true,
          "smart_scheduling": false,
          "location_based": false,
          "adaptive_timing": false,
          "motivational_messages": true,
          "max_daily": 5,
          "custom_messages": false,
          "voice_reminders": false,
          "calendar_integration": false
        },
        "analytics": {
          "view_basic_stats": true,
          "history_days": 30,
          "detailed_insights": false,
          "export_data": false,
          "api_access": false,
          "custom_reports": false,
          "share_progress": false
        },
        "social": {
          "view_community": true,
          "post_stories": false,
          "join_challenges": false,
          "create_challenges": false,
          "buddy_system": false,
          "groups_access": false,
          "messaging": false,
          "leaderboards": true
        },
        "gamification": {
          "earn_badges": true,
          "view_achievements": true,
          "levels_enabled": true,
          "max_level": 10,
          "custom_badges": false,
          "trophy_room": false
        },
        "storage": {
          "max_storage_mb": 100,
          "cloud_backup": false,
          "auto_sync": true,
          "offline_days": 7
        }
      },
      "ui_config": {
        "show_upgrade_prompts": true,
        "upgrade_prompt_frequency_days": 7,
        "show_locked_features": true,
        "locked_feature_preview": true,
        "show_usage_limits": true,
        "theme_options": ["light", "dark"],
        "custom_themes": false
      }
    },
    "premium": {
      "limits": {
        // All values set to -1 (unlimited) or true
        "habits": {
          "max_active": -1,
          "max_total": -1,
          "can_create": true,
          "can_delete": true,
          "can_archive": true
        },
        // ... all features enabled
      }
    }
  },
  "feature_flags": {
    "global": {
      "maintenance_mode": false,
      "allow_registration": true,
      "require_email_verification": true,
      "allow_social_login": true,
      "enable_analytics": true,
      "enable_crash_reporting": true,
      "enable_performance_monitoring": true
    },
    "features": {
      "ai_coaching": {
        "enabled": true,
        "rollout_percentage": 100,
        "whitelist_users": [],
        "blacklist_users": []
      },
      "community": {
        "enabled": true,
        "moderation_required": true,
        "auto_moderation": true
      },
      "payments": {
        "enabled": true,
        "providers": ["stripe"],
        "currencies": ["USD", "EUR", "GBP"],
        "tax_calculation": true
      }
    },
    "experiments": {
      "new_onboarding": {
        "enabled": false,
        "percentage": 50,
        "start_date": "2024-01-01",
        "end_date": "2024-02-01"
      }
    }
  },
  "pricing": {
    "plans": {
      "monthly": {
        "price": 9.99,
        "currency": "USD",
        "stripe_price_id": "price_xxx",
        "trial_days": 7,
        "active": true,
        "features_description": []
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
        "limited_slots": 1000
      }
    },
    "discounts": {
      "student": {
        "percentage": 50,
        "verification_required": true,
        "active": true
      },
      "referral": {
        "giver_months_free": 1,
        "receiver_discount": 20,
        "active": true
      }
    },
    "promotions": [
      {
        "code": "LAUNCH50",
        "discount": 50,
        "type": "percentage",
        "valid_from": "2024-01-01",
        "valid_until": "2024-02-01",
        "max_uses": 1000,
        "used_count": 0,
        "first_time_only": true
      }
    ]
  },
  "content": {
    "motivational_quotes": {
      "enabled": true,
      "daily_count": 3,
      "categories": ["general", "morning", "evening", "struggle"],
      "languages": ["en", "es", "fr"]
    },
    "tips": {
      "enabled": true,
      "frequency": "daily",
      "personalized": true
    },
    "challenges": {
      "weekly_enabled": true,
      "monthly_enabled": true,
      "seasonal_enabled": true,
      "user_created_allowed": false
    }
  },
  "notifications": {
    "templates": {
      "reminder": {
        "title": "Time for {{habit_name}}!",
        "body": "Don't break your {{streak_count}} day streak!",
        "action": "Track Now"
      },
      "achievement": {
        "title": "Achievement Unlocked!",
        "body": "You've earned {{badge_name}}",
        "action": "View"
      }
    },
    "timing": {
      "quiet_hours_start": "22:00",
      "quiet_hours_end": "07:00",
      "batch_window_minutes": 15,
      "max_retry_attempts": 3
    }
  },
  "limits": {
    "rate_limiting": {
      "api_calls_per_minute": 60,
      "api_calls_per_hour": 1000,
      "uploads_per_day": 100
    },
    "security": {
      "max_login_attempts": 5,
      "lockout_duration_minutes": 30,
      "session_timeout_hours": 24,
      "require_strong_password": true,
      "min_password_length": 8
    }
  }
}
```

---

## Admin Panel Features

### 1. Dashboard Overview

#### Real-Time Metrics Section
```typescript
interface DashboardMetrics {
  users: {
    total: number;
    free: number;
    premium: number;
    active_today: number;
    active_week: number;
    active_month: number;
    new_today: number;
    churn_rate: number;
  };
  revenue: {
    mrr: number;
    arr: number;
    today: number;
    month: number;
    growth_rate: number;
    ltv: number;
    arpu: number;
  };
  habits: {
    total_created: number;
    active_habits: number;
    completion_rate: number;
    average_streak: number;
    top_categories: Category[];
  };
  system: {
    api_health: 'healthy' | 'degraded' | 'down';
    error_rate: number;
    response_time_ms: number;
    firebase_usage_percentage: number;
    storage_used_gb: number;
  };
}
```

#### Interactive Charts
- User growth over time
- Revenue trends
- Feature adoption rates
- Habit success rates by category
- Geographic distribution
- Device/platform breakdown

### 2. User Management System

#### User Search & Filtering
```typescript
interface UserSearchFilters {
  // Search
  query?: string;  // Email, name, or ID
  
  // Account
  account_type?: ('free' | 'premium')[];
  subscription_status?: ('active' | 'canceled' | 'expired')[];
  
  // Activity
  last_active?: DateRange;
  registration_date?: DateRange;
  habit_count?: NumberRange;
  streak_length?: NumberRange;
  
  // Demographics
  country?: string[];
  platform?: ('ios' | 'android' | 'web')[];
  app_version?: string[];
  
  // Behavior
  completion_rate?: NumberRange;
  ai_usage?: ('high' | 'medium' | 'low');
  community_participation?: boolean;
}
```

#### User Actions Panel
```typescript
interface UserActions {
  // Account Management
  changeAccountType(userId: string, type: 'free' | 'premium'): void;
  grantFeature(userId: string, feature: string, duration?: number): void;
  revokeFeature(userId: string, feature: string): void;
  extendTrial(userId: string, days: number): void;
  
  // Data Management
  exportUserData(userId: string): void;
  deleteUserData(userId: string): void;
  resetUserProgress(userId: string): void;
  
  // Communication
  sendMessage(userId: string, message: Message): void;
  sendPushNotification(userId: string, notification: Notification): void;
  
  // Support
  viewSupportTickets(userId: string): Ticket[];
  flagForReview(userId: string, reason: string): void;
  
  // Moderation
  suspendAccount(userId: string, duration: number, reason: string): void;
  banAccount(userId: string, reason: string): void;
  unbanAccount(userId: string): void;
}
```

### 3. Configuration Editor

#### Dynamic Settings Interface
```typescript
interface ConfigurationEditor {
  sections: ConfigSection[];
}

interface ConfigSection {
  id: string;
  title: string;
  description: string;
  settings: Setting[];
}

interface Setting {
  key: string;
  type: 'number' | 'boolean' | 'string' | 'select' | 'multiselect' | 'json';
  label: string;
  description: string;
  currentValue: any;
  defaultValue: any;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    options?: any[];
  };
  impact: {
    affects_users: number;
    requires_restart: boolean;
    reversible: boolean;
  };
}
```

#### Configuration Change Workflow
1. **Preview Changes**: Show affected users
2. **Validation**: Check for conflicts
3. **Schedule**: Immediate or scheduled
4. **Approval**: Require confirmation for critical changes
5. **Backup**: Auto-backup current config
6. **Deploy**: Apply changes
7. **Monitor**: Track impact
8. **Rollback**: One-click revert

### 4. Content Management

#### Quote Management
```typescript
interface QuoteManager {
  quotes: Quote[];
  categories: string[];
  languages: string[];
  
  addQuote(quote: Quote): void;
  editQuote(id: string, quote: Quote): void;
  deleteQuote(id: string): void;
  bulkImport(file: File): void;
  
  scheduleQuote(quote: Quote, date: Date): void;
  setQuoteRotation(algorithm: 'random' | 'sequential' | 'weighted'): void;
}
```

#### Challenge Templates
```typescript
interface ChallengeManager {
  templates: ChallengeTemplate[];
  
  createTemplate(template: ChallengeTemplate): void;
  scheduleChallenge(templateId: string, startDate: Date): void;
  customizeForSegment(templateId: string, segment: UserSegment): void;
  
  analytics: {
    participation_rate: number;
    completion_rate: number;
    user_feedback: number;
  };
}
```

### 5. Analytics & Reporting

#### Custom Report Builder
```typescript
interface ReportBuilder {
  metrics: Metric[];
  dimensions: Dimension[];
  filters: Filter[];
  
  createReport(config: ReportConfig): Report;
  scheduleReport(report: Report, schedule: Schedule): void;
  exportReport(report: Report, format: 'pdf' | 'csv' | 'json'): void;
}

interface ReportConfig {
  name: string;
  metrics: string[];
  dimensions: string[];
  filters: Filter[];
  visualization: 'table' | 'chart' | 'both';
  date_range: DateRange;
  comparison?: DateRange;
}
```

#### Predefined Reports
- User Acquisition Funnel
- Feature Adoption Matrix
- Revenue Attribution
- Churn Analysis
- Cohort Analysis
- A/B Test Results
- Geographic Performance
- Platform Comparison

### 6. A/B Testing Framework

#### Experiment Management
```typescript
interface ExperimentManager {
  experiments: Experiment[];
  
  createExperiment(config: ExperimentConfig): void;
  startExperiment(id: string): void;
  pauseExperiment(id: string): void;
  endExperiment(id: string): void;
  
  getResults(id: string): ExperimentResults;
  declareWinner(id: string, variant: string): void;
  rolloutWinner(id: string): void;
}

interface ExperimentConfig {
  name: string;
  hypothesis: string;
  variants: Variant[];
  metrics: string[];
  audience: AudienceFilter;
  traffic_percentage: number;
  minimum_sample_size: number;
  maximum_duration_days: number;
}
```

### 7. Financial Management

#### Subscription Overview
```typescript
interface SubscriptionManager {
  overview: {
    active_subscriptions: number;
    trial_users: number;
    canceled_this_month: number;
    failed_payments: number;
    refunds_processed: number;
  };
  
  actions: {
    processRefund(userId: string, amount: number, reason: string): void;
    retryPayment(userId: string): void;
    updatePaymentMethod(userId: string): void;
    applyCredit(userId: string, amount: number): void;
    createCoupon(coupon: Coupon): void;
  };
}
```

#### Revenue Analytics
- MRR breakdown by plan
- Churn and retention cohorts
- LTV by acquisition channel
- Payment failure reasons
- Refund analysis
- Discount impact

### 8. Support Tools

#### Ticket Management
```typescript
interface SupportSystem {
  tickets: Ticket[];
  
  filters: {
    status: ('open' | 'pending' | 'resolved')[];
    priority: ('low' | 'medium' | 'high' | 'critical')[];
    category: string[];
    assigned_to: string[];
  };
  
  actions: {
    assignTicket(ticketId: string, agentId: string): void;
    updateStatus(ticketId: string, status: string): void;
    addResponse(ticketId: string, response: string): void;
    escalate(ticketId: string): void;
    bulkResolve(ticketIds: string[]): void;
  };
  
  automation: {
    auto_assign: boolean;
    auto_categorize: boolean;
    canned_responses: CannedResponse[];
    sla_rules: SLARule[];
  };
}
```

### 9. System Administration

#### Performance Monitoring
```typescript
interface SystemMonitor {
  metrics: {
    api_latency: number[];
    error_rate: number;
    uptime_percentage: number;
    active_connections: number;
    database_size_gb: number;
    storage_used_gb: number;
  };
  
  alerts: {
    threshold_alerts: Alert[];
    anomaly_detection: boolean;
    notification_channels: ('email' | 'sms' | 'slack')[];
  };
  
  maintenance: {
    scheduleDowntime(start: Date, duration: number): void;
    runDatabaseCleanup(): void;
    optimizeIndexes(): void;
    clearCache(): void;
  };
}
```

---

## Implementation Strategy

### Configuration Loading

```typescript
// services/ConfigService.ts
class ConfigService {
  private cache: Map<string, any> = new Map();
  private listeners: Map<string, Function[]> = new Map();
  
  async loadConfiguration(): Promise<void> {
    // Load from Firestore
    const config = await firestore
      .collection('system_configs')
      .doc('settings')
      .get();
    
    // Cache locally
    this.cache.set('settings', config.data());
    
    // Setup real-time listener
    firestore
      .collection('system_configs')
      .doc('settings')
      .onSnapshot((snapshot) => {
        this.handleConfigUpdate(snapshot.data());
      });
  }
  
  async getUserLimits(userId: string): Promise<UserLimits> {
    const user = await this.getUser(userId);
    const tier = user.accountType || 'free';
    const settings = this.cache.get('settings');
    
    return settings.account_tiers[tier].limits;
  }
  
  async checkLimit(userId: string, limitKey: string): Promise<boolean> {
    const limits = await this.getUserLimits(userId);
    const value = this.getNestedValue(limits, limitKey);
    
    if (value === -1) return true; // Unlimited
    if (typeof value === 'boolean') return value;
    
    // Check current usage
    const usage = await this.getCurrentUsage(userId, limitKey);
    return usage < value;
  }
  
  subscribeToChanges(callback: Function): void {
    const listeners = this.listeners.get('config') || [];
    listeners.push(callback);
    this.listeners.set('config', listeners);
  }
  
  private handleConfigUpdate(newConfig: any): void {
    const oldConfig = this.cache.get('settings');
    this.cache.set('settings', newConfig);
    
    // Notify listeners
    const listeners = this.listeners.get('config') || [];
    listeners.forEach(listener => listener(newConfig, oldConfig));
    
    // Log change
    this.logConfigChange(oldConfig, newConfig);
  }
}
```

### Middleware for Limit Checking

```typescript
// middleware/LimitMiddleware.ts
export const checkLimits = (limitKey: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user.id;
    const canProceed = await ConfigService.checkLimit(userId, limitKey);
    
    if (!canProceed) {
      const limits = await ConfigService.getUserLimits(userId);
      const limitValue = ConfigService.getNestedValue(limits, limitKey);
      
      return res.status(403).json({
        error: 'limit_exceeded',
        message: `You have reached your limit of ${limitValue}`,
        limit: limitValue,
        upgrade_required: true,
        upgrade_url: '/upgrade'
      });
    }
    
    next();
  };
};

// Usage in routes
app.post('/api/habits', 
  checkLimits('habits.max_active'),
  createHabitHandler
);

app.post('/api/entries',
  checkLimits('entries.max_per_habit_daily'),
  createEntryHandler
);
```

### Frontend Limit Checking

```typescript
// hooks/useFeature.ts
export const useFeature = (featureKey: string) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const user = useUser();
  
  useEffect(() => {
    const checkFeature = async () => {
      const limits = await ConfigService.getUserLimits(user.id);
      const enabled = ConfigService.getNestedValue(limits, featureKey);
      setIsEnabled(enabled === true || enabled === -1);
      setIsLoading(false);
    };
    
    checkFeature();
    
    // Subscribe to changes
    const unsubscribe = ConfigService.subscribeToChanges(() => {
      checkFeature();
    });
    
    return unsubscribe;
  }, [featureKey, user.id]);
  
  return { isEnabled, isLoading };
};

// Usage in components
const HabitInsights = () => {
  const { isEnabled, isLoading } = useFeature('ai.pattern_recognition');
  
  if (isLoading) return <Spinner />;
  
  if (!isEnabled) {
    return <LockedFeature feature="AI Pattern Recognition" />;
  }
  
  return <InsightsDisplay />;
};
```

---

## Security & Permissions

### Admin Role System

```typescript
interface AdminRoles {
  super_admin: {
    permissions: ['*'];
    description: 'Full system access';
  };
  admin: {
    permissions: [
      'users:read',
      'users:write',
      'config:read',
      'config:write',
      'content:*',
      'analytics:read'
    ];
    description: 'General administration';
  };
  support: {
    permissions: [
      'users:read',
      'tickets:*',
      'content:read'
    ];
    description: 'Customer support';
  };
  analyst: {
    permissions: [
      'analytics:read',
      'users:read'
    ];
    description: 'Data analysis';
  };
  content_manager: {
    permissions: [
      'content:*',
      'challenges:*'
    ];
    description: 'Content management';
  };
}
```

### Audit Logging

```typescript
interface AuditLog {
  id: string;
  timestamp: Date;
  admin: {
    id: string;
    email: string;
    role: string;
  };
  action: string;
  target: {
    type: 'user' | 'config' | 'content' | 'system';
    id: string;
    details: any;
  };
  changes: {
    before: any;
    after: any;
  };
  metadata: {
    ip_address: string;
    user_agent: string;
    session_id: string;
  };
}

// Log all admin actions
const logAdminAction = async (action: AuditLog) => {
  await firestore.collection('audit_logs').add(action);
  
  // Alert on sensitive actions
  if (isSensitiveAction(action.action)) {
    await notifySecurityTeam(action);
  }
};
```

---

## Monitoring & Alerts

### Alert Configuration

```typescript
interface AlertConfig {
  metrics: {
    error_rate: {
      threshold: 1, // percentage
      window: 5, // minutes
      action: 'page_on_call'
    },
    api_latency: {
      threshold: 1000, // ms
      window: 5,
      action: 'send_email'
    },
    payment_failures: {
      threshold: 10, // count
      window: 60,
      action: 'notify_finance'
    },
    user_reports: {
      threshold: 5, // count
      window: 30,
      action: 'notify_support'
    }
  };
  
  channels: {
    email: string[];
    sms: string[];
    slack: {
      webhook_url: string;
      channel: string;
    };
    pagerduty: {
      api_key: string;
      service_id: string;
    };
  };
}
```

---

## Conclusion

This admin panel and configuration system provides complete control over HabitForge without requiring any code changes. Key benefits:

1. **Complete Flexibility**: Change any limit or feature instantly
2. **A/B Testing Ready**: Test different configurations on user segments
3. **Revenue Optimization**: Adjust pricing and limits based on data
4. **Risk Mitigation**: Rollback changes instantly if issues arise
5. **Compliance**: Audit trail for all changes
6. **Scalability**: System grows with your needs

The dynamic configuration approach ensures HabitForge can adapt to market conditions, user feedback, and business requirements without developer intervention, making it a truly scalable and maintainable platform.