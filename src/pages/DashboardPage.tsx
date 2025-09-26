import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAuthStore } from '@/stores/authStore';
import { useHabitStore } from '@/stores/habitStore';
import { Box, Button, Card, Container, Flex, Grid, Heading, Text, Progress, Badge } from '@radix-ui/themes';
import { Plus, Target, TrendingUp, Award, Calendar } from 'lucide-react';

export function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { habits, fetchHabits } = useHabitStore();

  useEffect(() => {
    if (!user) {
      navigate({ to: '/login' });
      return;
    }
    fetchHabits(user.uid);
  }, [user, navigate, fetchHabits]);

  const activeHabits = habits.filter(h => h.status === 'active');
  const totalStreak = habits.reduce((acc, h) => acc + h.currentStreak, 0);

  return (
    <Container size="4" py="8">
      <Box mb="8">
        <Heading size="8" mb="2">Welcome back!</Heading>
        <Text color="gray">Here's your habit progress overview</Text>
      </Box>

      {/* Statistics Cards */}
      <Grid columns={{ initial: '1', sm: '2', lg: '4' }} gap="6" mb="8">
        <Card>
          <Flex justify="between" align="start" mb="4">
            <Box>
              <Text size="2" color="gray" weight="medium">Active Habits</Text>
              <Heading size="7" mt="2">{activeHabits.length}</Heading>
              <Text size="1" color="gray">habits being tracked</Text>
            </Box>
            <Target className="h-5 w-5 text-gray-400" />
          </Flex>
        </Card>

        <Card>
          <Flex justify="between" align="start" mb="4">
            <Box>
              <Text size="2" color="gray" weight="medium">Total Streak</Text>
              <Heading size="7" mt="2">{totalStreak}</Heading>
              <Text size="1" color="gray">days combined</Text>
            </Box>
            <TrendingUp className="h-5 w-5 text-gray-400" />
          </Flex>
        </Card>

        <Card>
          <Flex justify="between" align="start" mb="4">
            <Box>
              <Text size="2" color="gray" weight="medium">Achievements</Text>
              <Heading size="7" mt="2">{user?.stats?.achievements?.length || 0}</Heading>
              <Text size="1" color="gray">badges earned</Text>
            </Box>
            <Award className="h-5 w-5 text-gray-400" />
          </Flex>
        </Card>

        <Card>
          <Flex justify="between" align="start" mb="4">
            <Box>
              <Text size="2" color="gray" weight="medium">This Week</Text>
              <Heading size="7" mt="2">85%</Heading>
              <Text size="1" color="gray">completion rate</Text>
            </Box>
            <Calendar className="h-5 w-5 text-gray-400" />
          </Flex>
        </Card>
      </Grid>

      {/* Habits Section Header */}
      <Flex justify="between" align="center" mb="6">
        <Heading size="6">Your Habits</Heading>
        <Button onClick={() => navigate({ to: '/habits' })}>
          <Plus className="mr-2 h-4 w-4" />
          New Habit
        </Button>
      </Flex>

      {/* Habits Grid */}
      <Grid columns={{ initial: '1', sm: '2', lg: '3' }} gap="6">
        {activeHabits.map((habit) => (
          <Card key={habit.id} className="cursor-pointer hover:shadow-lg transition-shadow">
            <Flex direction="column" gap="4">
              <Flex justify="between" align="center">
                <Heading size="4">{habit.title}</Heading>
                <Badge color="blue">{habit.currentStreak} days</Badge>
              </Flex>
              
              <Flex direction="column" gap="2">
                <Flex justify="between">
                  <Text size="2" color="gray">Category</Text>
                  <Text size="2" weight="medium" className="capitalize">{habit.category}</Text>
                </Flex>
                <Flex justify="between">
                  <Text size="2" color="gray">Completion</Text>
                  <Text size="2" weight="medium">{Math.round(habit.completionRate * 100)}%</Text>
                </Flex>
              </Flex>

              <Box>
                <Text size="1" color="gray" mb="1">Habit Strength</Text>
                <Progress value={habit.strength} size="2" />
              </Box>
            </Flex>
          </Card>
        ))}
      </Grid>

      {/* Empty State */}
      {activeHabits.length === 0 && (
        <Card size="4">
          <Flex direction="column" align="center" justify="center" py="9">
            <Target className="h-12 w-12 text-gray-400 mb-4" />
            <Heading size="5" mb="2">No habits yet</Heading>
            <Text color="gray" mb="4">Start building your first habit today!</Text>
            <Button onClick={() => navigate({ to: '/habits' })}>
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Habit
            </Button>
          </Flex>
        </Card>
      )}
    </Container>
  );
}