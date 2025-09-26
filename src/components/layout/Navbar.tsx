import { Link } from '@tanstack/react-router';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/Button';
import { Home, Target, BarChart3, User, Settings, LogOut } from 'lucide-react';

export function Navbar() {
  const { user, signOut } = useAuthStore();

  return (
    <nav className="fixed top-0 z-50 w-full border-b bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-8">
          <Link to="/" className="text-2xl font-bold text-primary-600">
            HabitForge
          </Link>
          
          <div className="hidden md:flex space-x-6">
            <Link to="/dashboard" className="flex items-center space-x-2 text-gray-600 hover:text-primary-600">
              <Home className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
            <Link to="/habits" className="flex items-center space-x-2 text-gray-600 hover:text-primary-600">
              <Target className="h-4 w-4" />
              <span>Habits</span>
            </Link>
            <Link to="/analytics" className="flex items-center space-x-2 text-gray-600 hover:text-primary-600">
              <BarChart3 className="h-4 w-4" />
              <span>Analytics</span>
            </Link>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">{user?.email}</span>
          <Button variant="ghost" size="icon" onClick={signOut}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </nav>
  );
}