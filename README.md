# HabitForge 🎯

Transform your life one habit at a time with HabitForge - a comprehensive habit tracking application built with modern web technologies and based on scientific habit formation principles.

![HabitForge Banner](./docs/images/banner.png)

## 🌟 Features

### Core Features
- **🔐 Authentication System** - Secure sign up/in with email or Google OAuth
- **📊 Dashboard** - Real-time stats, streak tracking, and progress overview
- **✅ Habit Management** - Create, edit, delete, and track daily habits
- **🎯 Five-Factor Model** - Based on "The Power of Habit" by Charles Duhigg
- **🏆 Points & Gamification** - Earn points and track achievements
- **📈 Analytics** - Detailed progress charts and insights
- **🌙 Dark Mode** - Beautiful dark theme support
- **📱 Mobile Apps** - iOS and Android apps via Capacitor
- **💾 Offline Support** - PWA with offline functionality
- **🔔 Notifications** - Reminders and push notifications

### Unique Features
- **🪢 Rope Visualization** - Unique D3.js visualization showing habit strength
- **📅 Streak Calendar** - Visual representation of your consistency
- **🎨 Customizable Categories** - Organize habits by category
- **⏰ Smart Reminders** - Time-based habit reminders
- **📊 Weekly Progress** - Track completion rates over time

## 🚀 Quick Start

### Prerequisites
- Node.js 22+ (LTS)
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

3. **Set up environment variables**
Create a `.env` file in the root directory:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

4. **Start the development server**
```bash
yarn dev
```

5. **Open your browser**
Navigate to `http://localhost:5173`

## 📱 Mobile Development

### Build for iOS
```bash
yarn build
npx cap sync ios
npx cap open ios
```

### Build for Android
```bash
yarn build
npx cap sync android
npx cap open android
```

## 🏗️ Project Structure

```
habitforge/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── dashboard/   # Dashboard-specific components
│   │   ├── habits/      # Habit management components
│   │   ├── layout/      # Layout components (Header, Sidebar)
│   │   ├── ui/          # Base UI components
│   │   └── visualization/ # D3.js visualizations
│   ├── config/          # Configuration files
│   ├── constants/       # App constants
│   ├── lib/            # Utility functions
│   ├── routes/         # TanStack Router pages
│   │   ├── _auth/      # Authentication pages
│   │   └── _protected/ # Protected pages
│   ├── services/       # API and external services
│   │   └── firebase/   # Firebase services
│   ├── stores/         # Zustand state management
│   └── types/          # TypeScript definitions
├── public/             # Static assets
├── docs/              # Documentation
├── android/           # Android project
├── ios/              # iOS project
└── [config files]    # Various configuration files
```

## 🛠️ Tech Stack

### Frontend
- **React 19.1.1** - UI library
- **TypeScript 5.9.2** - Type safety
- **Vite 6.0.7** - Build tool
- **Tailwind CSS v4** - Styling
- **Zustand 5.0.2** - State management
- **TanStack Router** - Type-safe routing
- **TanStack Query** - Data fetching
- **React Hook Form** - Form management
- **D3.js** - Data visualization
- **Zod** - Schema validation

### Backend
- **Firebase Auth** - Authentication
- **Firebase Firestore** - Database
- **Firebase Storage** - File storage
- **Firebase Functions** - Serverless functions
- **Firebase Hosting** - Web hosting

### Mobile
- **Capacitor 6.3.0** - Native runtime
- **PWA** - Progressive Web App
- **Service Workers** - Offline support

## 📝 API Documentation

### Authentication Endpoints
- `signUpWithEmail(email, password, displayName)` - Register new user
- `signInWithEmail(email, password)` - Sign in user
- `signInWithGoogle()` - Google OAuth
- `signOutUser()` - Sign out
- `sendPasswordReset(email)` - Password reset

### Habit Management
- `createHabit(userId, habitData)` - Create new habit
- `getUserHabits(userId)` - Get user's habits
- `updateHabit(habitId, data)` - Update habit
- `deleteHabit(habitId)` - Delete habit
- `completeHabit(habitId)` - Mark habit as complete

### User Profile
- `getUserProfile(userId)` - Get user profile
- `updateUserProfile(userId, updates)` - Update profile

## 🎨 Design System

### Colors
- **Primary**: Green (#10b981)
- **Secondary**: Blue (#3b82f6)
- **Danger**: Red (#ef4444)
- **Warning**: Yellow (#f59e0b)
- **Success**: Green (#10b981)

### Typography
- **Font Family**: System fonts
- **Headings**: Bold, various sizes
- **Body**: Regular, 14-16px

### Components
- Consistent button styles
- Card-based layouts
- Responsive grid system
- Accessible form controls

## 🧪 Testing

```bash
# Run unit tests
yarn test

# Run E2E tests
yarn test:e2e

# Run with coverage
yarn test:coverage
```

## 📦 Building for Production

```bash
# Build for web
yarn build

# Preview production build
yarn preview

# Build and deploy to Firebase
yarn deploy
```

## 🚢 Deployment

### Firebase Hosting
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase
firebase init

# Deploy
firebase deploy
```

### Environment Variables
Ensure all environment variables are set in your deployment platform:
- Firebase Console for Firebase Hosting
- GitHub Secrets for GitHub Actions
- Vercel/Netlify environment settings

## 🔒 Security

- Firebase Authentication for secure user management
- Firestore security rules for data protection
- Environment variables for sensitive data
- HTTPS enforcement
- Content Security Policy headers
- Input validation and sanitization

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Based on "The Power of Habit" by Charles Duhigg
- Inspired by Atomic Habits by James Clear
- Icons from Lucide React
- UI components inspired by Radix UI

## 📞 Support

For support, email support@habitforge.app or open an issue in the GitHub repository.

## 🗺️ Roadmap

### Q1 2025
- [ ] Community features
- [ ] Social accountability partners
- [ ] Habit challenges
- [ ] Achievement system

### Q2 2025
- [ ] AI-powered habit recommendations
- [ ] Advanced analytics
- [ ] Integration with wearables
- [ ] Team habits for organizations

### Q3 2025
- [ ] Habit marketplace
- [ ] Expert coaching integration
- [ ] Voice commands
- [ ] AR visualization

## 📊 Status

- **Version**: 1.0.0
- **Status**: Production Ready
- **Last Updated**: December 2024
- **Active Users**: Growing!

---

Built with ❤️ by the HabitForge Team