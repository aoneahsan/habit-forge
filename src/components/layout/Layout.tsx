import { Outlet } from '@tanstack/react-router';
import { Box, Flex } from '@radix-ui/themes';
import { useAuthStore } from '@/stores/authStore';
import { Navbar } from './Navbar';

export function Layout() {
  const { user } = useAuthStore();

  return (
    <Flex direction="column" minHeight="100vh">
      {user && <Navbar />}
      <Box flexGrow="1" pt={user ? '4' : '0'}>
        <Outlet />
      </Box>
    </Flex>
  );
}