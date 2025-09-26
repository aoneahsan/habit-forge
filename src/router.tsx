import { createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { Layout } from '@/components/layout/Layout';
import { HomePage } from '@/pages/HomePage';
import { LoginPage } from '@/pages/LoginPage';
import { SignUpPage } from '@/pages/SignUpPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { HabitsPage } from '@/pages/HabitsPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { AdminDashboard } from '@/pages/admin/Dashboard';
import { UserManagement } from '@/pages/admin/UserManagement';
import { SystemAnalytics } from '@/pages/admin/SystemAnalytics';

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
});

const signUpRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/signup',
  component: SignUpPage,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: DashboardPage,
});

const habitsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/habits',
  component: HabitsPage,
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: SettingsPage,
});

const adminDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/dashboard',
  component: AdminDashboard,
});

const adminUsersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/users',
  component: UserManagement,
});

const adminAnalyticsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/analytics',
  component: SystemAnalytics,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  signUpRoute,
  dashboardRoute,
  habitsRoute,
  settingsRoute,
  adminDashboardRoute,
  adminUsersRoute,
  adminAnalyticsRoute,
]);

export const router = createRouter({ routeTree });