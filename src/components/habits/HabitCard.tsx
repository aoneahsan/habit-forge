import type { Habit } from '@/types/habit.types';
import { Check, Clock, Flame, MoreVertical } from 'lucide-react';
import { Card, Flex, Box, Text, Badge, IconButton } from '@radix-ui/themes';
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

  const getCategoryColor = (category: string): any => {
    const colors = {
      health: 'green',
      productivity: 'blue',
      mindfulness: 'purple',
      fitness: 'orange',
      learning: 'yellow',
      social: 'pink',
      finance: 'indigo',
      creativity: 'cyan',
      other: 'gray',
    } as const;
    return colors[category as keyof typeof colors] || 'gray';
  };

  return (
    <Card
      style={{
        backgroundColor: isCompletedToday ? 'var(--green-2)' : undefined,
        borderColor: isCompletedToday ? 'var(--green-6)' : undefined,
      }}
    >
      <Flex justify="between" align="start" p="4">
        <Box flexGrow="1">
          <Flex align="center" gap="2">
            <Text weight="medium" size="3">
              {habit.name}
            </Text>
            {(habit.streak || 0) > 0 && (
              <Flex align="center" gap="1">
                <Flame size={16} style={{ color: 'var(--orange-9)' }} />
                <Text size="2" weight="medium" color="orange">
                  {habit.streak || 0}
                </Text>
              </Flex>
            )}
          </Flex>
          
          {habit.description && (
            <Text size="2" color="gray" mt="1" style={{ display: 'block' }}>
              {habit.description}
            </Text>
          )}
          
          <Flex align="center" gap="3" mt="2">
            <Badge color={getCategoryColor(habit.category)}>
              {habit.category}
            </Badge>
            
            <Flex align="center" gap="1">
              <Clock size={12} style={{ color: 'var(--gray-9)' }} />
              <Text size="1" color="gray">
                {habit.timeOfDay || 'Anytime'}
              </Text>
            </Flex>
            
            <Text size="1" color="gray">
              {habit.points} pts
            </Text>
          </Flex>
        </Box>
        
        <Flex gap="2">
          <IconButton
            size="3"
            variant={isCompletedToday ? 'solid' : 'outline'}
            onClick={handleComplete}
            disabled={isCompleting || isCompletedToday}
            style={{
              backgroundColor: isCompletedToday ? 'var(--green-9)' : undefined,
            }}
          >
            <Check size={20} style={{ color: isCompletedToday ? 'white' : undefined }} />
          </IconButton>
          
          <IconButton
            size="2"
            variant="ghost"
          >
            <MoreVertical size={16} />
          </IconButton>
        </Flex>
      </Flex>
    </Card>
  );
}