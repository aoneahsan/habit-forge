# HabitForge 🎯

A powerful habit tracking application built with React, TypeScript, Firebase, and Capacitor. Track your habits, visualize progress with an innovative rope strength metaphor, and build lasting behavioral changes.

## 🌐 Live Demo

Visit the application at: [https://habitforge-a1.web.app](https://habitforge-a1.web.app)

## ✨ Features

### Core Features
- **Habit Management**: Create, edit, and track daily habits with customizable goals
- **Rope Visualization**: Unique rope strength metaphor showing habit consistency
- **Analytics Dashboard**: Comprehensive insights into habit patterns and progress
- **Streak Tracking**: Monitor consecutive days of habit completion
- **Five-Factor Analysis**: Based on "The Power of Habit" - track cue, routine, and reward

### Social Features
- **Community Feed**: Share progress and motivate others
- **Global Leaderboard**: Compete with users worldwide
- **Challenges**: Join community challenges for extra motivation
- **Friends System**: Connect with friends and track mutual habits

### Gamification
- **Achievement System**: Unlock achievements for milestones
- **Points & Rewards**: Earn points for consistency
- **Progress Levels**: Level up as you maintain habits

### Technical Features
- **Progressive Web App**: Install on any device
- **Offline Support**: Full functionality without internet
- **Cross-Platform**: Works on Web, iOS, and Android
- **Dark Mode**: Automatic theme switching
- **Real-time Sync**: Data syncs across all devices

## 🚀 Quick Start

### Prerequisites
- Node.js 22+ (LTS recommended)
- Yarn package manager
- Firebase account
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/habitforge.git
cd habitforge
```

2. **Install dependencies**
```bash
yarn install
```

3. **Set up Firebase**
   - Create a new Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
   - Enable Authentication (Email/Password and Google Sign-In)
   - Enable Firestore Database
   - Enable Storage
   - Copy your Firebase config

4. **Configure environment**
```bash
cp .env.example .env
```
Edit `.env` and add your Firebase configuration:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

5. **Run development server**
```bash
yarn dev
```

Visit `http://localhost:6351` to see the application.

## 📦 Building for Production

### Build the application
```bash
yarn build
```

### Test the production build locally
```bash
yarn preview
```

## 🚀 Deployment

### Deploy to Firebase Hosting

1. **Install Firebase CLI**
```bash
npm install -g firebase-tools
```

2. **Login to Firebase**
```bash
firebase login
```

3. **Initialize Firebase (if not already done)**
```bash
firebase init
```
Select:
- Hosting
- Firestore
- Storage
- Use existing project

4. **Deploy everything**
```bash
# Deploy Firestore rules
firebase deploy --only firestore:rules

# Deploy Firestore indexes
firebase deploy --only firestore:indexes

# Deploy Storage rules
firebase deploy --only storage

# Deploy hosting
firebase deploy --only hosting
```

Or deploy everything at once:
```bash
firebase deploy
```

## 📱 Mobile App Development

### Build for iOS
```bash
yarn add @capacitor/ios
npx cap add ios
yarn build
npx cap sync ios
npx cap open ios
```

### Build for Android
```bash
yarn add @capacitor/android
npx cap add android
yarn build
npx cap sync android
npx cap open android
```

## 🏗️ Project Structure

```
habitforge/
├── src/
│   ├── components/        # Reusable UI components
│   ├── routes/            # Page components and routing
│   ├── services/          # Firebase and API services
│   ├── stores/            # Zustand state management
│   ├── hooks/             # Custom React hooks
│   ├── types/             # TypeScript type definitions
│   ├── lib/               # Utility functions
│   └── constants/         # App constants and config
├── public/               # Static assets
├── firebase/             # Firebase configuration files
│   ├── firestore.rules   # Security rules
│   ├── firestore.indexes.json # Indexes
│   └── storage.rules     # Storage rules
└── docs/                 # Documentation

```

## 🔧 Technology Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **TanStack Router** - Type-safe routing
- **TanStack Query** - Data fetching and caching
- **Zustand** - State management
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Chart.js & D3.js** - Data visualization

### Backend
- **Firebase Auth** - Authentication
- **Cloud Firestore** - Database
- **Firebase Storage** - File storage
- **Firebase Hosting** - Web hosting

### Mobile
- **Capacitor** - Native mobile apps
- **PWA** - Progressive Web App features

### Development
- **Vite** - Build tool
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Cypress** - E2E testing
- **Vitest** - Unit testing

## 🧪 Testing

### Run unit tests
```bash
yarn test
```

### Run E2E tests
```bash
yarn cypress:open
```

### Run all tests
```bash
yarn test:all
```

## 🔐 Security

### Firestore Rules
- Users can only read/write their own data
- Habits are private by default
- Community features have public read access
- Admin operations require authentication

### Best Practices
- Environment variables for sensitive data
- Firebase Security Rules for data access
- HTTPS enforced on all deployments
- Regular dependency updates
- Input validation and sanitization

## 📊 Firebase Configuration

### Required Firestore Collections
- `hf2024_users` - User profiles
- `hf2024_habits` - User habits
- `hf2024_completions` - Habit completions
- `hf2024_posts` - Community posts
- `hf2024_challenges` - Community challenges
- `hf2024_achievements` - User achievements
- `hf2024_relationships` - Friend connections

### Storage Structure
```
/users/{userId}/profile/      # Profile images
/users/{userId}/habits/       # Habit images
/posts/{postId}/              # Post attachments
/achievements/                # Achievement badges
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update tests
5. Ensure all tests pass
6. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the `/docs` folder
- **Issues**: Report bugs on [GitHub Issues](https://github.com/yourusername/habitforge/issues)
- **Discussions**: Join our [GitHub Discussions](https://github.com/yourusername/habitforge/discussions)

## 🙏 Acknowledgments

- Built with React and Firebase
- Rope visualization inspired by behavioral psychology
- Five-Factor Model from "The Power of Habit" by Charles Duhigg
- Community features inspired by successful habit-tracking apps

## 📈 Performance

- **Lighthouse Score**: 95+ (Performance, Accessibility, Best Practices, SEO)
- **Bundle Size**: ~600KB gzipped
- **Time to Interactive**: <3 seconds on 3G
- **Offline Support**: Full functionality with service workers

## 🔄 Version History

- **v1.0.0** - Initial release with core features
  - Habit tracking with rope visualization
  - Community features
  - Achievement system
  - PWA support

---

Made with ❤️ by the HabitForge Team