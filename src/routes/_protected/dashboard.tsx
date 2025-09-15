import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useAuthStore } from '@/stores/auth.store';
import { useHabitStore } from '@/stores/habit.store';
import { Calendar, Target, TrendingUp, Users, Award, Activity, Plus } from 'lucide-react';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { HabitList } from '@/components/habits/HabitList';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { StreakCalendar } from '@/components/dashboard/StreakCalendar';
import { useQuery } from '@tanstack/react-query';
import { getUserHabits } from '@/services/firebase/habit.service';

export const Route = createFileRoute('/_protected/dashboard')({
  component: DashboardPage,
});

function DashboardPage() {
  const navigate = useNavigate();
  const userProfile = useAuthStore((state) => state.userProfile);
  const user = useAuthStore((state) => state.user);
  
  const { data: habits = [], isLoading } = useQuery({
    queryKey: ['habits', user?.uid],
    queryFn: () => getUserHabits(user?.uid!),
    enabled: !!user?.uid,
  });

  const activeHabits = habits.filter(h => h.status === 'active').length;
  const completedToday = habits.filter(h => {
    const today = new Date().toDateString();
    return h.lastCompletedAt && new Date(h.lastCompletedAt).toDateString() === today;
  }).length;

  const currentStreak = userProfile?.stats?.currentStreak || 0;
  const totalPoints = userProfile?.stats?.totalPoints || 0;

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 p-6 shadow-lg">
        <h1 className="text-3xl font-bold text-white">
          Welcome back, {userProfile?.displayName || 'Habit Forger'}! 👋
        </h1>
        <p className="mt-2 text-primary-50">
          {currentStreak > 0 
            ? `You're on a ${currentStreak} day streak! Keep it up!`
            : "Let's start building great habits today!"}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Active Habits"
          value={activeHabits}
          icon={Target}
          color="blue"
          change={habits.length > 0 ? '+2 this week' : undefined}
        />
        <StatsCard
          title="Current Streak"
          value={`${currentStreak} days`}
          icon={TrendingUp}
          color="green"
          change={currentStreak > 0 ? 'Personal best!' : undefined}
        />
        <StatsCard
          title="Completed Today"
          value={`${completedToday}/${activeHabits}`}
          icon={Activity}
          color="purple"
        />
        <StatsCard
          title="Total Points"
          value={totalPoints.toLocaleString()}
          icon={Award}
          color="yellow"
          change="+120 today"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Habits Section - 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <div className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Today's Habits
                </h2>
                <QuickActions />
              </div>
              {isLoading ? (
                <div className="flex h-32 items-center justify-center">
                  <div className="text-gray-500">Loading habits...</div>
                </div>
              ) : habits.length > 0 ? (
                <HabitList habits={habits} />
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Target className="mb-4 h-16 w-16 text-gray-300 dark:text-gray-600" />
                  <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                    No habits yet
                  </h3>
                  <p className="mb-6 max-w-sm text-sm text-gray-500 dark:text-gray-400">
                    Start your journey to building better habits. Create your first habit and begin tracking your progress today!
                  </p>
                  <button
                    onClick={() => navigate({ to: '/habits/new' })}
                    className="inline-flex items-center rounded-lg bg-primary-600 px-6 py-3 text-sm font-medium text-white shadow-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all transform hover:scale-105"
                  >
                    <Plus className="mr-2 h-5 w-5" />
                    Create Your First Habit
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Progress Chart */}
          <div className="card p-6">
            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
              Weekly Progress
            </h2>
            <div className="h-64 flex items-center justify-center text-gray-400">
              Progress chart coming soon...
            </div>
          </div>
        </div>

        {/* Sidebar - 1 column */}
        <div className="space-y-6">
          {/* Streak Calendar */}
          <div className="card p-6">
            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
              Streak Calendar
            </h2>
            <StreakCalendar />
          </div>

          {/* Rope Status */}
          <div className="card p-6">
            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
              Your Rope
            </h2>
            <div className="flex items-center justify-center">
              <div className="relative h-32 w-32">
                <svg className="h-32 w-32 -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    className="text-gray-200 dark:text-gray-700"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 56}`}
                    strokeDashoffset={`${2 * Math.PI * 56 * (1 - (currentStreak / 30))}`}
                    className="text-primary-500 transition-all duration-500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {Math.round((currentStreak / 30) * 100)}%
                    </div>
                    <div className="text-xs text-gray-500">Strong</div>
                  </div>
                </div>
              </div>
            </div>
            <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
              Keep your streak alive to strengthen your rope!
            </p>
          </div>

          {/* Community */}
          <div className="card p-6">
            <h2 className="mb-4 flex items-center text-xl font-semibold text-gray-900 dark:text-white">
              <Users className="mr-2 h-5 w-5" />
              Community
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Global Rank</span>
                <span className="font-medium">#1,234</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Friends Active</span>
                <span className="font-medium">12</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Challenges</span>
                <span className="font-medium">3 active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}