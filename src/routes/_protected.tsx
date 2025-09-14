import { createFileRoute, Outlet } from '@tanstack/react-router';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { requireAuth } from '@/lib/auth-guards';

export const Route = createFileRoute('/_protected')({
  beforeLoad: requireAuth,
  component: ProtectedLayout,
});

function ProtectedLayout() {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}