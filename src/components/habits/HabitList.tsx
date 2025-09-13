import { Habit } from '@/types/habit.types';
import { HabitCard } from './HabitCard';

interface HabitListProps {
  habits: Habit[];
}

export function HabitList({ habits }: HabitListProps) {
  const sortedHabits = [...habits].sort((a, b) => {
    // Sort by completion status (incomplete first) then by name
    const aCompleted = a.lastCompletedAt && 
      new Date(a.lastCompletedAt).toDateString() === new Date().toDateString();
    const bCompleted = b.lastCompletedAt && 
      new Date(b.lastCompletedAt).toDateString() === new Date().toDateString();
    
    if (aCompleted === bCompleted) {
      return a.name.localeCompare(b.name);
    }
    
    return aCompleted ? 1 : -1;
  });

  return (
    <div className="space-y-3">
      {sortedHabits.map((habit) => (
        <HabitCard key={habit.id} habit={habit} />
      ))}
    </div>
  );
}