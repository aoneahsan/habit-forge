import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { getHabit, updateHabit, deleteHabit } from '@/services/firebase/habit.service';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ArrowLeft, Save, Trash2, AlertTriangle } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

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
  status: z.enum(['active', 'paused']),
});

type HabitForm = z.infer<typeof habitSchema>;

export const Route = createFileRoute('/_protected/habits/$habitId/edit')({
  component: EditHabitPage,
});

function EditHabitPage() {
  const navigate = useNavigate();
  const { habitId } = Route.useParams();
  const queryClient = useQueryClient();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { data: habit, isLoading, error } = useQuery({
    queryKey: ['habit', habitId],
    queryFn: () => getHabit(habitId),
  });

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<HabitForm>({
    resolver: zodResolver(habitSchema),
  });

  useEffect(() => {
    if (habit) {
      reset({
        name: habit.name,
        description: habit.description,
        category: habit.category as any, // Type fix for now
        frequency: (habit.frequency || 'daily') as any,
        targetCount: habit.target || 1,
        targetUnit: habit.unit || 'times',
        timeOfDay: habit.timeOfDay || 'anytime',
        reminder: false,
        reminderTime: '09:00',
        points: habit.points || 10,
        status: habit.status,
      } as any);
    }
  }, [habit, reset]);

  const reminder = watch('reminder');

  const onSubmit = async (data: HabitForm) => {
    setIsUpdating(true);
    try {
      await updateHabit(habitId, {
        name: data.name,
        description: data.description || '',
        category: data.category,
        frequency: data.frequency,
        target: data.targetCount,
        unit: data.targetUnit,
        timeOfDay: data.timeOfDay,
      } as any);
      toast.success('Habit updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['habits'] });
      queryClient.invalidateQueries({ queryKey: ['habit', habitId] });
      navigate({ to: '/habits' });
    } catch (error) {
      toast.error('Failed to update habit');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteHabit(habitId);
      toast.success('Habit deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['habits'] });
      navigate({ to: '/habits' });
    } catch (error) {
      toast.error('Failed to delete habit');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-gray-500">Loading habit...</div>
      </div>
    );
  }

  if (error || !habit) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="card p-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Habit not found
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              The habit you're looking for doesn't exist or has been deleted.
            </p>
            <Button
              className="mt-4"
              onClick={() => navigate({ to: '/habits' })}
            >
              Back to Habits
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Habit</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Update your habit details
            </p>
          </div>
        </div>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => setShowDeleteConfirm(true)}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 dark:bg-gray-800">
            <div className="mb-4 flex items-center text-danger-600 dark:text-danger-400">
              <AlertTriangle className="mr-2 h-6 w-6" />
              <h3 className="text-lg font-semibold">Delete Habit</h3>
            </div>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              Are you sure you want to delete "{habit.name}"? This action cannot be undone.
              All progress and history will be permanently lost.
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete Habit'}
              </Button>
            </div>
          </div>
        </div>
      )}

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

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Status *
              </label>
              <select
                {...register('status')}
                className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700"
              >
                <option value="active">Active</option>
                <option value="paused">Paused</option>
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

        {/* Habit Stats */}
        {habit && (
          <div className="card p-6">
            <h2 className="mb-4 text-lg font-semibold">Statistics</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-400">Current Streak:</span>
                <span className="ml-2 font-medium">{habit.streak} days</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Longest Streak:</span>
                <span className="ml-2 font-medium">{habit.longestStreak} days</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Total Completions:</span>
                <span className="ml-2 font-medium">{habit.totalCompletions}</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Created:</span>
                <span className="ml-2 font-medium">
                  {new Date(habit.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate({ to: '/habits' })}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isUpdating}>
            <Save className="mr-2 h-4 w-4" />
            {isUpdating ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
}