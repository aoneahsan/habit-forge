import { createFileRoute } from '@tanstack/react-router';
import { Trophy, Star, Target, Zap, Award, TrendingUp, Users, Calendar, Lock } from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';

export const Route = createFileRoute('/_protected/achievements')({
  component: AchievementsPage,
});

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  category: 'streak' | 'completion' | 'social' | 'special';
  requirement: number;
  current: number;
  unlocked: boolean;
  unlockedAt?: Date;
  points: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

function AchievementsPage() {
  const userProfile = useAuthStore((state) => state.userProfile);

  const achievements: Achievement[] = [
    // Streak Achievements
    {
      id: 'streak-7',
      name: 'Week Warrior',
      description: 'Maintain a 7-day streak',
      icon: Calendar,
      category: 'streak',
      requirement: 7,
      current: userProfile?.stats?.currentStreak || 0,
      unlocked: (userProfile?.stats?.currentStreak || 0) >= 7,
      points: 50,
      rarity: 'common',
    },
    {
      id: 'streak-30',
      name: 'Monthly Master',
      description: 'Maintain a 30-day streak',
      icon: Calendar,
      category: 'streak',
      requirement: 30,
      current: userProfile?.stats?.currentStreak || 0,
      unlocked: (userProfile?.stats?.currentStreak || 0) >= 30,
      points: 200,
      rarity: 'rare',
    },
    {
      id: 'streak-100',
      name: 'Century Champion',
      description: 'Maintain a 100-day streak',
      icon: TrendingUp,
      category: 'streak',
      requirement: 100,
      current: userProfile?.stats?.currentStreak || 0,
      unlocked: (userProfile?.stats?.currentStreak || 0) >= 100,
      points: 500,
      rarity: 'epic',
    },
    {
      id: 'streak-365',
      name: 'Year of Discipline',
      description: 'Maintain a 365-day streak',
      icon: Star,
      category: 'streak',
      requirement: 365,
      current: userProfile?.stats?.currentStreak || 0,
      unlocked: (userProfile?.stats?.currentStreak || 0) >= 365,
      points: 1000,
      rarity: 'legendary',
    },

    // Completion Achievements
    {
      id: 'complete-10',
      name: 'Getting Started',
      description: 'Complete 10 habits',
      icon: Target,
      category: 'completion',
      requirement: 10,
      current: userProfile?.stats?.totalHabitsCompleted || 0,
      unlocked: (userProfile?.stats?.totalHabitsCompleted || 0) >= 10,
      points: 30,
      rarity: 'common',
    },
    {
      id: 'complete-100',
      name: 'Habit Builder',
      description: 'Complete 100 habits',
      icon: Target,
      category: 'completion',
      requirement: 100,
      current: userProfile?.stats?.totalHabitsCompleted || 0,
      unlocked: (userProfile?.stats?.totalHabitsCompleted || 0) >= 100,
      points: 150,
      rarity: 'rare',
    },
    {
      id: 'complete-1000',
      name: 'Habit Master',
      description: 'Complete 1000 habits',
      icon: Award,
      category: 'completion',
      requirement: 1000,
      current: userProfile?.stats?.totalHabitsCompleted || 0,
      unlocked: (userProfile?.stats?.totalHabitsCompleted || 0) >= 1000,
      points: 500,
      rarity: 'epic',
    },

    // Social Achievements
    {
      id: 'social-friend',
      name: 'Social Butterfly',
      description: 'Add 5 friends',
      icon: Users,
      category: 'social',
      requirement: 5,
      current: 0,
      unlocked: false,
      points: 50,
      rarity: 'common',
    },
    {
      id: 'social-challenge',
      name: 'Challenge Accepted',
      description: 'Join 3 challenges',
      icon: Zap,
      category: 'social',
      requirement: 3,
      current: 0,
      unlocked: false,
      points: 75,
      rarity: 'common',
    },

    // Special Achievements
    {
      id: 'special-early',
      name: 'Early Bird',
      description: 'Complete 5 morning habits before 7 AM',
      icon: Trophy,
      category: 'special',
      requirement: 5,
      current: 0,
      unlocked: false,
      points: 100,
      rarity: 'rare',
    },
    {
      id: 'special-perfect',
      name: 'Perfect Week',
      description: 'Complete all habits for 7 consecutive days',
      icon: Star,
      category: 'special',
      requirement: 7,
      current: 0,
      unlocked: false,
      points: 150,
      rarity: 'rare',
    },
    {
      id: 'special-diverse',
      name: 'Well Rounded',
      description: 'Have active habits in 5 different categories',
      icon: Award,
      category: 'special',
      requirement: 5,
      current: 0,
      unlocked: false,
      points: 200,
      rarity: 'epic',
    },
  ];

  const categories = [
    { id: 'all', name: 'All', count: achievements.length },
    { id: 'streak', name: 'Streaks', count: achievements.filter(a => a.category === 'streak').length },
    { id: 'completion', name: 'Completions', count: achievements.filter(a => a.category === 'completion').length },
    { id: 'social', name: 'Social', count: achievements.filter(a => a.category === 'social').length },
    { id: 'special', name: 'Special', count: achievements.filter(a => a.category === 'special').length },
  ];

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalPoints = achievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.points, 0);

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'text-gray-600 dark:text-gray-400';
      case 'rare': return 'text-blue-600 dark:text-blue-400';
      case 'epic': return 'text-purple-600 dark:text-purple-400';
      case 'legendary': return 'text-yellow-600 dark:text-yellow-400';
    }
  };

  const getRarityBg = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 dark:bg-gray-800';
      case 'rare': return 'bg-blue-100 dark:bg-blue-900/20';
      case 'epic': return 'bg-purple-100 dark:bg-purple-900/20';
      case 'legendary': return 'bg-yellow-100 dark:bg-yellow-900/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Achievements</h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          Unlock achievements and earn rewards
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Unlocked</p>
              <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                {unlockedCount}/{achievements.length}
              </p>
            </div>
            <Trophy className="h-8 w-8 text-yellow-500" />
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Points</p>
              <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                {totalPoints.toLocaleString()}
              </p>
            </div>
            <Star className="h-8 w-8 text-purple-500" />
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Completion</p>
              <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                {Math.round((unlockedCount / achievements.length) * 100)}%
              </p>
            </div>
            <div className="relative h-12 w-12">
              <svg className="h-12 w-12 -rotate-90">
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  className="text-gray-200 dark:text-gray-700"
                />
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 20}`}
                  strokeDashoffset={`${2 * Math.PI * 20 * (1 - unlockedCount / achievements.length)}`}
                  className="text-primary-500 transition-all duration-500"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category.id}
            className="flex-shrink-0 rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            {category.name} ({category.count})
          </button>
        ))}
      </div>

      {/* Achievements Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {achievements.map((achievement) => {
          const Icon = achievement.icon;
          const progress = Math.min((achievement.current / achievement.requirement) * 100, 100);

          return (
            <div
              key={achievement.id}
              className={`card relative overflow-hidden p-6 transition-all ${
                achievement.unlocked
                  ? 'ring-2 ring-primary-500 ring-offset-2 dark:ring-offset-gray-900'
                  : 'opacity-75'
              }`}
            >
              {/* Rarity Badge */}
              <div className="absolute right-2 top-2">
                <span className={`text-xs font-medium uppercase ${getRarityColor(achievement.rarity)}`}>
                  {achievement.rarity}
                </span>
              </div>

              {/* Icon */}
              <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg ${
                getRarityBg(achievement.rarity)
              }`}>
                {achievement.unlocked ? (
                  <Icon className={`h-6 w-6 ${getRarityColor(achievement.rarity)}`} />
                ) : (
                  <Lock className="h-6 w-6 text-gray-400" />
                )}
              </div>

              {/* Content */}
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {achievement.name}
              </h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {achievement.description}
              </p>

              {/* Progress */}
              {!achievement.unlocked && (
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Progress</span>
                    <span className="font-medium">
                      {achievement.current}/{achievement.requirement}
                    </span>
                  </div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      className="h-full bg-primary-500 transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Points */}
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {achievement.unlocked ? 'Earned' : 'Reward'}
                </span>
                <span className="font-semibold text-primary-600 dark:text-primary-400">
                  +{achievement.points} pts
                </span>
              </div>

              {/* Unlocked Date */}
              {achievement.unlocked && achievement.unlockedAt && (
                <p className="mt-2 text-xs text-gray-500">
                  Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Upcoming Achievements */}
      <div className="card p-6">
        <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
          Next Achievements
        </h2>
        <div className="space-y-3">
          {achievements
            .filter(a => !a.unlocked)
            .sort((a, b) => (b.current / b.requirement) - (a.current / a.requirement))
            .slice(0, 3)
            .map((achievement) => {
              const Icon = achievement.icon;
              const progress = Math.min((achievement.current / achievement.requirement) * 100, 100);

              return (
                <div key={achievement.id} className="flex items-center space-x-4">
                  <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${
                    getRarityBg(achievement.rarity)
                  }`}>
                    <Icon className={`h-5 w-5 ${getRarityColor(achievement.rarity)}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {achievement.name}
                      </p>
                      <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                        {Math.round(progress)}%
                      </span>
                    </div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                      <div
                        className="h-full bg-primary-500 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}