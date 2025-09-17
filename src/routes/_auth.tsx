import { createFileRoute, Outlet } from '@tanstack/react-router';
import { requireGuest } from '@/lib/auth-guards';
import { Container, Flex } from '@radix-ui/themes';

export const Route = createFileRoute('/_auth')({
  beforeLoad: requireGuest,
  component: AuthLayout,
});

function AuthLayout() {
  return (
    <Container size="4">
      <Flex
        minHeight="100vh"
        align="center"
        justify="center"
        style={{
          background: 'linear-gradient(to bottom right, var(--teal-2), var(--teal-3))',
        }}
      >
        <Outlet />
      </Flex>
    </Container>
  );
}