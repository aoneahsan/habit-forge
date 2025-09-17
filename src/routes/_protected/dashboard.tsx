import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useAuthStore } from '@/stores/auth.store';
import { useHabitStore } from '@/stores/habit.store';
import { Calendar, Target, TrendingUp, Users, Award, Activity, Plus } from 'lucide-react';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { HabitList } from '@/components/habits/HabitList';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { StreakCalendar } from '@/components/dashboard/StreakCalendar';
import { useQuery } from '@tanstack/react-query';
import { getUserHabits } from '@/services/firebase/habit.service';
import { Card, Flex, Box, Text, Heading, Button, Grid, Container } from '@radix-ui/themes';

export const Route = createFileRoute('/_protected/dashboard')({
  component: DashboardPage,
});

function DashboardPage() {
  const navigate = useNavigate();
  const userProfile = useAuthStore((state) => state.userProfile);
  const user = useAuthStore((state) => state.user);
  
  const { data: habits = [], isLoading } = useQuery({
    queryKey: ['habits', user?.uid],
    queryFn: () => getUserHabits(user?.uid!),
    enabled: !!user?.uid,
  });

  const activeHabits = habits.filter(h => h.status === 'active').length;
  const completedToday = habits.filter(h => {
    const today = new Date().toDateString();
    return h.lastCompletedAt && new Date(h.lastCompletedAt).toDateString() === today;
  }).length;

  const currentStreak = userProfile?.stats?.currentStreak || 0;
  const totalPoints = userProfile?.stats?.totalPoints || 0;

  return (
    <Container size="4">
      <Flex direction="column" gap="6">
        {/* Welcome Section */}
        <Card style={{ background: 'linear-gradient(to right, var(--teal-9), var(--teal-10))' }}>
          <Box p="6">
            <Heading size="8" style={{ color: 'white' }}>
              Welcome back, {userProfile?.displayName || 'Habit Forger'}! 👋
            </Heading>
            <Text size="3" mt="2" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
              {currentStreak > 0 
                ? `You're on a ${currentStreak} day streak! Keep it up!`
                : "Let's start building great habits today!"}
            </Text>
          </Box>
        </Card>

        {/* Stats Grid */}
        <Grid columns={{ initial: '1', sm: '2', lg: '4' }} gap="4">
          <StatsCard
            title="Active Habits"
            value={activeHabits}
            icon={Target}
            color="blue"
            change={habits.length > 0 ? '+2 this week' : undefined}
          />
          <StatsCard
            title="Current Streak"
            value={`${currentStreak} days`}
            icon={TrendingUp}
            color="green"
            change={currentStreak > 0 ? 'Personal best!' : undefined}
          />
          <StatsCard
            title="Completed Today"
            value={`${completedToday}/${activeHabits}`}
            icon={Activity}
            color="purple"
          />
          <StatsCard
            title="Total Points"
            value={totalPoints.toLocaleString()}
            icon={Award}
            color="yellow"
            change="+120 today"
          />
        </Grid>

        {/* Main Content Grid */}
        <Grid columns={{ initial: '1', lg: '3' }} gap="6">
          {/* Habits Section - 2 columns */}
          <Box gridColumn={{ lg: 'span 2' }}>
            <Flex direction="column" gap="6">
              <Card>
                <Box p="6">
                  <Flex justify="between" align="center" mb="4">
                    <Heading size="6">
                      Today's Habits
                    </Heading>
                    <QuickActions />
                  </Flex>
                  {isLoading ? (
                    <Flex align="center" justify="center" minHeight="128px">
                      <Text color="gray">Loading habits...</Text>
                    </Flex>
                  ) : habits.length > 0 ? (
                    <HabitList habits={habits} />
                  ) : (
                    <Flex direction="column" align="center" justify="center" py="8">
                      <Target size={64} style={{ color: 'var(--gray-6)', marginBottom: '16px' }} />
                      <Heading size="5" mb="2">
                        No habits yet
                      </Heading>
                      <Text size="2" color="gray" align="center" style={{ maxWidth: '24rem', marginBottom: '24px' }}>
                        Start your journey to building better habits. Create your first habit and begin tracking your progress today!
                      </Text>
                      <Button
                        size="3"
                        onClick={() => navigate({ to: '/habits/new' })}
                      >
                        <Plus size={20} />
                        Create Your First Habit
                      </Button>
                    </Flex>
                  )}
                </Box>
              </Card>

              {/* Progress Chart */}
              <Card>
                <Box p="6">
                  <Heading size="6" mb="4">
                    Weekly Progress
                  </Heading>
                  <Flex align="center" justify="center" minHeight="256px">
                    <Text color="gray">Progress chart coming soon...</Text>
                  </Flex>
                </Box>
              </Card>
            </Flex>
          </Box>

          {/* Sidebar - 1 column */}
          <Flex direction="column" gap="6">
            {/* Streak Calendar */}
            <Card>
              <Box p="6">
                <Heading size="6" mb="4">
                  Streak Calendar
                </Heading>
                <StreakCalendar />
              </Box>
            </Card>

            {/* Rope Status */}
            <Card>
              <Box p="6">
                <Heading size="6" mb="4">
                  Your Rope
                </Heading>
                <Flex align="center" justify="center">
                  <Box position="relative" width="128px" height="128px">
                    <svg width="128" height="128" style={{ transform: 'rotate(-90deg)' }}>
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="var(--gray-6)"
                        strokeWidth="12"
                        fill="none"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="var(--teal-9)"
                        strokeWidth="12"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 56}`}
                        strokeDashoffset={`${2 * Math.PI * 56 * (1 - (currentStreak / 30))}`}
                        style={{ transition: 'all 0.5s' }}
                      />
                    </svg>
                    <Flex
                      position="absolute"
                      inset="0"
                      align="center"
                      justify="center"
                      direction="column"
                    >
                      <Text size="7" weight="bold">
                        {Math.round((currentStreak / 30) * 100)}%
                      </Text>
                      <Text size="1" color="gray">Strong</Text>
                    </Flex>
                  </Box>
                </Flex>
                <Text size="2" color="gray" align="center" mt="4">
                  Keep your streak alive to strengthen your rope!
                </Text>
              </Box>
            </Card>

            {/* Community */}
            <Card>
              <Box p="6">
                <Flex align="center" mb="4">
                  <Users size={20} style={{ marginRight: '8px' }} />
                  <Heading size="6">Community</Heading>
                </Flex>
                <Flex direction="column" gap="3">
                  <Flex justify="between">
                    <Text size="2" color="gray">Global Rank</Text>
                    <Text size="2" weight="medium">#1,234</Text>
                  </Flex>
                  <Flex justify="between">
                    <Text size="2" color="gray">Friends Active</Text>
                    <Text size="2" weight="medium">12</Text>
                  </Flex>
                  <Flex justify="between">
                    <Text size="2" color="gray">Challenges</Text>
                    <Text size="2" weight="medium">3 active</Text>
                  </Flex>
                </Flex>
              </Box>
            </Card>
          </Flex>
        </Grid>
      </Flex>
    </Container>
  );
}