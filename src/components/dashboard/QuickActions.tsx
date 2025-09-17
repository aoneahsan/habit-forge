import { Plus, Calendar, TrendingUp } from 'lucide-react';
import { Button, Flex } from '@radix-ui/themes';
import { useNavigate } from '@tanstack/react-router';

export function QuickActions() {
  const navigate = useNavigate();

  return (
    <Flex gap="2">
      <Button
        size="2"
        variant="outline"
        onClick={() => navigate({ to: '/habits/new' })}
      >
        <Plus size={16} />
        Add Habit
      </Button>
      <Button
        size="2"
        variant="ghost"
        onClick={() => navigate({ to: '/analytics' })}
      >
        <TrendingUp size={16} />
      </Button>
      <Button
        size="2"
        variant="ghost"
        onClick={() => navigate({ to: '/habits' })}
      >
        <Calendar size={16} />
      </Button>
    </Flex>
  );
}