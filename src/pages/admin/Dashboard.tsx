import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Box, Button, Card, Container, Flex, Grid, Heading, Text } from '@radix-ui/themes';
import { useAuthStore } from '@/stores/authStore';
import { AdminService } from '@/services/admin.service';
import { 
  Users, 
  Activity, 
  TrendingUp, 
  Settings,
  Shield,
  BarChart,
  AlertCircle,
  Clock
} from 'lucide-react';

export function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const adminService = AdminService.getInstance();

  useEffect(() => {
    if (!user?.isAdmin) {
      navigate({ to: '/dashboard' });
      return;
    }
    loadStats();
  }, [user]);

  const loadStats = async () => {
    try {
      const data = await adminService.getSystemStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Flex align="center" justify="center" minHeight="100vh">
        <Box>
          <Box className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></Box>
        </Box>
      </Flex>
    );
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      change: '+12.5%',
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Active Habits',
      value: stats?.activeHabits || 0,
      change: '+8.3%',
      icon: Activity,
      color: 'green'
    },
    {
      title: 'Daily Entries',
      value: stats?.dailyEntries || 0,
      change: '+15.2%',
      icon: TrendingUp,
      color: 'purple'
    },
    {
      title: 'Premium Users',
      value: stats?.premiumUsers || 0,
      change: '+5.7%',
      icon: Shield,
      color: 'yellow'
    }
  ];

  const quickActions = [
    { title: 'User Management', icon: Users, path: '/admin/users' },
    { title: 'System Config', icon: Settings, path: '/admin/config' },
    { title: 'Analytics', icon: BarChart, path: '/admin/analytics' },
    { title: 'Content Moderation', icon: AlertCircle, path: '/admin/moderation' },
  ];

  return (
    <Container size="4" py="6">
      <Box mb="8">
        <Heading size="8">Admin Dashboard</Heading>
        <Text color="gray" size="3">System overview and management</Text>
      </Box>

      {/* Stats Grid */}
      <Grid columns={{ initial: '1', sm: '2', lg: '4' }} gap="6" mb="8">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <Flex justify="between">
              <Box>
                <Text size="2" color="gray">{stat.title}</Text>
                <Heading size="7" mt="2">{stat.value.toLocaleString()}</Heading>
                <Text size="1" color="green">{stat.change}</Text>
              </Box>
              <stat.icon className="h-10 w-10 text-gray-400" />
            </Flex>
          </Card>
        ))}
      </Grid>

      {/* Quick Actions */}
      <Card size="4" mb="8">
        <Heading size="5" mb="4">Quick Actions</Heading>
        <Grid columns={{ initial: '2', sm: '4' }} gap="4">
          {quickActions.map((action) => (
            <Button
              key={action.title}
              onClick={() => navigate({ to: action.path as any })}
              variant="outline"
              size="3"
            >
              <Flex direction="column" align="center" gap="2">
                <action.icon className="h-8 w-8" />
                <Text size="2">{action.title}</Text>
              </Flex>
            </Button>
          ))}
        </Grid>
      </Card>

      {/* Recent Activity */}
      <Card size="4">
        <Heading size="5" mb="4">Recent System Activity</Heading>
        <Flex direction="column" gap="4">
          {stats?.recentActivity?.map((activity: any, index: number) => (
            <Card key={index} variant="surface">
              <Flex gap="4" align="center">
                <Clock className="h-5 w-5 text-gray-400" />
                <Box>
                  <Text size="2" weight="medium">{activity.description}</Text>
                  <Text size="1" color="gray">{activity.timestamp}</Text>
                </Box>
              </Flex>
            </Card>
          )) || (
            <Text color="gray">No recent activity</Text>
          )}
        </Flex>
      </Card>
    </Container>
  );
}