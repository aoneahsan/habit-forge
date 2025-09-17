import { Search, Moon, Sun, User, LogOut, Settings, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { getInitials } from '@/lib/utils';
import { signOutUser } from '@/services/firebase/auth.service';
import { useNavigate, Link } from '@tanstack/react-router';
import { toast } from 'sonner';
import { NotificationsDropdown } from './NotificationsDropdown';
import { 
  Flex, 
  Box, 
  TextField, 
  IconButton, 
  DropdownMenu,
  Avatar,
  Text,
  Separator
} from '@radix-ui/themes';

export function Header() {
  const navigate = useNavigate();
  const userProfile = useAuthStore((state) => state.userProfile);
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const [isDarkMode, setIsDarkMode] = useState(false);
  useEffect(() => {
    const isDark = localStorage.getItem('theme') === 'dark' || 
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setIsDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
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
    <Box
      style={{
        borderBottom: '1px solid var(--gray-6)',
        backgroundColor: 'var(--color-background)',
        height: '64px'
      }}
    >
      <Flex align="center" justify="between" height="100%" px="4">
        {/* Search Bar */}
        <Box flexGrow="1" maxWidth={{ lg: '448px' }}>
          <TextField.Root size="2" placeholder="Search habits...">
            <TextField.Slot>
              <Search size={16} />
            </TextField.Slot>
          </TextField.Root>
        </Box>

        {/* Right Section */}
        <Flex align="center" gap="3">
          {/* Theme Toggle */}
          <IconButton
            variant="ghost"
            size="2"
            onClick={toggleTheme}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </IconButton>

          {/* Notifications */}
          <NotificationsDropdown />

          {/* User Profile with Dropdown */}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              <Flex align="center" gap="3" style={{ cursor: 'pointer' }}>
                <Box display={{ initial: 'none', md: 'block' }}>
                  <Text size="2" weight="medium" align="right" style={{ display: 'block' }}>
                    {userProfile?.displayName || user?.displayName || 'User'}
                  </Text>
                  <Text size="1" color="gray" align="right" style={{ display: 'block' }}>
                    Level {userProfile?.level || 1}
                  </Text>
                </Box>
                
                <Avatar
                  size="3"
                  src={user?.photoURL || undefined}
                  fallback={getInitials(userProfile?.displayName || user?.displayName || 'U')}
                  radius="full"
                />
                
                <ChevronDown size={16} style={{ color: 'var(--gray-9)' }} />
              </Flex>
            </DropdownMenu.Trigger>
            
            <DropdownMenu.Content size="2" style={{ minWidth: '200px' }}>
              <DropdownMenu.Label>
                <Flex direction="column">
                  <Text size="2" weight="medium">
                    {userProfile?.displayName || user?.displayName || 'User'}
                  </Text>
                  <Text size="1" color="gray">
                    {user?.email}
                  </Text>
                </Flex>
              </DropdownMenu.Label>
              
              <DropdownMenu.Separator />
              
              <DropdownMenu.Item asChild>
                <Link to="/settings">
                  <Flex align="center" gap="2">
                    <Settings size={16} />
                    Settings
                  </Flex>
                </Link>
              </DropdownMenu.Item>
              
              <DropdownMenu.Separator />
              
              <DropdownMenu.Item color="red" onClick={handleSignOut}>
                <Flex align="center" gap="2">
                  <LogOut size={16} />
                  Sign Out
                </Flex>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </Flex>
      </Flex>
    </Box>
  );
}