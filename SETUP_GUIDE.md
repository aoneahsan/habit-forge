# HabitForge - Developer Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 22+ LTS
- Yarn package manager
- Firebase account
- Git

### Initial Setup

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/habitforge.git
cd habitforge
```

2. **Install dependencies**
```bash
yarn install
```

3. **Configure Firebase for Development**

⚠️ **IMPORTANT**: The `.env` file in the repository contains placeholder values. You need to set up your own Firebase configuration for development.

#### Option A: Use Your Own Firebase Project (Recommended)
1. Create a new Firebase project at https://console.firebase.google.com
2. Enable Authentication (Email/Password and Google)
3. Enable Firestore Database
4. Enable Storage
5. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```
6. Get your Firebase config from Firebase Console > Project Settings > General
7. Update `.env.local` with your Firebase configuration

#### Option B: Use the Existing Project (Team Members Only)
1. Contact the project admin for the actual Firebase API key
2. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```
3. Update the `VITE_FIREBASE_API_KEY` with the actual key provided

### Environment Variables

Create a `.env.local` file with:

```env
# Firebase Configuration (Get from Firebase Console)
VITE_FIREBASE_API_KEY=your_actual_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# Firebase Emulator (Set to true for local development without Firebase)
VITE_USE_FIREBASE_EMULATOR=false

# Feature Flags
VITE_ENABLE_PWA=true
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_ERROR_TRACKING=true
```

## 🔥 Firebase Setup

### Deploy Firebase Rules and Indexes

1. **Login to Firebase CLI**
```bash
firebase login
```

2. **Select your project**
```bash
firebase use your-project-id
```

3. **Deploy Firestore rules and indexes**
```bash
firebase deploy --only firestore
```

4. **Deploy Storage rules**
```bash
firebase deploy --only storage
```

### Using Firebase Emulators (Optional)

For local development without consuming Firebase quotas:

1. **Install Firebase tools**
```bash
npm install -g firebase-tools
```

2. **Start emulators**
```bash
firebase emulators:start
```

3. **Update `.env.local`**
```env
VITE_USE_FIREBASE_EMULATOR=true
```

## 🛠️ Development

### Start the development server
```bash
yarn dev
```

The app will be available at http://localhost:6351

### Build for production
```bash
yarn build
```

### Run tests
```bash
yarn test
```

### Lint and format code
```bash
yarn lint
yarn format
```

## 📱 Mobile Development (Capacitor)

### iOS Development
```bash
yarn cap:build
yarn cap:ios
```

### Android Development
```bash
yarn cap:build
yarn cap:android
```

## 🚀 Deployment

### Deploy to Firebase Hosting
```bash
yarn build
firebase deploy --only hosting
```

### Deploy Everything
```bash
yarn build
firebase deploy
```

## 🔧 Troubleshooting

### Common Issues

1. **"API key not valid" Error**
   - You're using placeholder API keys
   - Solution: Set up your own Firebase project or get the actual keys from admin

2. **"Maximum update depth exceeded" Error**
   - This is a React state management issue
   - Solution: Pull the latest code which has this fix

3. **Firebase Emulator Connection Issues**
   - The app is trying to connect to emulators in production
   - Solution: Ensure `VITE_USE_FIREBASE_EMULATOR` is set to `false` for production builds

4. **Missing Icons/PWA Issues**
   - PWA icons are not loading
   - Solution: The latest deployment includes SVG icons that should work

### Development Tips

- Always use `.env.local` for local development (it's gitignored)
- Never commit actual API keys to the repository
- Use Firebase emulators for development to avoid quotas
- Run `yarn lint` before committing code
- Test on both desktop and mobile views

## 📚 Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [React Documentation](https://react.dev)
- [TanStack Router](https://tanstack.com/router)
- [Tailwind CSS](https://tailwindcss.com)
- [Capacitor Documentation](https://capacitorjs.com)

## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

**Need Help?** Open an issue or contact the maintainers.