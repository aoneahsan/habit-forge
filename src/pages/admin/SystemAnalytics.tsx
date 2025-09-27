import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { 
  Box, Button, Card, Container, Flex, Grid, Heading, 
  Text, Select, Badge, Progress 
} from '@radix-ui/themes';
import { 
  BarChart3, TrendingUp, Users, Activity, Calendar,
  Download, Filter, RefreshCw, ChevronRight,
  Clock, Target, Award, Zap
} from 'lucide-react';
import toast from 'react-hot-toast';

export function SystemAnalytics() {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState('7');
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    toast.success('📊 Analytics data refreshed!');
    setTimeout(() => setRefreshing(false), 2000);
  };

  const handleExport = () => {
    toast.loading('Preparing analytics export...', { duration: 2000 });
    setTimeout(() => {
      toast.success('📦 Analytics report ready for download!');
      toast('Download starting...', { icon: '⬇️', duration: 3000 });
    }, 2000);
  };

  const metrics = [
    { label: 'New Users', value: '1,234', change: '+12%', color: 'blue' },
    { label: 'Active Users', value: '8,456', change: '+8%', color: 'green' },
    { label: 'Habits Created', value: '3,789', change: '+15%', color: 'purple' },
    { label: 'Completion Rate', value: '87%', change: '+2%', color: 'orange' }
  ];

  const topHabits = [
    { name: 'Meditation', users: 2456, completion: 92 },
    { name: 'Exercise', users: 2103, completion: 88 },
    { name: 'Reading', users: 1876, completion: 85 },
    { name: 'Water Intake', users: 1654, completion: 94 },
    { name: 'Sleep Schedule', users: 1432, completion: 78 }
  ];

  const userActivity = [
    { hour: '00:00', active: 234 },
    { hour: '06:00', active: 1456 },
    { hour: '12:00', active: 3234 },
    { hour: '18:00', active: 2876 },
    { hour: '23:00', active: 987 }
  ];

  return (
    <Container size="4" py="6">
      <Flex justify="between" align="center" mb="6">
        <Box>
          <Heading size="7">System Analytics</Heading>
          <Text color="gray" size="3">Performance metrics and insights</Text>
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
              <Select.Item value="365">Last year</Select.Item>
            </Select.Content>
          </Select.Root>
          <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </Flex>
      </Flex>

      {/* Key Metrics */}
      <Grid columns={{ initial: '2', md: '4' }} gap="4" mb="6">
        {metrics.map((metric) => (
          <Card key={metric.label}>
            <Flex direction="column" gap="2">
              <Text size="2" color="gray">{metric.label}</Text>
              <Flex align="baseline" gap="2">
                <Heading size="6">{metric.value}</Heading>
                <Badge color={metric.change.startsWith('+') ? 'green' : 'red'} variant="soft">
                  {metric.change}
                </Badge>
              </Flex>
            </Flex>
          </Card>
        ))}
      </Grid>

      {/* Charts Section */}
      <Grid columns={{ initial: '1', lg: '2' }} gap="6" mb="6">
        {/* User Growth Chart */}
        <Card>
          <Flex justify="between" align="center" mb="4">
            <Heading size="4">User Growth</Heading>
            <Badge color="blue" variant="soft">
              <TrendingUp className="h-3 w-3 mr-1" />
              Trending Up
            </Badge>
          </Flex>
          <Box className="h-48 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center">
            <Text size="3" color="gray">User growth chart visualization</Text>
          </Box>
          <Flex gap="4" mt="4">
            <Text size="2" color="gray">
              <strong>Peak:</strong> 3,456 users
            </Text>
            <Text size="2" color="gray">
              <strong>Average:</strong> 2,134 users
            </Text>
          </Flex>
        </Card>

        {/* Habit Categories */}
        <Card>
          <Flex justify="between" align="center" mb="4">
            <Heading size="4">Popular Categories</Heading>
            <Button variant="ghost" size="1" onClick={() => {
              toast('Category details view coming soon!');
            }}>
              View All
              <ChevronRight className="h-3 w-3 ml-1" />
            </Button>
          </Flex>
          <Flex direction="column" gap="3">
            {['Health', 'Productivity', 'Learning', 'Fitness', 'Mindfulness'].map((category, index) => (
              <Box key={category}>
                <Flex justify="between" mb="1">
                  <Text size="2">{category}</Text>
                  <Text size="2" weight="bold">{85 - index * 10}%</Text>
                </Flex>
                <Progress value={85 - index * 10} size="2" />
              </Box>
            ))}
          </Flex>
        </Card>
      </Grid>

      {/* Top Habits Table */}
      <Card mb="6">
        <Heading size="4" mb="4">Top Performing Habits</Heading>
        <Box className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Habit</th>
                <th className="text-center py-2">Users</th>
                <th className="text-center py-2">Completion Rate</th>
                <th className="text-right py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {topHabits.map((habit) => (
                <tr key={habit.name} className="border-b">
                  <td className="py-3">
                    <Flex align="center" gap="2">
                      <Target className="h-4 w-4 text-blue-600" />
                      <Text weight="medium">{habit.name}</Text>
                    </Flex>
                  </td>
                  <td className="text-center py-3">
                    <Badge variant="soft">{habit.users}</Badge>
                  </td>
                  <td className="text-center py-3">
                    <Flex align="center" justify="center" gap="2">
                      <Progress value={habit.completion} className="flex-1 max-w-20" />
                      <Text size="2">{habit.completion}%</Text>
                    </Flex>
                  </td>
                  <td className="text-right py-3">
                    <Button variant="ghost" size="1" onClick={() => {
                      toast(`Viewing details for ${habit.name}`);
                    }}>
                      Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      </Card>

      {/* User Activity Heatmap */}
      <Card>
        <Heading size="4" mb="4">User Activity Heatmap</Heading>
        <Grid columns="5" gap="2">
          {userActivity.map((slot) => (
            <Card key={slot.hour} variant="surface" className="text-center">
              <Text size="1" color="gray">{slot.hour}</Text>
              <Text size="3" weight="bold">{slot.active}</Text>
              <Progress value={(slot.active / 3234) * 100} size="1" />
            </Card>
          ))}
        </Grid>
        <Flex gap="4" mt="4" justify="center">
          <Badge color="blue" variant="soft">
            <Clock className="h-3 w-3 mr-1" />
            Peak: 12:00 PM
          </Badge>
          <Badge color="gray" variant="soft">
            <Users className="h-3 w-3 mr-1" />
            Average: 1,757 users
          </Badge>
        </Flex>
      </Card>
    </Container>
  );
}