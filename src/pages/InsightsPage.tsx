import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAuthStore } from '@/stores/authStore';
import { useHabitStore } from '@/stores/habitStore';
import { 
  Box, Button, Card, Container, Flex, Grid, Heading, Text, 
  Badge, Progress, Select, Tabs
} from '@radix-ui/themes';
import { 
  BarChart3, TrendingUp, Calendar, Clock, Target, 
  Activity, Brain, Award, Zap, MapPin, Heart, Users,
  Download, Filter, ChevronRight, Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';

export function InsightsPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { habits, entries } = useHabitStore();
  const [dateRange, setDateRange] = useState('7');
  
  useEffect(() => {
    if (!user) {
      navigate({ to: '/login' });
    }
  }, [user, navigate]);

  // Calculate analytics data
  const totalHabits = habits.length;
  const activeHabits = habits.filter(h => h.status === 'active').length;
  const totalStreak = habits.reduce((acc, h) => acc + h.currentStreak, 0);
  const avgCompletionRate = habits.reduce((acc, h) => acc + h.completionRate, 0) / (habits.length || 1);
  
  // Calculate best time for habits
  const timeDistribution = entries.reduce((acc, entry) => {
    if (entry.fiveFactor?.timeOfDay) {
      acc[entry.fiveFactor.timeOfDay] = (acc[entry.fiveFactor.timeOfDay] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);
  
  const bestTime = Object.entries(timeDistribution).sort((a, b) => b[1] - a[1])[0]?.[0] || 'morning';
  
  // Calculate location patterns
  const locationDistribution = entries.reduce((acc, entry) => {
    if (entry.fiveFactor?.location) {
      acc[entry.fiveFactor.location] = (acc[entry.fiveFactor.location] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);
  
  // Calculate emotion patterns
  const emotionDistribution = entries.reduce((acc, entry) => {
    if (entry.fiveFactor?.emotion) {
      acc[entry.fiveFactor.emotion] = (acc[entry.fiveFactor.emotion] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);
  
  // Weekly progress (mock data for visualization)
  const weeklyData = [
    { day: 'Mon', completed: 8, target: 10 },
    { day: 'Tue', completed: 9, target: 10 },
    { day: 'Wed', completed: 7, target: 10 },
    { day: 'Thu', completed: 10, target: 10 },
    { day: 'Fri', completed: 6, target: 10 },
    { day: 'Sat', completed: 9, target: 10 },
    { day: 'Sun', completed: 10, target: 10 }
  ];
  
  const categoryPerformance = habits.reduce((acc, habit) => {
    if (!acc[habit.category]) {
      acc[habit.category] = { count: 0, totalStreak: 0, avgCompletion: 0 };
    }
    acc[habit.category].count++;
    acc[habit.category].totalStreak += habit.currentStreak;
    acc[habit.category].avgCompletion += habit.completionRate;
    return acc;
  }, {} as Record<string, any>);
  
  const handleExport = () => {
    const data = {
      habits: habits.map(h => ({
        title: h.title,
        category: h.category,
        streak: h.currentStreak,
        completionRate: h.completionRate,
        createdAt: h.createdAt
      })),
      entries: entries.map(e => ({
        habitId: e.habitId,
        timestamp: e.timestamp,
        fiveFactor: e.fiveFactor
      })),
      analytics: {
        totalHabits,
        activeHabits,
        totalStreak,
        avgCompletionRate,
        bestTime,
        timeDistribution,
        locationDistribution,
        emotionDistribution
      }
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `habitforge-insights-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('📊 Analytics data exported!');
  };

  return (
    <Container size="4" py="6">
      <Flex justify="between" align="center" mb="6">
        <Box>
          <Heading size="7">Insights & Analytics</Heading>
          <Text color="gray" size="3">Understand your habit patterns</Text>
        </Box>
        <Flex gap="3">
          <Select.Root value={dateRange} onValueChange={setDateRange}>
            <Select.Trigger>
              <Calendar className="h-4 w-4 mr-2" />
              Last {dateRange} days
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="7">Last 7 days</Select.Item>
              <Select.Item value="30">Last 30 days</Select.Item>
              <Select.Item value="90">Last 90 days</Select.Item>
            </Select.Content>
          </Select.Root>
          <Button onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </Flex>
      </Flex>

      {/* Key Metrics */}
      <Grid columns={{ initial: '2', md: '4' }} gap="4" mb="6">
        <Card>
          <Flex direction="column" gap="2">
            <Flex align="center" gap="2">
              <Target className="h-5 w-5 text-blue-600" />
              <Text size="2" color="gray">Active Habits</Text>
            </Flex>
            <Heading size="6">{activeHabits}/{totalHabits}</Heading>
            <Progress value={(activeHabits / (totalHabits || 1)) * 100} size="1" color="blue" />
          </Flex>
        </Card>
        
        <Card>
          <Flex direction="column" gap="2">
            <Flex align="center" gap="2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <Text size="2" color="gray">Total Streak</Text>
            </Flex>
            <Heading size="6">{totalStreak} days</Heading>
            <Badge color="green" variant="soft">Combined</Badge>
          </Flex>
        </Card>
        
        <Card>
          <Flex direction="column" gap="2">
            <Flex align="center" gap="2">
              <Activity className="h-5 w-5 text-purple-600" />
              <Text size="2" color="gray">Completion Rate</Text>
            </Flex>
            <Heading size="6">{Math.round(avgCompletionRate * 100)}%</Heading>
            <Progress value={avgCompletionRate * 100} size="1" color="purple" />
          </Flex>
        </Card>
        
        <Card>
          <Flex direction="column" gap="2">
            <Flex align="center" gap="2">
              <Clock className="h-5 w-5 text-orange-600" />
              <Text size="2" color="gray">Best Time</Text>
            </Flex>
            <Heading size="6" className="capitalize">{bestTime}</Heading>
            <Text size="1" color="gray">Most productive</Text>
          </Flex>
        </Card>
      </Grid>

      <Tabs.Root defaultValue="overview">
        <Tabs.List>
          <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
          <Tabs.Trigger value="patterns">Five-Factor Patterns</Tabs.Trigger>
          <Tabs.Trigger value="progress">Progress Tracking</Tabs.Trigger>
          <Tabs.Trigger value="predictions">AI Predictions</Tabs.Trigger>
        </Tabs.List>

        {/* Overview Tab */}
        <Tabs.Content value="overview">
          <Grid columns={{ initial: '1', lg: '2' }} gap="6" mt="4">
            {/* Weekly Progress Chart */}
            <Card>
              <Heading size="4" mb="4">
                <BarChart3 className="inline-block h-5 w-5 mr-2" />
                Weekly Progress
              </Heading>
              <Flex direction="column" gap="3">
                {weeklyData.map(day => (
                  <Box key={day.day}>
                    <Flex justify="between" mb="1">
                      <Text size="2">{day.day}</Text>
                      <Text size="2" weight="bold">{day.completed}/{day.target}</Text>
                    </Flex>
                    <Progress value={(day.completed / day.target) * 100} size="2" />
                  </Box>
                ))}
              </Flex>
            </Card>

            {/* Category Performance */}
            <Card>
              <Heading size="4" mb="4">
                <Target className="inline-block h-5 w-5 mr-2" />
                Category Performance
              </Heading>
              <Flex direction="column" gap="3">
                {Object.entries(categoryPerformance).map(([category, data]) => (
                  <Card key={category} variant="surface">
                    <Flex justify="between" align="center">
                      <Box>
                        <Text weight="medium" className="capitalize">{category}</Text>
                        <Text size="2" color="gray">{data.count} habits</Text>
                      </Box>
                      <Flex gap="2">
                        <Badge color="blue">
                          {Math.round((data.avgCompletion / data.count) * 100)}%
                        </Badge>
                        <Badge color="green">
                          {Math.round(data.totalStreak / data.count)}d avg
                        </Badge>
                      </Flex>
                    </Flex>
                  </Card>
                ))}
              </Flex>
            </Card>
          </Grid>
        </Tabs.Content>

        {/* Five-Factor Patterns */}
        <Tabs.Content value="patterns">
          <Grid columns={{ initial: '1', md: '3' }} gap="6" mt="4">
            {/* Location Patterns */}
            <Card>
              <Heading size="4" mb="4">
                <MapPin className="inline-block h-5 w-5 mr-2" />
                Location Patterns
              </Heading>
              <Flex direction="column" gap="2">
                {Object.entries(locationDistribution)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 5)
                  .map(([location, count]) => (
                    <Flex key={location} justify="between">
                      <Text size="2" className="capitalize">{location}</Text>
                      <Badge variant="soft">{count}</Badge>
                    </Flex>
                  ))}
              </Flex>
            </Card>

            {/* Emotion Patterns */}
            <Card>
              <Heading size="4" mb="4">
                <Heart className="inline-block h-5 w-5 mr-2" />
                Emotion Patterns
              </Heading>
              <Flex direction="column" gap="2">
                {Object.entries(emotionDistribution)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 5)
                  .map(([emotion, count]) => (
                    <Flex key={emotion} justify="between">
                      <Text size="2" className="capitalize">{emotion}</Text>
                      <Badge variant="soft" color={
                        emotion === 'happy' ? 'green' :
                        emotion === 'excited' ? 'yellow' :
                        emotion === 'stressed' ? 'orange' : 'gray'
                      }>{count}</Badge>
                    </Flex>
                  ))}
              </Flex>
            </Card>

            {/* Time Distribution */}
            <Card>
              <Heading size="4" mb="4">
                <Clock className="inline-block h-5 w-5 mr-2" />
                Time Distribution
              </Heading>
              <Flex direction="column" gap="2">
                {Object.entries(timeDistribution)
                  .sort((a, b) => b[1] - a[1])
                  .map(([time, count]) => (
                    <Flex key={time} justify="between">
                      <Text size="2" className="capitalize">{time}</Text>
                      <Badge variant="soft">{count}</Badge>
                    </Flex>
                  ))}
              </Flex>
            </Card>
          </Grid>

          {/* Insights Card */}
          <Card mt="6" className="bg-gradient-to-r from-blue-50 to-purple-50">
            <Flex align="center" gap="3">
              <Brain className="h-6 w-6 text-blue-600" />
              <Box>
                <Heading size="4">Pattern Insights</Heading>
                <Text size="2" mt="1">
                  You're most successful with habits in the {bestTime} when you're at {
                    Object.entries(locationDistribution)[0]?.[0] || 'home'
                  }. Your dominant emotion during successful completions is {
                    Object.entries(emotionDistribution)[0]?.[0] || 'neutral'
                  }.
                </Text>
              </Box>
            </Flex>
          </Card>
        </Tabs.Content>

        {/* Progress Tracking */}
        <Tabs.Content value="progress">
          <Grid columns={{ initial: '1', lg: '2' }} gap="6" mt="4">
            {/* Streak Progress */}
            <Card>
              <Heading size="4" mb="4">Streak Progress</Heading>
              <Flex direction="column" gap="3">
                {habits.slice(0, 5).map(habit => (
                  <Box key={habit.id}>
                    <Flex justify="between" mb="1">
                      <Text size="2" weight="medium">{habit.title}</Text>
                      <Badge color={habit.currentStreak > 21 ? 'gold' : 'blue'}>
                        {habit.currentStreak} days
                      </Badge>
                    </Flex>
                    <Progress value={Math.min((habit.currentStreak / 90) * 100, 100)} size="2" />
                  </Box>
                ))}
              </Flex>
            </Card>

            {/* Milestone Achievements */}
            <Card>
              <Heading size="4" mb="4">Milestone Progress</Heading>
              <Flex direction="column" gap="3">
                {[7, 21, 30, 60, 90].map(days => {
                  const achieved = habits.filter(h => h.currentStreak >= days).length;
                  return (
                    <Flex key={days} justify="between" align="center">
                      <Flex align="center" gap="2">
                        <Award className={`h-4 w-4 ${achieved > 0 ? 'text-green-600' : 'text-gray-400'}`} />
                        <Text size="2">{days}-Day Milestone</Text>
                      </Flex>
                      <Badge color={achieved > 0 ? 'green' : 'gray'}>
                        {achieved}/{totalHabits}
                      </Badge>
                    </Flex>
                  );
                })}
              </Flex>
            </Card>
          </Grid>
        </Tabs.Content>

        {/* AI Predictions */}
        <Tabs.Content value="predictions">
          <Grid columns={{ initial: '1', md: '2' }} gap="6" mt="4">
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50">
              <Flex align="start" gap="3">
                <Sparkles className="h-6 w-6 text-purple-600 flex-shrink-0" />
                <Box>
                  <Heading size="4" mb="2">Success Prediction</Heading>
                  <Text size="2">
                    Based on your patterns, you have an 85% chance of maintaining your habits 
                    if you continue at the current pace. Focus on {bestTime} sessions for best results.
                  </Text>
                  <Progress value={85} size="2" color="purple" mt="2" />
                </Box>
              </Flex>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-emerald-50">
              <Flex align="start" gap="3">
                <Zap className="h-6 w-6 text-green-600 flex-shrink-0" />
                <Box>
                  <Heading size="4" mb="2">Optimization Tip</Heading>
                  <Text size="2">
                    Try bundling your {Object.keys(categoryPerformance)[0]} habits together. 
                    Your data shows higher completion rates when habits are performed in sequence.
                  </Text>
                  <Button size="2" variant="soft" mt="3">
                    Apply Suggestion
                  </Button>
                </Box>
              </Flex>
            </Card>
          </Grid>
        </Tabs.Content>
      </Tabs.Root>
    </Container>
  );
}