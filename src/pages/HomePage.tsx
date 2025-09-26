import { useNavigate } from '@tanstack/react-router';
import { useAuthStore } from '@/stores/authStore';
import { Box, Button, Container, Flex, Grid, Heading, Text, Card, Section, Badge, Separator } from '@radix-ui/themes';
import { useEffect } from 'react';
import { 
  Target, TrendingUp, Users, Brain, Award, Shield, 
  ArrowRight, Sparkles, BarChart3, Calendar, Clock,
  MapPin, Heart, Users2, Zap, Trophy, Rocket,
  CheckCircle, Star, Activity, Layers, BookOpen,
  MessageSquare, ChevronRight, PlayCircle
} from 'lucide-react';

export function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      navigate({ to: '/dashboard' });
    }
  }, [user, navigate]);

  const features = [
    {
      icon: Target,
      title: 'Five-Factor Tracking',
      description: 'Based on Charles Duhigg\'s "The Power of Habit". Track location, emotions, people, time, and triggers to understand your habit loops.',
      color: 'blue'
    },
    {
      icon: Layers,
      title: 'Rope Visualization',
      description: 'Watch your habits strengthen like a rope - from thin thread to unbreakable steel cable. See your progress in real-time.',
      color: 'purple'
    },
    {
      icon: Brain,
      title: 'AI-Powered Insights',
      description: 'Get personalized recommendations based on your patterns. Our AI analyzes your data to predict success and suggest improvements.',
      color: 'green'
    },
    {
      icon: Users,
      title: 'Community & Accountability',
      description: 'Join challenges, find accountability partners, and share your journey. Together, we build better habits.',
      color: 'orange'
    },
    {
      icon: Trophy,
      title: 'Gamification & Rewards',
      description: 'Earn badges, climb levels, and celebrate milestones. Turn habit building into an engaging game.',
      color: 'yellow'
    },
    {
      icon: Shield,
      title: 'Privacy & Security',
      description: 'Your data is encrypted and never shared. We believe in complete privacy and user control.',
      color: 'red'
    }
  ];

  const fiveFactors = [
    { icon: MapPin, name: 'Location', description: 'Where were you?' },
    { icon: Heart, name: 'Emotion', description: 'How did you feel?' },
    { icon: Users2, name: 'People', description: 'Who was around?' },
    { icon: Clock, name: 'Time', description: 'When did it happen?' },
    { icon: Zap, name: 'Trigger', description: 'What preceded it?' }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Software Engineer',
      content: 'HabitForge helped me build a consistent meditation practice. The rope visualization keeps me motivated!',
      streak: 150
    },
    {
      name: 'Michael Rodriguez',
      role: 'Teacher',
      content: 'Breaking my late-night snacking habit seemed impossible until I tracked the five factors and discovered my triggers.',
      streak: 90
    },
    {
      name: 'Emma Thompson',
      role: 'Entrepreneur',
      content: 'The AI insights showed me my best workout times. My consistency improved 300%!',
      streak: 200
    }
  ];

  const stats = [
    { label: 'Active Users', value: '50,000+' },
    { label: 'Habits Tracked', value: '250,000+' },
    { label: 'Success Rate', value: '87%' },
    { label: 'Avg Streak', value: '42 days' }
  ];

  return (
    <Box>
      {/* Navigation */}
      <Box className="border-b backdrop-blur-sm bg-white/80 sticky top-0 z-50" py="4">
        <Container size="4">
          <Flex justify="between" align="center">
            <Flex align="center" gap="2">
              <Box className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                <Layers className="h-6 w-6 text-white" />
              </Box>
              <Heading size="6" className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                HabitForge
              </Heading>
            </Flex>
            <Flex gap="4" align="center">
              <Button variant="ghost" onClick={() => navigate({ to: '/login' })}>
                Login
              </Button>
              <Button onClick={() => navigate({ to: '/signup' })}>
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Flex>
          </Flex>
        </Container>
      </Box>

      {/* Hero Section */}
      <Section size="4" className="bg-gradient-to-b from-blue-50 via-white to-purple-50">
        <Container size="4">
          <Flex direction="column" align="center" gap="8" py="9">
            <Badge size="2" variant="soft" color="blue">
              <Sparkles className="h-3 w-3 mr-1" />
              Based on "The Power of Habit" by Charles Duhigg
            </Badge>
            
            <Flex direction="column" align="center" gap="4" className="max-w-4xl">
              <Heading size="9" align="center" className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Transform Your Life Through
                <Text className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {" "}Science-Backed Habit Building
                </Text>
              </Heading>
              
              <Text size="5" align="center" color="gray" className="max-w-2xl leading-relaxed">
                Discover the power of the habit loop. Track five crucial factors, visualize your progress as a strengthening rope, 
                and get AI-powered insights to make lasting change. Join 50,000+ people building better lives.
              </Text>
            </Flex>

            <Flex gap="4" align="center">
              <Button size="4" onClick={() => navigate({ to: '/signup' })}>
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="4" variant="outline">
                <PlayCircle className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </Flex>

            {/* Stats Bar */}
            <Grid columns="4" gap="6" width="100%" className="max-w-3xl">
              {stats.map((stat) => (
                <Flex key={stat.label} direction="column" align="center">
                  <Text size="6" weight="bold">{stat.value}</Text>
                  <Text size="2" color="gray">{stat.label}</Text>
                </Flex>
              ))}
            </Grid>
          </Flex>
        </Container>
      </Section>

      {/* Five Factors Section */}
      <Section size="4">
        <Container size="4">
          <Flex direction="column" gap="8">
            <Flex direction="column" align="center" gap="4">
              <Badge size="2" variant="surface" color="purple">
                <BookOpen className="h-3 w-3 mr-1" />
                The Science Behind Success
              </Badge>
              <Heading size="8" align="center">
                Master the Five-Factor System
              </Heading>
              <Text size="4" align="center" color="gray" className="max-w-2xl">
                Every habit has a trigger. By tracking these five crucial factors, 
                you'll discover your patterns and take control of your habits.
              </Text>
            </Flex>

            <Grid columns={{ initial: '1', sm: '2', lg: '5' }} gap="4">
              {fiveFactors.map((factor) => (
                <Card key={factor.name} className="hover:shadow-lg transition-all hover:-translate-y-1">
                  <Flex direction="column" align="center" gap="3" p="4">
                    <Box className="p-3 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl">
                      <factor.icon className="h-8 w-8 text-blue-600" />
                    </Box>
                    <Heading size="4">{factor.name}</Heading>
                    <Text size="2" color="gray" align="center">{factor.description}</Text>
                  </Flex>
                </Card>
              ))}
            </Grid>

            <Card size="3" className="bg-gradient-to-r from-blue-50 to-purple-50">
              <Flex gap="4" align="center">
                <Box className="hidden md:block">
                  <Activity className="h-12 w-12 text-blue-600" />
                </Box>
                <Box flexGrow="1">
                  <Heading size="4" mb="2">See It In Action</Heading>
                  <Text color="gray">
                    Watch how tracking these five factors helped thousands break bad habits 
                    and build positive ones. Your habit loop becomes visible and controllable.
                  </Text>
                </Box>
                <Button>
                  Learn More
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Flex>
            </Card>
          </Flex>
        </Container>
      </Section>

      {/* Features Grid */}
      <Section size="4" className="bg-gray-50">
        <Container size="4">
          <Flex direction="column" gap="8">
            <Flex direction="column" align="center" gap="4">
              <Badge size="2" variant="surface" color="green">
                <Star className="h-3 w-3 mr-1" />
                Everything You Need
              </Badge>
              <Heading size="8" align="center">
                Powerful Features for Lasting Change
              </Heading>
              <Text size="4" align="center" color="gray" className="max-w-2xl">
                We've combined behavioral science, beautiful design, and cutting-edge technology 
                to create the most effective habit tracking platform.
              </Text>
            </Flex>

            <Grid columns={{ initial: '1', sm: '2', lg: '3' }} gap="6">
              {features.map((feature) => (
                <Card key={feature.title} size="3" className="hover:shadow-xl transition-all hover:-translate-y-1">
                  <Flex direction="column" gap="4">
                    <Flex align="center" gap="3">
                      <Box className={`p-2 bg-gradient-to-br from-${feature.color}-100 to-${feature.color}-200 rounded-lg`}>
                        <feature.icon className={`h-6 w-6 text-${feature.color}-600`} />
                      </Box>
                      <Heading size="4">{feature.title}</Heading>
                    </Flex>
                    <Text size="3" color="gray" className="leading-relaxed">
                      {feature.description}
                    </Text>
                    <Button variant="ghost" size="2">
                      Learn more
                      <ArrowRight className="ml-2 h-3 w-3" />
                    </Button>
                  </Flex>
                </Card>
              ))}
            </Grid>
          </Flex>
        </Container>
      </Section>

      {/* Rope Visualization Demo */}
      <Section size="4">
        <Container size="4">
          <Grid columns={{ initial: '1', lg: '2' }} gap="9" align="center">
            <Flex direction="column" gap="6">
              <Badge size="2" variant="surface" color="purple">
                <Layers className="h-3 w-3 mr-1" />
                Unique Visualization
              </Badge>
              <Heading size="7">
                Watch Your Habits Strengthen Like a Rope
              </Heading>
              <Text size="4" color="gray" className="leading-relaxed">
                Our unique rope metaphor shows your habit strength visually. Start with a thin thread 
                that grows into string, then cord, rope, and finally an unbreakable steel cable.
              </Text>
              
              <Grid columns="2" gap="4">
                <Card>
                  <Flex direction="column" gap="2">
                    <Text size="2" weight="bold">Day 1-7</Text>
                    <Text size="2" color="gray">Thread - Fragile beginning</Text>
                  </Flex>
                </Card>
                <Card>
                  <Flex direction="column" gap="2">
                    <Text size="2" weight="bold">Day 8-21</Text>
                    <Text size="2" color="gray">String - Getting stronger</Text>
                  </Flex>
                </Card>
                <Card>
                  <Flex direction="column" gap="2">
                    <Text size="2" weight="bold">Day 22-45</Text>
                    <Text size="2" color="gray">Cord - Solid foundation</Text>
                  </Flex>
                </Card>
                <Card>
                  <Flex direction="column" gap="2">
                    <Text size="2" weight="bold">Day 90+</Text>
                    <Text size="2" color="gray">Steel Cable - Unbreakable</Text>
                  </Flex>
                </Card>
              </Grid>

              <Button size="3">
                See Live Demo
                <PlayCircle className="ml-2 h-4 w-4" />
              </Button>
            </Flex>

            <Card size="4" className="bg-gradient-to-br from-blue-50 to-purple-50">
              <Flex align="center" justify="center" minHeight="400px">
                <Box className="text-center">
                  <Layers className="h-24 w-24 text-blue-600 mx-auto mb-4" />
                  <Text size="3" color="gray">Interactive rope visualization appears here</Text>
                </Box>
              </Flex>
            </Card>
          </Grid>
        </Container>
      </Section>

      {/* Testimonials */}
      <Section size="4" className="bg-gradient-to-b from-white to-blue-50">
        <Container size="4">
          <Flex direction="column" gap="8">
            <Flex direction="column" align="center" gap="4">
              <Badge size="2" variant="surface" color="orange">
                <MessageSquare className="h-3 w-3 mr-1" />
                Success Stories
              </Badge>
              <Heading size="8" align="center">
                Join Thousands Building Better Lives
              </Heading>
            </Flex>

            <Grid columns={{ initial: '1', md: '3' }} gap="6">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.name} size="3">
                  <Flex direction="column" gap="4">
                    <Flex gap="1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </Flex>
                    <Text size="3" className="leading-relaxed">
                      "{testimonial.content}"
                    </Text>
                    <Separator size="4" />
                    <Flex justify="between" align="center">
                      <Box>
                        <Text weight="bold">{testimonial.name}</Text>
                        <Text size="2" color="gray">{testimonial.role}</Text>
                      </Box>
                      <Badge color="green" variant="soft">
                        <Trophy className="h-3 w-3 mr-1" />
                        {testimonial.streak} days
                      </Badge>
                    </Flex>
                  </Flex>
                </Card>
              ))}
            </Grid>
          </Flex>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section size="4">
        <Container size="3">
          <Card size="4" className="bg-gradient-to-r from-blue-600 to-purple-600">
            <Flex direction="column" align="center" gap="6" py="6">
              <Badge size="2" variant="solid" className="bg-white/20 text-white">
                <Rocket className="h-3 w-3 mr-1" />
                Start Today
              </Badge>
              <Heading size="8" className="text-white text-center">
                Your Journey to Better Habits Starts Now
              </Heading>
              <Text size="4" className="text-white/90 text-center max-w-2xl">
                Join 50,000+ people who are building lasting habits with science-backed methods. 
                Free to start, powerful features when you need them.
              </Text>
              <Flex gap="4" align="center">
                <Button size="4" variant="solid" className="bg-white text-blue-600 hover:bg-gray-100">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="4" variant="outline" className="text-white border-white/30 hover:bg-white/10">
                  Learn More
                </Button>
              </Flex>
              <Flex gap="6" className="text-white/80">
                <Flex align="center" gap="2">
                  <CheckCircle className="h-4 w-4" />
                  <Text size="2">No credit card required</Text>
                </Flex>
                <Flex align="center" gap="2">
                  <CheckCircle className="h-4 w-4" />
                  <Text size="2">3 habits free forever</Text>
                </Flex>
                <Flex align="center" gap="2">
                  <CheckCircle className="h-4 w-4" />
                  <Text size="2">Cancel anytime</Text>
                </Flex>
              </Flex>
            </Flex>
          </Card>
        </Container>
      </Section>

      {/* Footer */}
      <Box className="border-t bg-gray-50" py="9">
        <Container size="4">
          <Grid columns={{ initial: '1', sm: '2', lg: '4' }} gap="8">
            <Flex direction="column" gap="4">
              <Flex align="center" gap="2">
                <Box className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                  <Layers className="h-5 w-5 text-white" />
                </Box>
                <Text size="4" weight="bold">HabitForge</Text>
              </Flex>
              <Text size="2" color="gray">
                Building better habits through science and community.
              </Text>
            </Flex>

            <Flex direction="column" gap="3">
              <Text size="3" weight="bold">Product</Text>
              <Flex direction="column" gap="2">
                <Text size="2" color="gray" className="hover:text-blue-600 cursor-pointer">Features</Text>
                <Text size="2" color="gray" className="hover:text-blue-600 cursor-pointer">Pricing</Text>
                <Text size="2" color="gray" className="hover:text-blue-600 cursor-pointer">Science</Text>
                <Text size="2" color="gray" className="hover:text-blue-600 cursor-pointer">Success Stories</Text>
              </Flex>
            </Flex>

            <Flex direction="column" gap="3">
              <Text size="3" weight="bold">Company</Text>
              <Flex direction="column" gap="2">
                <Text size="2" color="gray" className="hover:text-blue-600 cursor-pointer">About</Text>
                <Text size="2" color="gray" className="hover:text-blue-600 cursor-pointer">Blog</Text>
                <Text size="2" color="gray" className="hover:text-blue-600 cursor-pointer">Careers</Text>
                <Text size="2" color="gray" className="hover:text-blue-600 cursor-pointer">Contact</Text>
              </Flex>
            </Flex>

            <Flex direction="column" gap="3">
              <Text size="3" weight="bold">Legal</Text>
              <Flex direction="column" gap="2">
                <Text size="2" color="gray" className="hover:text-blue-600 cursor-pointer">Privacy</Text>
                <Text size="2" color="gray" className="hover:text-blue-600 cursor-pointer">Terms</Text>
                <Text size="2" color="gray" className="hover:text-blue-600 cursor-pointer">Security</Text>
                <Text size="2" color="gray" className="hover:text-blue-600 cursor-pointer">GDPR</Text>
              </Flex>
            </Flex>
          </Grid>

          <Separator size="4" my="6" />

          <Flex justify="between" align="center">
            <Text size="2" color="gray">
              © 2024 HabitForge. All rights reserved.
            </Text>
            <Flex gap="4">
              <Text size="2" color="gray" className="hover:text-blue-600 cursor-pointer">
                Twitter
              </Text>
              <Text size="2" color="gray" className="hover:text-blue-600 cursor-pointer">
                LinkedIn
              </Text>
              <Text size="2" color="gray" className="hover:text-blue-600 cursor-pointer">
                GitHub
              </Text>
            </Flex>
          </Flex>
        </Container>
      </Box>
    </Box>
  );
}