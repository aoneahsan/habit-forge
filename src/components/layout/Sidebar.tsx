import { Link } from '@tanstack/react-router';
import { 
  Home, 
  Target, 
  BarChart3, 
  Users, 
  Trophy, 
  Settings, 
  HelpCircle,
  LogOut,
  Menu,
  X,
  Plus
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { signOutUser } from '@/services/firebase/auth.service';
import { toast } from 'sonner';
import { APP_CONFIG } from '@/constants/app.constants';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Habits', href: '/habits', icon: Target },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Community', href: '/community', icon: Users },
  { name: 'Achievements', href: '/achievements', icon: Trophy },
];

const bottomNavigation = [
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Help & Support', href: '/help', icon: HelpCircle },
];

export function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOutUser();
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed left-4 top-4 z-50 rounded-lg bg-white p-2 shadow-md dark:bg-gray-800 lg:hidden"
      >
        {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'fixed left-0 top-0 z-40 flex h-full w-64 flex-col bg-white dark:bg-gray-800 lg:relative lg:z-0',
          'transform transition-transform duration-200 ease-in-out lg:transform-none',
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-center border-b border-gray-200 px-6 dark:border-gray-700">
            <h1 className="text-2xl font-bold text-primary-600">{APP_CONFIG.name}</h1>
          </div>

          {/* Create Habit Button */}
          <div className="p-4">
            <Link to="/habits/new">
              <Button className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                New Habit
              </Button>
            </Link>
          </div>

          {/* Main Navigation */}
          <nav className="flex-1 space-y-1 px-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                activeProps={{
                  className: 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
                }}
                className="group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Bottom Navigation */}
          <div className="border-t border-gray-200 p-4 dark:border-gray-700">
            <nav className="space-y-1">
              {bottomNavigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  activeProps={{
                    className: 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
                  }}
                  className="group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  {item.name}
                </Link>
              ))}
              
              <button
                onClick={handleSignOut}
                className="group flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <LogOut className="mr-3 h-5 w-5 flex-shrink-0" />
                Sign Out
              </button>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}