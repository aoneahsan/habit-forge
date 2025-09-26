import { Link } from '@tanstack/react-router';
import { Box, Button, Container, Flex, Text } from '@radix-ui/themes';
import { useAuthStore } from '@/stores/authStore';
import { Home, Target, BarChart3, LogOut } from 'lucide-react';

export function Navbar() {
  const { user, signOut } = useAuthStore();

  return (
    <Box className="border-b" py="3">
      <Container size="4">
        <Flex justify="between" align="center">
          <Flex align="center" gap="8">
            <Link to="/" className="no-underline">
              <Text size="5" weight="bold" className="text-blue-600">
                HabitForge
              </Text>
            </Link>
            
            <Flex gap="6" className="hidden md:flex">
              <Link to="/dashboard" className="no-underline">
                <Flex align="center" gap="2" className="text-gray-600 hover:text-blue-600">
                  <Home className="h-4 w-4" />
                  <Text size="2">Dashboard</Text>
                </Flex>
              </Link>
              <Link to="/habits" className="no-underline">
                <Flex align="center" gap="2" className="text-gray-600 hover:text-blue-600">
                  <Target className="h-4 w-4" />
                  <Text size="2">Habits</Text>
                </Flex>
              </Link>
              <Link to="/analytics" className="no-underline">
                <Flex align="center" gap="2" className="text-gray-600 hover:text-blue-600">
                  <BarChart3 className="h-4 w-4" />
                  <Text size="2">Analytics</Text>
                </Flex>
              </Link>
              {user?.isAdmin && (
                <Link to="/admin/dashboard" className="no-underline">
                  <Flex align="center" gap="2" className="text-gray-600 hover:text-blue-600">
                    <Text size="2">Admin</Text>
                  </Flex>
                </Link>
              )}
            </Flex>
          </Flex>

          <Flex align="center" gap="4">
            <Text size="2" color="gray">{user?.email}</Text>
            <Button variant="ghost" size="2" onClick={signOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
}