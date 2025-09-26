# Getting Started

## Prerequisites
- Node.js 24+ (or use nvm with the provided `.nvmrc`)
- Yarn package manager
- Firebase account

## Installation

1. **Clone the repository**
```bash
git clone [repository-url]
cd habitforge
```

2. **Install dependencies**
```bash
yarn install
```

3. **Configure environment variables**
Create a `.env` file in the root directory with your Firebase credentials:
```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_PROJECT_PREFIX=hf2024_
```

4. **Deploy Firebase rules and indexes**
```bash
firebase deploy --only firestore:rules,firestore:indexes
```

5. **Start the development server**
```bash
yarn dev
```
The app will be available at `http://localhost:6464`

## Development Commands

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn preview` - Preview production build
- `yarn lint` - Run ESLint
- `yarn type-check` - Check TypeScript types
- `yarn test` - Run tests
- `yarn cypress` - Open Cypress test runner
- `yarn cypress:run` - Run Cypress tests headless

## Project Structure
```
habitforge/
├── src/
│   ├── components/      # Reusable components
│   ├── pages/           # Route pages
│   ├── services/        # Firebase services
│   ├── stores/          # Zustand stores
│   ├── types/           # TypeScript types
│   ├── utils/           # Utility functions
│   └── hooks/           # Custom React hooks
├── docs/                # Documentation
├── cypress/             # E2E tests
├── public/              # Static assets
├── firestore.rules      # Firebase security rules
└── firestore.indexes.json # Firestore indexes
```