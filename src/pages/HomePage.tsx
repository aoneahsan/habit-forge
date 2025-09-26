import { useNavigate } from '@tanstack/react-router';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/Button';
import { useEffect } from 'react';

export function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      navigate({ to: '/dashboard' });
    }
  }, [user, navigate]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-primary-50 to-white px-4">
      <div className="max-w-3xl text-center">
        <h1 className="mb-6 text-5xl font-bold text-gray-900">
          Transform Your Life One Habit at a Time
        </h1>
        <p className="mb-8 text-xl text-gray-600">
          Build powerful habits with science-backed tracking, beautiful visualizations, and AI-powered insights.
        </p>
        
        <div className="flex gap-4 justify-center">
          <Button size="lg" onClick={() => navigate({ to: '/signup' })}>
            Start Free Trial
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate({ to: '/login' })}>
            Sign In
          </Button>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="mb-4 text-4xl">🎯</div>
            <h3 className="mb-2 text-lg font-semibold">Track with Five Factors</h3>
            <p className="text-gray-600">Based on "The Power of Habit" methodology</p>
          </div>
          <div>
            <div className="mb-4 text-4xl">🪢</div>
            <h3 className="mb-2 text-lg font-semibold">Visual Progress</h3>
            <p className="text-gray-600">Watch your habits strengthen like a rope</p>
          </div>
          <div>
            <div className="mb-4 text-4xl">🤖</div>
            <h3 className="mb-2 text-lg font-semibold">AI Insights</h3>
            <p className="text-gray-600">Get personalized recommendations</p>
          </div>
        </div>
      </div>
    </div>
  );
}