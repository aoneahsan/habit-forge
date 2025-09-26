import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useHabitStore } from '@/stores/habitStore';
import { useAchievementStore } from '@/stores/achievementStore';
import { 
  Box, Button, Card, Container, Flex, Grid, Heading, Text, 
  TextField, TextArea, Select, Progress, Badge 
} from '@radix-ui/themes';
import { Plus, Target } from 'lucide-react';
import toast from 'react-hot-toast';

export function HabitsPage() {
  const { user } = useAuthStore();
  const { habits, createHabit, fetchHabits, completeHabitToday } = useHabitStore();
  const { checkAndUnlockAchievements } = useAchievementStore();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'health',
    type: 'build' as 'build' | 'break',
    goal: '',
    duration: 30,
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
    motivation: ''
  });

  useEffect(() => {
    if (user) {
      fetchHabits(user.uid);
    }
  }, [user, fetchHabits]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await createHabit({
        ...formData,
        userId: user.uid,
        frequency: { type: 'daily' },
        reminders: [],
        milestones: [
          { days: 7, achieved: false },
          { days: 21, achieved: false },
          { days: 30, achieved: false },
          { days: 60, achieved: false },
          { days: 90, achieved: false }
        ],
        successCriteria: formData.goal,
        accountability: 'private'
      });
      toast.success('Habit created successfully!');
      setShowForm(false);
      setFormData({
        title: '',
        description: '',
        category: 'health',
        type: 'build',
        goal: '',
        duration: 30,
        difficulty: 'medium',
        motivation: ''
      });
    } catch (error) {
      toast.error('Failed to create habit');
    }
  };

  return (
    <Container size="4" py="8">
      <Flex justify="between" align="center" mb="8">
        <Box>
          <Heading size="8">My Habits</Heading>
          <Text color="gray">Track and manage all your habits</Text>
        </Box>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          New Habit
        </Button>
      </Flex>

      {showForm && (
        <Card size="4" mb="8">
          <Heading size="5" mb="4">Create New Habit</Heading>
          <form onSubmit={handleSubmit}>
            <Flex direction="column" gap="4">
              <Grid columns={{ initial: '1', sm: '2' }} gap="4">
                <Box>
                  <Text size="2" weight="medium" mb="1">Title</Text>
                  <TextField.Root
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    placeholder="e.g., Morning meditation"
                  />
                </Box>
                
                <Box>
                  <Text size="2" weight="medium" mb="1">Category</Text>
                  <Select.Root
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <Select.Trigger />
                    <Select.Content>
                      <Select.Item value="health">Health</Select.Item>
                      <Select.Item value="productivity">Productivity</Select.Item>
                      <Select.Item value="learning">Learning</Select.Item>
                      <Select.Item value="fitness">Fitness</Select.Item>
                      <Select.Item value="mindfulness">Mindfulness</Select.Item>
                    </Select.Content>
                  </Select.Root>
                </Box>

                <Box>
                  <Text size="2" weight="medium" mb="1">Type</Text>
                  <Select.Root
                    value={formData.type}
                    onValueChange={(value) => setFormData({ ...formData, type: value as 'build' | 'break' })}
                  >
                    <Select.Trigger />
                    <Select.Content>
                      <Select.Item value="build">Build Habit</Select.Item>
                      <Select.Item value="break">Break Habit</Select.Item>
                    </Select.Content>
                  </Select.Root>
                </Box>

                <Box>
                  <Text size="2" weight="medium" mb="1">Duration (days)</Text>
                  <TextField.Root
                    type="number"
                    value={formData.duration.toString()}
                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                    min="7"
                    max="365"
                  />
                </Box>
              </Grid>

              <Box>
                <Text size="2" weight="medium" mb="1">Description</Text>
                <TextArea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Why is this habit important to you?"
                  rows={3}
                />
              </Box>

              <Box>
                <Text size="2" weight="medium" mb="1">Goal</Text>
                <TextField.Root
                  value={formData.goal}
                  onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                  placeholder="What do you want to achieve?"
                />
              </Box>

              <Flex gap="4">
                <Button type="submit">Create Habit</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </Flex>
            </Flex>
          </form>
        </Card>
      )}

      <Grid columns={{ initial: '1', sm: '2', lg: '3' }} gap="6">
        {habits.map((habit) => (
          <Card key={habit.id} className="hover:shadow-lg transition-shadow">
            <Flex justify="between" align="start" mb="4">
              <Box>
                <Heading size="4">{habit.title}</Heading>
                <Text size="2" color="gray" className="capitalize">{habit.category}</Text>
              </Box>
              <Target className="h-5 w-5 text-blue-600" />
            </Flex>
            
            <Text size="2" color="gray" mb="4">{habit.description}</Text>
            
            <Flex direction="column" gap="3">
              <Flex justify="between">
                <Text size="2" color="gray">Current Streak</Text>
                <Badge>{habit.currentStreak} days</Badge>
              </Flex>
              
              <Flex justify="between">
                <Text size="2" color="gray">Completion Rate</Text>
                <Text size="2" weight="bold">{Math.round(habit.completionRate * 100)}%</Text>
              </Flex>
              
              <Box>
                <Text size="1" color="gray" mb="1">Habit Strength</Text>
                <Progress value={habit.strength} size="2" />
              </Box>
            </Flex>

            <Button size="2" className="w-full mt-4" onClick={async () => {
              if (!user) return;
              await completeHabitToday(habit.id);
              // Check for achievements
              const habitStats = {
                maxStreak: habit.currentStreak + 1,
                totalHabits: habits.length,
                todayCompletionRate: 100
              };
              await checkAndUnlockAchievements(user.uid, habitStats);
            }}>
              Track Today
            </Button>
          </Card>
        ))}
      </Grid>

      {habits.length === 0 && !showForm && (
        <Card size="4">
          <Flex direction="column" align="center" justify="center" py="9">
            <Target className="h-16 w-16 text-gray-400 mb-4" />
            <Heading size="5" mb="2">No habits yet</Heading>
            <Text color="gray" mb="6">Start your transformation journey today</Text>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Habit
            </Button>
          </Flex>
        </Card>
      )}
    </Container>
  );
}