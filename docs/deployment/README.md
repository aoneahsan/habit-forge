# Deployment Guide

## Prerequisites
- Firebase CLI installed (`npm install -g firebase-tools`)
- Firebase project created
- Environment variables configured

## Production Deployment

### 1. Build the Application
```bash
yarn build
```
This creates an optimized production build in the `dist` directory.

### 2. Deploy Firebase Rules & Indexes
```bash
firebase deploy --only firestore:rules,firestore:indexes
```

### 3. Deploy to Firebase Hosting
```bash
firebase deploy --only hosting
```

### 4. Full Deployment
```bash
yarn build && firebase deploy
```

## Environment Configuration

### Development (.env.local)
```env
VITE_FIREBASE_API_KEY=dev-api-key
VITE_FIREBASE_AUTH_DOMAIN=dev-auth-domain
VITE_FIREBASE_PROJECT_ID=dev-project-id
VITE_FIREBASE_STORAGE_BUCKET=dev-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=dev-sender-id
VITE_FIREBASE_APP_ID=dev-app-id
VITE_PROJECT_PREFIX=hf2024_dev_
```

### Production (.env.production)
```env
VITE_FIREBASE_API_KEY=prod-api-key
VITE_FIREBASE_AUTH_DOMAIN=prod-auth-domain
VITE_FIREBASE_PROJECT_ID=prod-project-id
VITE_FIREBASE_STORAGE_BUCKET=prod-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=prod-sender-id
VITE_FIREBASE_APP_ID=prod-app-id
VITE_PROJECT_PREFIX=hf2024_
```

## CI/CD with GitHub Actions

### Workflow Configuration (.github/workflows/deploy.yml)
```yaml
name: Deploy to Firebase

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '24'
          
      - name: Install dependencies
        run: yarn install --frozen-lockfile
        
      - name: Run tests
        run: yarn test:ci
        
      - name: Build application
        run: yarn build
        env:
          VITE_FIREBASE_API_KEY: ${{ secrets.VITE_FIREBASE_API_KEY }}
          # ... other env variables
          
      - name: Deploy to Firebase
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          channelId: live
          projectId: habitforge-a1
```

## Mobile App Deployment

### Android
1. **Build the app**
```bash
yarn build
npx cap sync android
npx cap open android
```

2. **Generate signed APK**
- Open Android Studio
- Build → Generate Signed Bundle/APK
- Follow the wizard

3. **Deploy to Play Store**
- Upload APK to Google Play Console
- Fill in store listing details
- Submit for review

### iOS
1. **Build the app**
```bash
yarn build
npx cap sync ios
npx cap open ios
```

2. **Archive in Xcode**
- Product → Archive
- Validate and upload to App Store Connect

3. **Deploy to App Store**
- Complete app information
- Submit for review

## Database Migration

### Backup Current Data
```bash
firebase firestore:backup gs://habitforge-backups/backup-$(date +%Y%m%d)
```

### Restore Data
```bash
firebase firestore:restore gs://habitforge-backups/backup-20240101
```

### Schema Migrations
Use migration scripts in `scripts/migrations/`:
```bash
node scripts/migrations/001-add-new-field.js
```

## Monitoring

### Health Checks
- Firebase Hosting: Automatic monitoring
- Firestore: Monitor in Firebase Console
- Custom endpoint: `/api/health`

### Alerts Setup
1. Go to Firebase Console → Project Settings → Integrations
2. Set up alerts for:
   - Hosting downtime
   - Firestore quota limits
   - Authentication failures
   - Budget thresholds

## Rollback Procedures

### Quick Rollback
```bash
firebase hosting:rollback
```

### Code Rollback
```bash
git revert HEAD
git push origin main
```

### Database Rollback
```bash
firebase firestore:restore gs://habitforge-backups/last-known-good
```

## Performance Optimization

### Build Optimization
```json
{
  "build": {
    "rollupOptions": {
      "output": {
        "manualChunks": {
          "vendor": ["react", "react-dom"],
          "firebase": ["firebase/app", "firebase/auth", "firebase/firestore"],
          "ui": ["@radix-ui/themes"]
        }
      }
    }
  }
}
```

### CDN Configuration
- Static assets served from Firebase CDN
- Cache headers configured in `firebase.json`
- Image optimization with WebP format

## Security Checklist

- [ ] Environment variables secured
- [ ] Firebase rules deployed and tested
- [ ] API keys restricted by domain
- [ ] CORS configured properly
- [ ] CSP headers configured
- [ ] SSL certificate valid
- [ ] Dependency vulnerabilities scanned
- [ ] Security rules tested
- [ ] Rate limiting configured
- [ ] Error messages don't leak sensitive info

## Post-Deployment Verification

1. **Functional Testing**
   - User registration/login
   - Habit creation and tracking
   - Data persistence
   - Rope visualization

2. **Performance Testing**
   - Page load times < 3s
   - Time to Interactive < 5s
   - Lighthouse score > 90

3. **Security Testing**
   - Authentication flows
   - Authorization rules
   - Data validation
   - XSS prevention

## Troubleshooting

### Common Issues

**Build Failures**
```bash
rm -rf node_modules dist
yarn install
yarn build
```

**Deploy Failures**
```bash
firebase logout
firebase login
firebase use --add
```

**Permission Errors**
- Check Firebase project permissions
- Verify service account credentials
- Review Firestore rules

## Support

For deployment issues:
- Check Firebase Status: https://status.firebase.google.com
- Review logs: `firebase functions:log`
- Contact team lead for production issues