import { Loader2 } from 'lucide-react';

export function AuthLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="inline-flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
        </div>
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          Verifying authentication...
        </p>
      </div>
    </div>
  );
}