import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useState } from 'react';
import { createHabit } from '@/services/firebase/habit.service';
import { useAuthStore } from '@/stores/auth.store';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ArrowLeft, Plus, Info } from 'lucide-react';
import type { HabitFormData } from '@/types/habit.types';

const habitSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  description: z.string().max(200).optional(),
  category: z.enum([
    'health',
    'productivity',
    'mindfulness',
    'fitness',
    'learning',
    'social',
    'finance',
    'creativity',
    'other',
  ]),
  frequency: z.enum(['daily', 'weekly', 'custom']),
  targetCount: z.number().min(1).max(100),
  targetUnit: z.string().min(1).max(20),
  timeOfDay: z.enum(['morning', 'afternoon', 'evening', 'anytime']).optional(),
  reminder: z.boolean(),
  reminderTime: z.string().optional(),
  points: z.number().min(1).max(100),
  // Five-factor tracking
  cue: z.string().max(200),
  craving: z.string().max(200),
  response: z.string().max(200),
  reward: z.string().max(200),
  investment: z.string().max(200),
});

type HabitForm = z.infer<typeof habitSchema>;

export const Route = createFileRoute('/_protected/habits/new')({
  component: NewHabitPage,
});

function NewHabitPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [isCreating, setIsCreating] = useState(false);
  const [showFiveFactors, setShowFiveFactors] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<HabitForm>({
    resolver: zodResolver(habitSchema),
    defaultValues: {
      category: 'other',
      frequency: 'daily',
      targetCount: 1,
      targetUnit: 'time',
      timeOfDay: 'anytime',
      reminder: false,
      points: 10,
    },
  });

  const reminder = watch('reminder');
  const frequency = watch('frequency');

  const onSubmit = async (data: HabitForm) => {
    if (!user) return;

    setIsCreating(true);
    try {
      const habitData: HabitFormData = {
        name: data.name,
        description: data.description || '',
        category: data.category,
        type: 'build' as const,
        frequency: data.frequency,
        target: data.targetCount,
        unit: data.targetUnit,
        timeOfDay: data.timeOfDay,
        habitLoop: {
          cue: data.cue || '',
          routine: data.response || '',
          reward: data.reward || '',
        },
      };

      await createHabit(user.uid, habitData);
      toast.success('Habit created successfully!');
      navigate({ to: '/habits' });
    } catch (error) {
      toast.error('Failed to create habit');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate({ to: '/habits' })}
            className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Habit</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Build a new positive habit into your routine
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="card p-6">
          <h2 className="mb-4 text-lg font-semibold">Basic Information</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Habit Name *
              </label>
              <Input
                {...register('name')}
                placeholder="e.g., Morning meditation"
                className="mt-1"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-danger-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description
              </label>
              <textarea
                {...register('description')}
                placeholder="Brief description of your habit"
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700"
                rows={3}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-danger-600">{errors.description.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Category *
              </label>
              <select
                {...register('category')}
                className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700"
              >
                <option value="health">Health</option>
                <option value="productivity">Productivity</option>
                <option value="mindfulness">Mindfulness</option>
                <option value="fitness">Fitness</option>
                <option value="learning">Learning</option>
                <option value="social">Social</option>
                <option value="finance">Finance</option>
                <option value="creativity">Creativity</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Frequency and Target */}
        <div className="card p-6">
          <h2 className="mb-4 text-lg font-semibold">Frequency & Target</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Frequency *
              </label>
              <select
                {...register('frequency')}
                className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Target Count *
                </label>
                <Input
                  {...register('targetCount', { valueAsNumber: true })}
                  type="number"
                  min="1"
                  max="100"
                  className="mt-1"
                />
                {errors.targetCount && (
                  <p className="mt-1 text-sm text-danger-600">{errors.targetCount.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Unit *
                </label>
                <Input
                  {...register('targetUnit')}
                  placeholder="e.g., minutes, pages, reps"
                  className="mt-1"
                />
                {errors.targetUnit && (
                  <p className="mt-1 text-sm text-danger-600">{errors.targetUnit.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Time of Day
              </label>
              <select
                {...register('timeOfDay')}
                className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700"
              >
                <option value="anytime">Anytime</option>
                <option value="morning">Morning</option>
                <option value="afternoon">Afternoon</option>
                <option value="evening">Evening</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Points *
              </label>
              <Input
                {...register('points', { valueAsNumber: true })}
                type="number"
                min="1"
                max="100"
                className="mt-1"
              />
              {errors.points && (
                <p className="mt-1 text-sm text-danger-600">{errors.points.message}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">Points earned for completing this habit</p>
            </div>
          </div>
        </div>

        {/* Reminders */}
        <div className="card p-6">
          <h2 className="mb-4 text-lg font-semibold">Reminders</h2>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                {...register('reminder')}
                type="checkbox"
                className="rounded border-gray-300"
              />
              <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Enable daily reminder
              </label>
            </div>

            {reminder && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Reminder Time
                </label>
                <Input
                  {...register('reminderTime')}
                  type="time"
                  className="mt-1"
                />
              </div>
            )}
          </div>
        </div>

        {/* Five-Factor Model */}
        <div className="card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Habit Loop Analysis</h2>
            <button
              type="button"
              onClick={() => setShowFiveFactors(!showFiveFactors)}
              className="flex items-center text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
            >
              <Info className="mr-1 h-4 w-4" />
              {showFiveFactors ? 'Hide' : 'Show'} Details
            </button>
          </div>

          {showFiveFactors && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Understanding your habit loop helps build stronger habits. Based on "The Power of Habit" by Charles Duhigg.
              </p>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Cue (Trigger) *
                </label>
                <Input
                  {...register('cue')}
                  placeholder="What triggers this habit? (e.g., After waking up)"
                  className="mt-1"
                />
                {errors.cue && (
                  <p className="mt-1 text-sm text-danger-600">{errors.cue.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Craving (Motivation) *
                </label>
                <Input
                  {...register('craving')}
                  placeholder="What do you crave? (e.g., Mental clarity)"
                  className="mt-1"
                />
                {errors.craving && (
                  <p className="mt-1 text-sm text-danger-600">{errors.craving.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Response (Action) *
                </label>
                <Input
                  {...register('response')}
                  placeholder="What's the actual habit? (e.g., Meditate for 10 minutes)"
                  className="mt-1"
                />
                {errors.response && (
                  <p className="mt-1 text-sm text-danger-600">{errors.response.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Reward (Benefit) *
                </label>
                <Input
                  {...register('reward')}
                  placeholder="What's the immediate reward? (e.g., Feel calm and focused)"
                  className="mt-1"
                />
                {errors.reward && (
                  <p className="mt-1 text-sm text-danger-600">{errors.reward.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Investment (Long-term) *
                </label>
                <Input
                  {...register('investment')}
                  placeholder="How does this help long-term? (e.g., Better mental health)"
                  className="mt-1"
                />
                {errors.investment && (
                  <p className="mt-1 text-sm text-danger-600">{errors.investment.message}</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate({ to: '/habits' })}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isCreating}>
            {isCreating ? 'Creating...' : 'Create Habit'}
          </Button>
        </div>
      </form>
    </div>
  );
}