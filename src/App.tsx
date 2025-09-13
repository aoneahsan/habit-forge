import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'sonner';
import { ErrorBoundary } from 'react-error-boundary';
import { routeTree } from './routes';
import { AuthProvider } from '@/features/auth/providers/AuthProvider';
import { ThemeProvider } from '@/features/theme/providers/ThemeProvider';
import ErrorFallback from '@/components/common/ErrorFallback';
import { useEffect } from 'react';
import { initializeAnalytics } from '@/services/analytics/analytics.service';
import { initializeErrorTracking } from '@/services/error/error.service';

// Create a new QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
});

// Create the router instance
const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  context: {
    queryClient,
    auth: undefined!, // Will be set by AuthProvider
  },
});

// Register the router for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function App() {
  useEffect(() => {
    // Initialize analytics and error tracking
    if (import.meta.env.PROD) {
      initializeAnalytics();
      initializeErrorTracking();
    }
  }, []);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <AuthProvider>
              <RouterProvider router={router} />
              <Toaster
                position="top-center"
                richColors
                closeButton
                expand={false}
                duration={4000}
                theme="system"
              />
              {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
            </AuthProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;