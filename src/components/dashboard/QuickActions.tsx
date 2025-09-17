import { Plus, Calendar, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';

export function QuickActions() {
  const navigate = useNavigate();

  return (
    <div className="flex space-x-2">
      <Button
        size="sm"
        variant="outline"
        onClick={() => navigate({ to: '/habits/new' })}
      >
        <Plus className="mr-1 h-4 w-4" />
        Add Habit
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => navigate({ to: '/analytics' })}
      >
        <TrendingUp className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => navigate({ to: '/habits' })}
      >
        <Calendar className="h-4 w-4" />
      </Button>
    </div>
  );
}