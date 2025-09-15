import { Search, Moon, Sun, User, LogOut, Settings, ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { Button } from '@/components/ui/Button';
import { getInitials } from '@/lib/utils';
import { signOutUser } from '@/services/firebase/auth.service';
import { useNavigate, Link } from '@tanstack/react-router';
import { toast } from 'sonner';
import { NotificationsDropdown } from './NotificationsDropdown';

export function Header() {
  const navigate = useNavigate();
  const userProfile = useAuthStore((state) => state.userProfile);
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isDark = localStorage.getItem('theme') === 'dark' || 
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setIsDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    
    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
      clearAuth();
      toast.success('Signed out successfully');
      navigate({ to: '/signin', search: { redirect: undefined }, replace: true });
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 dark:border-gray-700 dark:bg-gray-800 md:px-6">
      {/* Search Bar */}
      <div className="flex flex-1 items-center lg:max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search habits..."
            className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2 pl-10 pr-4 text-sm focus:border-primary-500 focus:bg-white focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:bg-gray-600"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="hidden md:flex"
        >
          {isDarkMode ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>

        {/* Notifications */}
        <NotificationsDropdown />

        {/* User Profile with Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center space-x-3 rounded-lg px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {userProfile?.displayName || user?.displayName || 'User'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Level {userProfile?.level || 1}
              </p>
            </div>
            
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-400">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={userProfile?.displayName || 'User'}
                  className="h-10 w-10 rounded-full"
                />
              ) : (
                <span className="text-sm font-medium">
                  {getInitials(userProfile?.displayName || user?.displayName || 'U')}
                </span>
              )}
            </div>
            
            <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </button>
          
          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-56 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-gray-800 dark:ring-gray-700">
              <div className="p-2">
                <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {userProfile?.displayName || user?.displayName || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user?.email}
                  </p>
                </div>
                
                <Link
                  to="/settings"
                  onClick={() => setShowDropdown(false)}
                  className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded-md transition-colors"
                >
                  <Settings className="mr-3 h-4 w-4" />
                  Settings
                </Link>
                
                <button
                  onClick={handleSignOut}
                  className="flex w-full items-center px-3 py-2 text-sm text-danger-600 hover:bg-danger-50 dark:text-danger-400 dark:hover:bg-danger-900/20 rounded-md transition-colors"
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}