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
import { signOutUser } from '@/services/firebase/auth.service';
import { toast } from 'sonner';
import { APP_CONFIG } from '@/constants/app.constants';
import { 
  Box, 
  Flex, 
  Button, 
  IconButton,
  Text,
  Separator,
  Heading
} from '@radix-ui/themes';

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
      <Box 
        position="fixed" 
        left="4" 
        top="4" 
        display={{ lg: 'none' }}
        style={{ zIndex: 50 }}
      >
        <IconButton
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          size="3"
          variant="solid"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </IconButton>
      </Box>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <Box
          position="fixed"
          inset="0"
          display={{ lg: 'none' }}
          style={{ 
            zIndex: 40,
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
          }}
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Box
        position={{ initial: 'fixed', lg: 'relative' }}
        left="0"
        top="0"
        width="256px"
        height="100%"
        display={{ initial: isMobileMenuOpen ? 'block' : 'none', lg: 'block' }}
        style={{
          zIndex: isMobileMenuOpen ? 40 : 0,
          backgroundColor: 'var(--color-background)',
          borderRight: '1px solid var(--gray-6)',
          transition: 'transform 200ms ease-in-out'
        }}
      >
        <Flex direction="column" height="100%">
          {/* Logo */}
          <Flex 
            align="center" 
            justify="center" 
            height="64px" 
            px="6"
            style={{ borderBottom: '1px solid var(--gray-6)' }}
          >
            <Heading size="7" color="teal">{APP_CONFIG.name}</Heading>
          </Flex>

          {/* Create Habit Button */}
          <Box p="4">
            <Link to="/habits/new" style={{ textDecoration: 'none' }}>
              <Button size="3" style={{ width: '100%' }}>
                <Plus size={16} />
                New Habit
              </Button>
            </Link>
          </Box>

          {/* Main Navigation */}
          <Box flexGrow="1" px="4">
            <Flex direction="column" gap="1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  style={{ textDecoration: 'none' }}
                  activeProps={{
                    style: { 
                      backgroundColor: 'var(--teal-3)',
                      color: 'var(--teal-11)'
                    }
                  }}
                >
                  <Flex
                    align="center"
                    px="3"
                    py="2"
                    style={{
                      borderRadius: 'var(--radius-2)',
                      transition: 'background-color 0.2s',
                      cursor: 'pointer'
                    }}
                    className="hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <item.icon size={20} style={{ marginRight: '12px' }} />
                    <Text size="2" weight="medium">{item.name}</Text>
                  </Flex>
                </Link>
              ))}
            </Flex>
          </Box>

          {/* Bottom Navigation */}
          <Box style={{ borderTop: '1px solid var(--gray-6)' }} p="4">
            <Flex direction="column" gap="1">
              {bottomNavigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  style={{ textDecoration: 'none' }}
                  activeProps={{
                    style: { 
                      backgroundColor: 'var(--teal-3)',
                      color: 'var(--teal-11)'
                    }
                  }}
                >
                  <Flex
                    align="center"
                    px="3"
                    py="2"
                    style={{
                      borderRadius: 'var(--radius-2)',
                      transition: 'background-color 0.2s',
                      cursor: 'pointer'
                    }}
                    className="hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <item.icon size={20} style={{ marginRight: '12px' }} />
                    <Text size="2" weight="medium">{item.name}</Text>
                  </Flex>
                </Link>
              ))}
              
              <Flex
                align="center"
                px="3"
                py="2"
                onClick={handleSignOut}
                style={{
                  borderRadius: 'var(--radius-2)',
                  transition: 'background-color 0.2s',
                  cursor: 'pointer'
                }}
                className="hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <LogOut size={20} style={{ marginRight: '12px' }} />
                <Text size="2" weight="medium">Sign Out</Text>
              </Flex>
            </Flex>
          </Box>
        </Flex>
      </Box>
    </>
  );
}