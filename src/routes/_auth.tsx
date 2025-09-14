import { createFileRoute, Outlet } from '@tanstack/react-router';
import { requireGuest } from '@/lib/auth-guards';

export const Route = createFileRoute('/_auth')({
  beforeLoad: requireGuest,
  component: AuthLayout,
});

function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800">
      <div className="flex min-h-screen items-center justify-center p-4">
        <Outlet />
      </div>
    </div>
  );
}