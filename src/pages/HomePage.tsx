import { useNavigate } from '@tanstack/react-router';
import { useAuthStore } from '@/stores/authStore';
import { Box, Button, Container, Flex, Grid, Heading, Text, Card, Section } from '@radix-ui/themes';
import { useEffect } from 'react';

export function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      navigate({ to: '/dashboard' });
    }
  }, [user, navigate]);

  return (
    <Container size="4">
      <Flex direction="column" align="center" justify="center" minHeight="100vh" gap="8">
        <Box maxWidth="800px">
          <Heading size="9" align="center" mb="4">
            Transform Your Life One Habit at a Time
          </Heading>
          <Text size="5" align="center" color="gray" mb="8">
            Build powerful habits with science-backed tracking, beautiful visualizations, and AI-powered insights.
          </Text>
          
          <Flex gap="4" justify="center" mb="9">
            <Button size="4" onClick={() => navigate({ to: '/signup' })}>
              Start Free Trial
            </Button>
            <Button size="4" variant="outline" onClick={() => navigate({ to: '/login' })}>
              Sign In
            </Button>
          </Flex>

          <Grid columns={{ initial: '1', md: '3' }} gap="6">
            <Card>
              <Flex direction="column" align="center" gap="2">
                <Text size="8">🎯</Text>
                <Heading size="3">Track with Five Factors</Heading>
                <Text size="2" color="gray" align="center">Based on "The Power of Habit" methodology</Text>
              </Flex>
            </Card>
            <Card>
              <Flex direction="column" align="center" gap="2">
                <Text size="8">🪢</Text>
                <Heading size="3">Visual Progress</Heading>
                <Text size="2" color="gray" align="center">Watch your habits strengthen like a rope</Text>
              </Flex>
            </Card>
            <Card>
              <Flex direction="column" align="center" gap="2">
                <Text size="8">🤖</Text>
                <Heading size="3">AI Insights</Heading>
                <Text size="2" color="gray" align="center">Get personalized recommendations</Text>
              </Flex>
            </Card>
          </Grid>
        </Box>
      </Flex>
    </Container>
  );
}