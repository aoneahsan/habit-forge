import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  beforeLoad: async ({ context }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({
        to: '/dashboard',
      });
    } else {
      throw redirect({
        to: '/signin',
      });
    }
  },
});