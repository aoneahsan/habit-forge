import { createFileRoute, Outlet } from '@tanstack/react-router';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { requireAuth } from '@/lib/auth-guards';
import { Flex, Box } from '@radix-ui/themes';

export const Route = createFileRoute('/_protected')({
  beforeLoad: requireAuth,
  component: ProtectedLayout,
});

function ProtectedLayout() {
  return (
    <Flex height="100vh" style={{ backgroundColor: 'var(--gray-2)' }}>
      <Sidebar />
      <Flex direction="column" flexGrow="1" style={{ overflow: 'hidden' }}>
        <Header />
        <Box
          flexGrow="1"
          p={{ initial: '4', md: '6' }}
          style={{ overflowY: 'auto' }}
        >
          <Outlet />
        </Box>
      </Flex>
    </Flex>
  );
}