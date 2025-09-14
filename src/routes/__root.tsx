import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import type { QueryClient } from '@tanstack/react-query';
import type { UserProfile } from '@/types/user.types';

interface RouterContext {
  queryClient: QueryClient;
  auth: {
    user: any;
    userProfile: UserProfile | null;
    isAuthenticated: boolean;
  };
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => <Outlet />,
});