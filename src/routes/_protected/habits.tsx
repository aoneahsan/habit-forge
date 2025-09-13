import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUserHabits } from '@/services/firebase/habit.service';
import { useAuthStore } from '@/stores/auth.store';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { HabitList } from '@/components/habits/HabitList';
import { Plus, Search, Filter, Grid, List } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

export const Route = createFileRoute('/_protected/habits')({
  component: HabitsPage,
});

function HabitsPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const { data: habits = [], isLoading } = useQuery({
    queryKey: ['habits', user?.uid],
    queryFn: () => getUserHabits(user?.uid!),
    enabled: !!user?.uid,
  });

  const categories = [
    'all',
    'health',
    'productivity',
    'mindfulness',
    'fitness',
    'learning',
    'social',
    'finance',
    'creativity',
    'other',
  ];

  const filteredHabits = habits.filter((habit) => {
    const matchesSearch = habit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      habit.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || habit.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const activeHabits = filteredHabits.filter(h => h.status === 'active');
  const pausedHabits = filteredHabits.filter(h => h.status === 'paused');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Habits</h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Manage and track your daily habits
          </p>
        </div>
        <Button onClick={() => navigate({ to: '/habits/new' })}>
          <Plus className="mr-2 h-4 w-4" />
          New Habit
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="card p-4">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          {/* Search */}
          <div className="relative flex-1 md:max-w-md">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search habits..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex items-center space-x-4">
            {/* Category Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex rounded-lg border border-gray-300 dark:border-gray-600">
              <button
                onClick={() => setViewMode('list')}
                className={`rounded-l-lg p-2 ${
                  viewMode === 'list'
                    ? 'bg-primary-500 text-white'
                    : 'bg-white text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`rounded-r-lg p-2 ${
                  viewMode === 'grid'
                    ? 'bg-primary-500 text-white'
                    : 'bg-white text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                <Grid className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="card p-4">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {habits.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Habits</div>
        </div>
        <div className="card p-4">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {activeHabits.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Active</div>
        </div>
        <div className="card p-4">
          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            {pausedHabits.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Paused</div>
        </div>
        <div className="card p-4">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {habits.filter(h => h.streak > 0).length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">With Streaks</div>
        </div>
      </div>

      {/* Habits List */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="card p-8">
            <div className="flex items-center justify-center">
              <div className="text-gray-500">Loading habits...</div>
            </div>
          </div>
        ) : filteredHabits.length > 0 ? (
          <>
            {activeHabits.length > 0 && (
              <div>
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                  Active Habits ({activeHabits.length})
                </h2>
                {viewMode === 'list' ? (
                  <HabitList habits={activeHabits} />
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {activeHabits.map((habit) => (
                      <div key={habit.id} className="card p-4">
                        {/* Grid view card content */}
                        <h3 className="font-medium">{habit.name}</h3>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                          {habit.description}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {pausedHabits.length > 0 && (
              <div>
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                  Paused Habits ({pausedHabits.length})
                </h2>
                {viewMode === 'list' ? (
                  <HabitList habits={pausedHabits} />
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {pausedHabits.map((habit) => (
                      <div key={habit.id} className="card p-4 opacity-60">
                        <h3 className="font-medium">{habit.name}</h3>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                          {habit.description}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="card p-8">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="mb-4 rounded-full bg-primary-100 p-4 dark:bg-primary-900/20">
                <Plus className="h-8 w-8 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                No habits found
              </h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {searchTerm || selectedCategory !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Create your first habit to get started'}
              </p>
              {!searchTerm && selectedCategory === 'all' && (
                <Button
                  className="mt-4"
                  onClick={() => navigate({ to: '/habits/new' })}
                >
                  Create First Habit
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}