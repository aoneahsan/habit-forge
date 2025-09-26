import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAuthStore } from '@/stores/authStore';
import { useHabitStore } from '@/stores/habitStore';
import { useNotificationStore } from '@/stores/notificationStore';
import { NotificationCenter } from '@/components/NotificationCenter';
import { Box, Button, Card, Container, Flex, Grid, Heading, Text, Progress, Badge, Section, Avatar, Separator } from '@radix-ui/themes';
import toast from 'react-hot-toast';
import { 
  Plus, Target, TrendingUp, Award, Calendar, Activity, 
  Clock, Sparkles, Flame, Trophy, Star, ChevronRight,
  CheckCircle2, Users, Zap, BarChart3, MessageSquare,
  Heart, MapPin, Users2, Bell, Settings, LogOut
} from 'lucide-react';

export function DashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { habits, fetchHabits, completeHabitToday } = useHabitStore();
  const { fetchNotifications, fetchPreferences } = useNotificationStore();
  const [timeOfDay, setTimeOfDay] = useState('');

  useEffect(() => {
    if (!user) {
      navigate({ to: '/login' });
      return;
    }
    fetchHabits(user.uid);
    fetchNotifications(user.uid);
    fetchPreferences(user.uid);
    
    // Set greeting based on time
    const hour = new Date().getHours();
    if (hour < 12) setTimeOfDay('morning');
    else if (hour < 17) setTimeOfDay('afternoon');
    else setTimeOfDay('evening');
  }, [user, navigate, fetchHabits, fetchNotifications, fetchPreferences]);

  const activeHabits = habits.filter(h => h.status === 'active');
  const totalStreak = habits.reduce((acc, h) => acc + h.currentStreak, 0);
  const completionRate = activeHabits.length > 0 
    ? Math.round((activeHabits.filter(h => h.completedToday).length / activeHabits.length) * 100)
    : 0;

  const getStreakBadgeColor = (streak: number) => {
    if (streak >= 100) return 'gold';
    if (streak >= 50) return 'purple';
    if (streak >= 21) return 'blue';
    if (streak >= 7) return 'green';
    return 'gray';
  };

  const handleLogout = async () => {
    await logout();
    navigate({ to: '/' });
  };

  return (
    <Box>
      {/* Header Navigation */}
      <Box className="border-b sticky top-0 bg-white/95 backdrop-blur-sm z-40">
        <Container size="4">
          <Flex justify="between" align="center" py="3">
            <Flex align="center" gap="6">
              <Flex align="center" gap="2">
                <Box className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                  <Activity className="h-5 w-5 text-white" />
                </Box>
                <Text size="4" weight="bold">HabitForge</Text>
              </Flex>
              <Flex gap="4" className="hidden md:flex">
                <Button variant="ghost" size="2" onClick={() => {
                  toast.success('You are already on the Dashboard!');
                }}>Dashboard</Button>
                <Button variant="ghost" size="2" onClick={() => navigate({ to: '/habits' })}>Habits</Button>
                <Button variant="ghost" size="2" onClick={() => navigate({ to: '/community' })}>Community</Button>
                <Button variant="ghost" size="2" onClick={() => navigate({ to: '/insights' })}>Insights</Button>
              </Flex>
            </Flex>
            <Flex align="center" gap="3">
              <NotificationCenter />
              <Button variant="ghost" size="2" onClick={() => navigate({ to: '/settings' })}>
                <Settings className="h-4 w-4" />
              </Button>
              <Avatar 
                size="2" 
                fallback={user?.displayName?.[0] || 'U'} 
                className="cursor-pointer"
                onClick={() => {
                  navigate({ to: '/settings' });
                }}
              />
              <Button variant="ghost" size="2" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </Flex>
          </Flex>
        </Container>
      </Box>

      {/* Welcome Hero Section */}
      <Section className="bg-gradient-to-b from-blue-50 via-purple-50 to-white">
        <Container size="4" py="8">
          <Grid columns={{ initial: '1', lg: '3' }} gap="6">
            <Box className="lg:col-span-2">
              <Badge size="2" variant="soft" color="purple" mb="4">
                <Sparkles className="h-3 w-3 mr-1" />
                Good {timeOfDay}, {user?.displayName || 'Champion'}!
              </Badge>
              <Heading size="8" mb="3" className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Your Habit Journey Dashboard
              </Heading>
              <Text size="4" color="gray" mb="6">
                You're building incredible momentum! Keep pushing forward and watch your habits transform your life.
              </Text>
              
              {/* Quick Actions */}
              <Flex gap="3" wrap="wrap">
                <Button size="3" onClick={() => navigate({ to: '/habits' })}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Habit
                </Button>
                <Button size="3" variant="outline" onClick={() => {
                  if (activeHabits.length === 0) {
                    toast.error('Create a habit first before checking in!');
                    navigate({ to: '/habits' });
                  } else {
                    toast.success('Quick check-in opened! Mark your habits as complete below.');
                    document.querySelector('[id="habits-section"]')?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Check In
                </Button>
                <Button size="3" variant="outline" onClick={() => navigate({ to: '/insights' })}>
                  <BarChart3 className="mr-2 h-4 w-4" />
                  View Analytics
                </Button>
              </Flex>
            </Box>
            
            {/* Motivational Card */}
            <Card className="bg-gradient-to-br from-purple-500 to-blue-600">
              <Flex direction="column" gap="4">
                <Badge size="1" variant="solid" className="bg-white/20 text-white self-start">
                  Daily Motivation
                </Badge>
                <Text size="3" className="text-white font-medium">
                  "We are what we repeatedly do. Excellence, then, is not an act, but a habit."
                </Text>
                <Text size="2" className="text-white/80">— Aristotle</Text>
                <Flex align="center" gap="2" className="text-white/90">
                  <Star className="h-4 w-4 fill-current" />
                  <Text size="2">Shared by 1,842 members today</Text>
                </Flex>
              </Flex>
            </Card>
          </Grid>
        </Container>
      </Section>

      {/* Main Stats Section */}
      <Section size="2">
        <Container size="4">
          <Grid columns={{ initial: '2', md: '4' }} gap="4">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <Flex direction="column" gap="2">
                <Flex justify="between" align="center">
                  <Target className="h-8 w-8 text-blue-600" />
                  <Badge color="blue" variant="soft">Active</Badge>
                </Flex>
                <Heading size="7">{activeHabits.length}</Heading>
                <Text size="2" color="gray">Active Habits</Text>
                <Progress value={activeHabits.length * 20} size="1" color="blue" />
              </Flex>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <Flex direction="column" gap="2">
                <Flex justify="between" align="center">
                  <Flame className="h-8 w-8 text-green-600" />
                  <Badge color="green" variant="soft">{totalStreak}d</Badge>
                </Flex>
                <Heading size="7">{totalStreak}</Heading>
                <Text size="2" color="gray">Total Streak Days</Text>
                <Progress value={Math.min(totalStreak, 100)} size="1" color="green" />
              </Flex>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <Flex direction="column" gap="2">
                <Flex justify="between" align="center">
                  <Trophy className="h-8 w-8 text-purple-600" />
                  <Badge color="purple" variant="soft">Level 5</Badge>
                </Flex>
                <Heading size="7">{user?.stats?.achievements?.length || 12}</Heading>
                <Text size="2" color="gray">Achievements</Text>
                <Progress value={75} size="1" color="purple" />
              </Flex>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <Flex direction="column" gap="2">
                <Flex justify="between" align="center">
                  <Activity className="h-8 w-8 text-orange-600" />
                  <Badge color="orange" variant="soft">{completionRate}%</Badge>
                </Flex>
                <Heading size="7">{completionRate}%</Heading>
                <Text size="2" color="gray">Today's Progress</Text>
                <Progress value={completionRate} size="1" color="orange" />
              </Flex>
            </Card>
          </Grid>
        </Container>
      </Section>

      {/* Today's Habits Section */}
      <Section size="3" id="habits-section">
        <Container size="4">
          <Flex justify="between" align="center" mb="6">
            <Box>
              <Heading size="6" mb="2">Today's Habits</Heading>
              <Text color="gray">Complete your daily habits to maintain your streaks</Text>
            </Box>
            <Button variant="outline" onClick={() => navigate({ to: '/habits' })}>
              View All
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </Flex>

          {activeHabits.length === 0 ? (
            <Card size="4" className="bg-gradient-to-br from-gray-50 to-gray-100">
              <Flex direction="column" align="center" justify="center" py="9">
                <Box className="p-4 bg-white rounded-full mb-4">
                  <Target className="h-12 w-12 text-gray-400" />
                </Box>
                <Heading size="5" mb="2">No habits yet</Heading>
                <Text color="gray" mb="4" align="center" className="max-w-md">
                  Start your transformation journey by creating your first habit. 
                  We'll help you track and strengthen it day by day!
                </Text>
                <Button size="3" onClick={() => navigate({ to: '/habits' })}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Habit
                </Button>
              </Flex>
            </Card>
          ) : (
            <Grid columns={{ initial: '1', md: '2', xl: '3' }} gap="4">
              {activeHabits.slice(0, 6).map((habit) => (
                <Card 
                  key={habit.id} 
                  className="hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer"
                  onClick={() => navigate({ to: `/habits/${habit.id}` })}
                >
                  <Flex direction="column" gap="4">
                    <Flex justify="between" align="start">
                      <Box>
                        <Heading size="4" mb="1">{habit.title}</Heading>
                        <Text size="2" color="gray" className="capitalize">
                          {habit.category} • {habit.frequency}
                        </Text>
                      </Box>
                      <Badge 
                        color={getStreakBadgeColor(habit.currentStreak)} 
                        variant="surface"
                      >
                        <Flame className="h-3 w-3 mr-1" />
                        {habit.currentStreak}
                      </Badge>
                    </Flex>

                    {/* Five Factors Quick View */}
                    <Flex gap="2" wrap="wrap">
                      {habit.lastEntry && (
                        <>
                          <Badge size="1" variant="soft" color="blue">
                            <MapPin className="h-3 w-3 mr-1" />
                            {habit.lastEntry.location || 'Home'}
                          </Badge>
                          <Badge size="1" variant="soft" color="green">
                            <Heart className="h-3 w-3 mr-1" />
                            {habit.lastEntry.emotion || 'Good'}
                          </Badge>
                          <Badge size="1" variant="soft" color="purple">
                            <Clock className="h-3 w-3 mr-1" />
                            {habit.lastEntry.timeOfDay || 'Morning'}
                          </Badge>
                        </>
                      )}
                    </Flex>

                    {/* Progress */}
                    <Box>
                      <Flex justify="between" mb="2">
                        <Text size="2" color="gray">Habit Strength</Text>
                        <Text size="2" weight="bold">{Math.round(habit.strength)}%</Text>
                      </Flex>
                      <Progress value={habit.strength} size="2" color="green" />
                    </Box>

                    {/* Actions */}
                    <Flex gap="2">
                      {habit.completedToday ? (
                        <Button size="2" variant="soft" color="green" className="flex-1">
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Completed Today
                        </Button>
                      ) : (
                        <Button size="2" variant="solid" className="flex-1" onClick={async (e) => {
                          e.stopPropagation();
                          await completeHabitToday(habit.id);
                        }}>
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Mark Complete
                        </Button>
                      )}
                      <Button size="2" variant="outline" onClick={(e) => {
                        e.stopPropagation();
                        toast('💬 Notes feature coming soon! Track your thoughts and triggers.', {
                          duration: 3000
                        });
                      }}>
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </Flex>
                  </Flex>
                </Card>
              ))}
            </Grid>
          )}
        </Container>
      </Section>

      {/* Community Highlights */}
      <Section size="3" className="bg-gray-50" id="community-section">
        <Container size="4">
          <Flex justify="between" align="center" mb="6">
            <Box>
              <Heading size="6" mb="2">Community Highlights</Heading>
              <Text color="gray">Connect with others on similar journeys</Text>
            </Box>
            <Button variant="outline" onClick={() => navigate({ to: '/community' })}>
              Explore Community
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </Flex>

          <Grid columns={{ initial: '1', md: '3' }} gap="4">
            <Card>
              <Flex direction="column" gap="3">
                <Badge size="2" color="blue" variant="soft" className="self-start">
                  <Users className="h-3 w-3 mr-1" />
                  Active Challenge
                </Badge>
                <Heading size="4">30-Day Meditation</Heading>
                <Text size="2" color="gray">
                  Join 234 others in building a daily meditation practice
                </Text>
                <Progress value={45} size="2" />
                <Flex justify="between">
                  <Text size="1" color="gray">13 days left</Text>
                  <Text size="1" weight="bold">45% complete</Text>
                </Flex>
                <Button size="2" variant="soft" onClick={() => {
                  toast.success('🎯 Challenge joined! 30-Day Meditation starts tomorrow.');
                  toast('You\'ll receive daily reminders and tips!', {
                    duration: 4000,
                    icon: '🧘'
                  });
                }}>Join Challenge</Button>
              </Flex>
            </Card>

            <Card>
              <Flex direction="column" gap="3">
                <Badge size="2" color="green" variant="soft" className="self-start">
                  <Zap className="h-3 w-3 mr-1" />
                  Trending Habit
                </Badge>
                <Heading size="4">Morning Workout</Heading>
                <Text size="2" color="gray">
                  1,432 people started this habit this week
                </Text>
                <Flex gap="1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <Text size="2" color="gray" ml="2">4.8</Text>
                </Flex>
                <Button size="2" variant="soft" onClick={() => {
                  toast.info('Morning Workout: 5:30 AM daily, 20-30 minutes');
                  toast('Includes warm-up, cardio, strength, and cooldown!', {
                    duration: 4000,
                    icon: '💪'
                  });
                }}>View Details</Button>
              </Flex>
            </Card>

            <Card>
              <Flex direction="column" gap="3">
                <Badge size="2" color="purple" variant="soft" className="self-start">
                  <Users2 className="h-3 w-3 mr-1" />
                  Buddy Match
                </Badge>
                <Heading size="4">Find Your Partner</Heading>
                <Text size="2" color="gray">
                  Get matched with an accountability buddy
                </Text>
                <Flex align="center" gap="2">
                  <Avatar size="1" fallback="A" />
                  <Avatar size="1" fallback="B" />
                  <Avatar size="1" fallback="C" />
                  <Text size="1" color="gray">+89 waiting</Text>
                </Flex>
                <Button size="2" variant="soft" onClick={() => {
                  toast.success('🤝 Matching you with an accountability partner...');
                  setTimeout(() => {
                    toast.success('Match found! Sarah from California shares your fitness goals.', {
                      duration: 5000,
                      icon: '✨'
                    });
                  }, 2000);
                }}>Find Buddy</Button>
              </Flex>
            </Card>
          </Grid>
        </Container>
      </Section>

      {/* Achievements Showcase */}
      <Section size="3">
        <Container size="4">
          <Flex justify="between" align="center" mb="6">
            <Box>
              <Heading size="6" mb="2">Recent Achievements</Heading>
              <Text color="gray">Celebrate your milestones</Text>
            </Box>
            <Button variant="outline" onClick={() => navigate({ to: '/achievements' })}>
              View All
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </Flex>

          <Grid columns={{ initial: '2', sm: '3', md: '6' }} gap="4">
            {[
              { name: 'First Step', icon: '🏃', earned: true },
              { name: '7-Day Streak', icon: '🔥', earned: true },
              { name: 'Early Bird', icon: '🌅', earned: true },
              { name: 'Night Owl', icon: '🦉', earned: false },
              { name: 'Social Butterfly', icon: '🦋', earned: false },
              { name: 'Habit Master', icon: '👑', earned: false }
            ].map((achievement) => (
              <Card 
                key={achievement.name}
                className={achievement.earned ? 'border-yellow-300 bg-yellow-50' : 'opacity-50'}
              >
                <Flex direction="column" align="center" gap="2" p="2">
                  <Text size="6">{achievement.icon}</Text>
                  <Text size="1" weight="medium" align="center">
                    {achievement.name}
                  </Text>
                  {achievement.earned && (
                    <CheckCircle2 className="h-3 w-3 text-green-600" />
                  )}
                </Flex>
              </Card>
            ))}
          </Grid>
        </Container>
      </Section>
    </Box>
  );
}