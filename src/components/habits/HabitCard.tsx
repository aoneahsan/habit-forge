import { Habit } from '@/types/habit.types';
import { Check, Clock, Flame, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';
import { completeHabit } from '@/services/firebase/habit.service';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

interface HabitCardProps {
  habit: Habit;
}

export function HabitCard({ habit }: HabitCardProps) {
  const [isCompleting, setIsCompleting] = useState(false);
  const queryClient = useQueryClient();
  
  const isCompletedToday = habit.lastCompletedAt && 
    new Date(habit.lastCompletedAt).toDateString() === new Date().toDateString();

  const handleComplete = async () => {
    if (isCompletedToday) return;
    
    setIsCompleting(true);
    try {
      await completeHabit(habit.id);
      toast.success(`${habit.name} completed! +${habit.points} points`);
      queryClient.invalidateQueries({ queryKey: ['habits'] });
    } catch (error) {
      toast.error('Failed to complete habit');
    } finally {
      setIsCompleting(false);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      health: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
      productivity: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
      mindfulness: 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400',
      fitness: 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400',
      learning: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
      social: 'bg-pink-100 text-pink-700 dark:bg-pink-900/20 dark:text-pink-400',
      finance: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400',
      creativity: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/20 dark:text-cyan-400',
      other: 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400',
    };
    return colors[category] || colors.other;
  };

  return (
    <div
      className={cn(
        'group relative rounded-lg border p-4 transition-all hover:shadow-md',
        isCompletedToday
          ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/10'
          : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h3 className="font-medium text-gray-900 dark:text-white">
              {habit.name}
            </h3>
            {habit.streak > 0 && (
              <div className="flex items-center space-x-1 text-orange-500">
                <Flame className="h-4 w-4" />
                <span className="text-sm font-medium">{habit.streak}</span>
              </div>
            )}
          </div>
          
          {habit.description && (
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {habit.description}
            </p>
          )}
          
          <div className="mt-2 flex items-center space-x-4 text-xs">
            <span className={cn('rounded-full px-2 py-1', getCategoryColor(habit.category))}>
              {habit.category}
            </span>
            
            <div className="flex items-center text-gray-500 dark:text-gray-400">
              <Clock className="mr-1 h-3 w-3" />
              {habit.timeOfDay || 'Anytime'}
            </div>
            
            <span className="text-gray-500 dark:text-gray-400">
              {habit.points} pts
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            size="icon"
            variant={isCompletedToday ? 'default' : 'outline'}
            onClick={handleComplete}
            disabled={isCompleting || isCompletedToday}
            className={cn(
              'h-10 w-10',
              isCompletedToday && 'bg-green-500 hover:bg-green-600'
            )}
          >
            <Check className={cn('h-5 w-5', isCompletedToday && 'text-white')} />
          </Button>
          
          <Button
            size="icon"
            variant="ghost"
            className="opacity-0 group-hover:opacity-100"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}