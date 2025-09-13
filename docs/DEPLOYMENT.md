# Deployment Guide

This guide covers deploying HabitForge to various platforms.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Firebase Deployment](#firebase-deployment)
- [Mobile App Deployment](#mobile-app-deployment)
- [PWA Deployment](#pwa-deployment)
- [CI/CD Setup](#cicd-setup)

## Prerequisites

- Node.js 22+ installed
- Yarn package manager
- Firebase CLI installed
- Active Firebase project
- Apple Developer account (for iOS)
- Google Play Developer account (for Android)

## Environment Setup

### 1. Environment Variables

Create `.env.production` file:
```env
VITE_FIREBASE_API_KEY=your_production_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_production_auth_domain
VITE_FIREBASE_PROJECT_ID=your_production_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_production_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_production_sender_id
VITE_FIREBASE_APP_ID=your_production_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_production_measurement_id
```

### 2. Firebase Configuration

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in project
firebase init
```

Select the following options:
- Hosting
- Firestore
- Functions
- Storage
- Emulators (for local development)

## Firebase Deployment

### 1. Build the Application

```bash
# Install dependencies
yarn install

# Build for production
yarn build
```

### 2. Deploy Firebase Services

```bash
# Deploy everything
firebase deploy

# Deploy specific services
firebase deploy --only hosting
firebase deploy --only firestore:rules
firebase deploy --only functions
firebase deploy --only storage:rules
```

### 3. Configure Firebase Services

#### Firestore Rules
Update `firestore.rules`:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /hf2024_users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Habits belong to users
    match /hf2024_habits/{habitId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.userId;
    }
    
    // Completions belong to users
    match /hf2024_completions/{completionId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.userId;
    }
  }
}
```

#### Storage Rules
Update `storage.rules`:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Mobile App Deployment

### iOS Deployment

#### 1. Build for iOS
```bash
# Build the web app
yarn build

# Sync with Capacitor
npx cap sync ios

# Open in Xcode
npx cap open ios
```

#### 2. Configure in Xcode
- Set Bundle Identifier: `com.habitforge.app`
- Configure signing certificates
- Set deployment target to iOS 13.0+
- Add required capabilities:
  - Push Notifications
  - Background Modes
  - Sign in with Apple

#### 3. Submit to App Store
1. Archive the app in Xcode
2. Upload to App Store Connect
3. Fill in app information
4. Submit for review

### Android Deployment

#### 1. Build for Android
```bash
# Build the web app
yarn build

# Sync with Capacitor
npx cap sync android

# Open in Android Studio
npx cap open android
```

#### 2. Configure in Android Studio
- Set Application ID: `com.habitforge.app`
- Configure signing keys
- Set minimum SDK to 21
- Add required permissions in `AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

#### 3. Generate Release APK/AAB
```bash
# Generate release build
cd android
./gradlew assembleRelease
# or for AAB
./gradlew bundleRelease
```

#### 4. Submit to Google Play
1. Upload AAB to Google Play Console
2. Fill in app listing details
3. Set up pricing and distribution
4. Submit for review

## PWA Deployment

### 1. Verify PWA Configuration

Ensure these files are properly configured:
- `/public/manifest.json`
- `/public/sw.js`
- Meta tags in `index.html`

### 2. Test PWA Features

```bash
# Build and serve locally
yarn build
yarn preview

# Test with Lighthouse
# Open Chrome DevTools > Lighthouse > Generate report
```

### 3. Deploy PWA

The PWA is automatically deployed with Firebase Hosting:
```bash
firebase deploy --only hosting
```

### 4. Verify PWA Installation

Visit your deployed site and verify:
- Install prompt appears
- Offline functionality works
- Push notifications work
- App opens in standalone mode

## CI/CD Setup

### GitHub Actions

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Firebase

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '22'
        
    - name: Install dependencies
      run: yarn install --frozen-lockfile
      
    - name: Run tests
      run: yarn test
      
    - name: Build application
      run: yarn build
      env:
        VITE_FIREBASE_API_KEY: ${{ secrets.VITE_FIREBASE_API_KEY }}
        VITE_FIREBASE_AUTH_DOMAIN: ${{ secrets.VITE_FIREBASE_AUTH_DOMAIN }}
        VITE_FIREBASE_PROJECT_ID: ${{ secrets.VITE_FIREBASE_PROJECT_ID }}
        VITE_FIREBASE_STORAGE_BUCKET: ${{ secrets.VITE_FIREBASE_STORAGE_BUCKET }}
        VITE_FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.VITE_FIREBASE_MESSAGING_SENDER_ID }}
        VITE_FIREBASE_APP_ID: ${{ secrets.VITE_FIREBASE_APP_ID }}
        
    - name: Deploy to Firebase
      uses: FirebaseExtended/action-hosting-deploy@v0
      with:
        repoToken: '${{ secrets.GITHUB_TOKEN }}'
        firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
        channelId: live
        projectId: ${{ secrets.VITE_FIREBASE_PROJECT_ID }}
```

### Setting up Secrets

Add these secrets to your GitHub repository:
1. Go to Settings > Secrets and variables > Actions
2. Add all `VITE_FIREBASE_*` environment variables
3. Add `FIREBASE_SERVICE_ACCOUNT` (get from Firebase Console)

## Production Checklist

### Before Deployment
- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Firebase rules updated
- [ ] Security headers configured
- [ ] Error tracking setup (Sentry)
- [ ] Analytics configured
- [ ] Performance optimized
- [ ] SEO meta tags updated
- [ ] SSL certificate active
- [ ] Backup strategy in place

### After Deployment
- [ ] Verify all features work
- [ ] Test on multiple devices
- [ ] Monitor error logs
- [ ] Check performance metrics
- [ ] Verify analytics tracking
- [ ] Test push notifications
- [ ] Verify offline functionality
- [ ] Submit sitemaps to search engines
- [ ] Monitor user feedback
- [ ] Set up uptime monitoring

## Monitoring

### Firebase Monitoring
- Use Firebase Console for:
  - Real-time database usage
  - Authentication metrics
  - Hosting bandwidth
  - Cloud Functions logs
  - Crashlytics reports

### Performance Monitoring
```javascript
// Add to src/main.tsx
import { getAnalytics, logEvent } from 'firebase/analytics';
import { getPerformance } from 'firebase/performance';

const analytics = getAnalytics(app);
const perf = getPerformance(app);

// Log custom events
logEvent(analytics, 'habit_completed', {
  habit_name: 'Morning Meditation',
  streak_count: 10
});
```

### Error Tracking
```javascript
// Add error boundary and logging
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  // Send to error tracking service
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  // Send to error tracking service
});
```

## Rollback Strategy

If issues occur after deployment:

```bash
# View deployment history
firebase hosting:releases:list

# Rollback to previous version
firebase hosting:rollback

# Or deploy specific version
firebase hosting:clone SOURCE_VERSION_ID TARGET_CHANNEL_ID
```

## Support

For deployment issues:
- Check Firebase Status: https://status.firebase.google.com/
- Firebase Support: https://firebase.google.com/support
- GitHub Issues: [Your repository issues]
- Email: support@habitforge.app