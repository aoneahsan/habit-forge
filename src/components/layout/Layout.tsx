import { Outlet } from '@tanstack/react-router';
import { useAuthStore } from '@/stores/authStore';
import { Navbar } from './Navbar';

export function Layout() {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-50">
      {user && <Navbar />}
      <main className={user ? 'pt-16' : ''}>
        <Outlet />
      </main>
    </div>
  );
}