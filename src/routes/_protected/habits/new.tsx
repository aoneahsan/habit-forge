import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useState } from 'react';
import { createHabit } from '@/services/firebase/habit.service';
import { useAuthStore } from '@/stores/auth.store';
import { Button, TextField, Card, Box, Flex, Container, Text, Heading, Select, TextArea, Checkbox } from '@radix-ui/themes';
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
    <Container size="2">
      <Flex direction="column" gap="6">
        {/* Header */}
        <Flex align="center" gap="4">
          <Button
            onClick={() => navigate({ to: '/habits' })}
            variant="ghost"
            size="2"
          >
            <ArrowLeft size={20} />
          </Button>
          <Box>
            <Heading size="6">Create New Habit</Heading>
            <Text size="2" color="gray">
              Build a new positive habit into your routine
            </Text>
          </Box>
        </Flex>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex direction="column" gap="6">
            {/* Basic Information */}
            <Card size="3">
              <Heading size="4" mb="4">Basic Information</Heading>
              
              <Flex direction="column" gap="4">
                <Box>
                  <Text as="label" size="2" weight="medium" htmlFor="name">
                    Habit Name *
                  </Text>
                  <TextField.Root
                    id="name"
                    {...register('name')}
                    placeholder="e.g., Morning meditation"
                    mt="1"
                  />
                  {errors.name && (
                    <Text size="1" color="red" mt="1">{errors.name.message}</Text>
                  )}
                </Box>

                <Box>
                  <Text as="label" size="2" weight="medium" htmlFor="description">
                    Description
                  </Text>
                  <TextArea
                    id="description"
                    {...register('description')}
                    placeholder="Brief description of your habit"
                    rows={3}
                    mt="1"
                  />
                  {errors.description && (
                    <Text size="1" color="red" mt="1">{errors.description.message}</Text>
                  )}
                </Box>

                <Box>
                  <Text as="label" size="2" weight="medium">
                    Category *
                  </Text>
                  <Select.Root defaultValue="other" onValueChange={(value) => register('category').onChange({ target: { value } })}>
                    <Select.Trigger mt="1" />
                    <Select.Content>
                      <Select.Item value="health">Health</Select.Item>
                      <Select.Item value="productivity">Productivity</Select.Item>
                      <Select.Item value="mindfulness">Mindfulness</Select.Item>
                      <Select.Item value="fitness">Fitness</Select.Item>
                      <Select.Item value="learning">Learning</Select.Item>
                      <Select.Item value="social">Social</Select.Item>
                      <Select.Item value="finance">Finance</Select.Item>
                      <Select.Item value="creativity">Creativity</Select.Item>
                      <Select.Item value="other">Other</Select.Item>
                    </Select.Content>
                  </Select.Root>
                </Box>
              </Flex>
            </Card>

            {/* Frequency and Target */}
            <Card size="3">
              <Heading size="4" mb="4">Frequency & Target</Heading>
              
              <Flex direction="column" gap="4">
                <Box>
                  <Text as="label" size="2" weight="medium">
                    Frequency *
                  </Text>
                  <Select.Root defaultValue="daily" onValueChange={(value) => register('frequency').onChange({ target: { value } })}>
                    <Select.Trigger mt="1" />
                    <Select.Content>
                      <Select.Item value="daily">Daily</Select.Item>
                      <Select.Item value="weekly">Weekly</Select.Item>
                      <Select.Item value="custom">Custom</Select.Item>
                    </Select.Content>
                  </Select.Root>
                </Box>

                <Flex gap="4">
                  <Box style={{ flex: 1 }}>
                    <Text as="label" size="2" weight="medium">
                      Target Count *
                    </Text>
                    <TextField.Root
                      {...register('targetCount', { valueAsNumber: true })}
                      type="number"
                      min="1"
                      max="100"
                      mt="1"
                    />
                    {errors.targetCount && (
                      <Text size="1" color="red" mt="1">{errors.targetCount.message}</Text>
                    )}
                  </Box>

                  <Box style={{ flex: 1 }}>
                    <Text as="label" size="2" weight="medium">
                      Unit *
                    </Text>
                    <TextField.Root
                      {...register('targetUnit')}
                      placeholder="e.g., minutes, pages, reps"
                      mt="1"
                    />
                    {errors.targetUnit && (
                      <Text size="1" color="red" mt="1">{errors.targetUnit.message}</Text>
                    )}
                  </Box>
                </Flex>

                <Box>
                  <Text as="label" size="2" weight="medium">
                    Time of Day
                  </Text>
                  <Select.Root defaultValue="anytime" onValueChange={(value) => register('timeOfDay').onChange({ target: { value } })}>
                    <Select.Trigger mt="1" />
                    <Select.Content>
                      <Select.Item value="anytime">Anytime</Select.Item>
                      <Select.Item value="morning">Morning</Select.Item>
                      <Select.Item value="afternoon">Afternoon</Select.Item>
                      <Select.Item value="evening">Evening</Select.Item>
                    </Select.Content>
                  </Select.Root>
                </Box>

                <Box>
                  <Text as="label" size="2" weight="medium">
                    Points *
                  </Text>
                  <TextField.Root
                    {...register('points', { valueAsNumber: true })}
                    type="number"
                    min="1"
                    max="100"
                    mt="1"
                  />
                  {errors.points && (
                    <Text size="1" color="red" mt="1">{errors.points.message}</Text>
                  )}
                  <Text size="1" color="gray" mt="1">Points earned for completing this habit</Text>
                </Box>
              </Flex>
            </Card>

            {/* Reminders */}
            <Card size="3">
              <Heading size="4" mb="4">Reminders</Heading>
              
              <Flex direction="column" gap="4">
                <Flex align="center" gap="2">
                  <Checkbox
                    {...register('reminder')}
                  />
                  <Text size="2">
                    Enable daily reminder
                  </Text>
                </Flex>

                {reminder && (
                  <Box>
                    <Text as="label" size="2" weight="medium">
                      Reminder Time
                    </Text>
                    <TextField.Root
                      {...register('reminderTime')}
                      type="time"
                      mt="1"
                    />
                  </Box>
                )}
              </Flex>
            </Card>

            {/* Five-Factor Model */}
            <Card size="3">
              <Flex justify="between" align="center" mb="4">
                <Heading size="4">Habit Loop Analysis</Heading>
                <Button
                  type="button"
                  onClick={() => setShowFiveFactors(!showFiveFactors)}
                  variant="ghost"
                  size="1"
                >
                  <Info size={16} style={{ marginRight: '4px' }} />
                  {showFiveFactors ? 'Hide' : 'Show'} Details
                </Button>
              </Flex>

              {showFiveFactors && (
                <Flex direction="column" gap="4">
                  <Text size="2" color="gray">
                    Understanding your habit loop helps build stronger habits. Based on "The Power of Habit" by Charles Duhigg.
                  </Text>

                  <Box>
                    <Text as="label" size="2" weight="medium">
                      Cue (Trigger) *
                    </Text>
                    <TextField.Root
                      {...register('cue')}
                      placeholder="What triggers this habit? (e.g., After waking up)"
                      mt="1"
                    />
                    {errors.cue && (
                      <Text size="1" color="red" mt="1">{errors.cue.message}</Text>
                    )}
                  </Box>

                  <Box>
                    <Text as="label" size="2" weight="medium">
                      Craving (Motivation) *
                    </Text>
                    <TextField.Root
                      {...register('craving')}
                      placeholder="What do you crave? (e.g., Mental clarity)"
                      mt="1"
                    />
                    {errors.craving && (
                      <Text size="1" color="red" mt="1">{errors.craving.message}</Text>
                    )}
                  </Box>

                  <Box>
                    <Text as="label" size="2" weight="medium">
                      Response (Action) *
                    </Text>
                    <TextField.Root
                      {...register('response')}
                      placeholder="What's the actual habit? (e.g., Meditate for 10 minutes)"
                      mt="1"
                    />
                    {errors.response && (
                      <Text size="1" color="red" mt="1">{errors.response.message}</Text>
                    )}
                  </Box>

                  <Box>
                    <Text as="label" size="2" weight="medium">
                      Reward (Benefit) *
                    </Text>
                    <TextField.Root
                      {...register('reward')}
                      placeholder="What's the immediate reward? (e.g., Feel calm and focused)"
                      mt="1"
                    />
                    {errors.reward && (
                      <Text size="1" color="red" mt="1">{errors.reward.message}</Text>
                    )}
                  </Box>

                  <Box>
                    <Text as="label" size="2" weight="medium">
                      Investment (Long-term) *
                    </Text>
                    <TextField.Root
                      {...register('investment')}
                      placeholder="How does this help long-term? (e.g., Better mental health)"
                      mt="1"
                    />
                    {errors.investment && (
                      <Text size="1" color="red" mt="1">{errors.investment.message}</Text>
                    )}
                  </Box>
                </Flex>
              )}
            </Card>

            {/* Actions */}
            <Flex justify="end" gap="4" pb="6">
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
            </Flex>
          </Flex>
        </form>
      </Flex>
    </Container>
  );
}