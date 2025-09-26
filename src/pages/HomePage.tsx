import { useNavigate } from '@tanstack/react-router';
import { useAuthStore } from '@/stores/authStore';
import { Box, Button, Container, Flex, Grid, Heading, Text, Card, Section, Badge, Separator } from '@radix-ui/themes';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
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
  const [demoModalOpen, setDemoModalOpen] = useState(false);

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
              <Button size="4" variant="outline" onClick={() => {
                toast.success('Demo video coming soon! For now, explore our features below.');
                // Scroll to features section
                document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' });
              }}>
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
                <Button onClick={() => {
                  toast.info('Opening detailed five-factor guide...');
                  // Scroll to testimonials to show real examples
                  document.getElementById('testimonials-section')?.scrollIntoView({ behavior: 'smooth' });
                }}>
                  Learn More
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Flex>
            </Card>
          </Flex>
        </Container>
      </Section>

      {/* Features Grid */}
      <Section size="4" className="bg-gray-50" id="features-section">
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
                    <Button variant="ghost" size="2" onClick={() => {
                      toast.info(`Learn more about ${feature.title}`);
                      // In a real app, this would navigate to detailed feature pages
                      navigate({ to: '/signup' });
                    }}>
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

              <Button size="3" onClick={() => {
                toast.success('Interactive rope visualization demo coming soon!');
                toast('Imagine your habit growing stronger each day, from a thin thread to an unbreakable cable!', {
                  duration: 5000,
                  icon: '🪢'
                });
              }}>
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
      <Section size="4" className="bg-gradient-to-b from-white to-blue-50" id="testimonials-section">
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
                <Button size="4" variant="solid" className="bg-white text-blue-600 hover:bg-gray-100" onClick={() => {
                  navigate({ to: '/signup' });
                }}>
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="4" variant="outline" className="text-white border-white/30 hover:bg-white/10" onClick={() => {
                  toast.info('Discover our pricing plans and premium features!');
                  // Scroll to features section
                  document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' });
                }}>
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
                <Text size="2" color="gray" className="hover:text-blue-600 cursor-pointer" onClick={() => {
                  document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' });
                }}>Features</Text>
                <Text size="2" color="gray" className="hover:text-blue-600 cursor-pointer" onClick={() => {
                  toast.info('Pricing page coming soon! Start with 3 habits free forever.');
                }}>Pricing</Text>
                <Text size="2" color="gray" className="hover:text-blue-600 cursor-pointer" onClick={() => {
                  toast.info('Learn about the science behind habit formation based on Charles Duhigg\'s research.');
                }}>Science</Text>
                <Text size="2" color="gray" className="hover:text-blue-600 cursor-pointer" onClick={() => {
                  document.getElementById('testimonials-section')?.scrollIntoView({ behavior: 'smooth' });
                }}>Success Stories</Text>
              </Flex>
            </Flex>

            <Flex direction="column" gap="3">
              <Text size="3" weight="bold">Company</Text>
              <Flex direction="column" gap="2">
                <Text size="2" color="gray" className="hover:text-blue-600 cursor-pointer" onClick={() => {
                  toast.info('About page coming soon! Learn more about our mission.');
                }}>About</Text>
                <Text size="2" color="gray" className="hover:text-blue-600 cursor-pointer" onClick={() => {
                  toast.info('Blog coming soon! Get tips and insights on habit building.');
                }}>Blog</Text>
                <Text size="2" color="gray" className="hover:text-blue-600 cursor-pointer" onClick={() => {
                  toast.info('We\'re hiring! Careers page coming soon.');
                }}>Careers</Text>
                <Text size="2" color="gray" className="hover:text-blue-600 cursor-pointer" onClick={() => {
                  toast.info('Contact us at support@habitforge.com');
                }}>Contact</Text>
              </Flex>
            </Flex>

            <Flex direction="column" gap="3">
              <Text size="3" weight="bold">Legal</Text>
              <Flex direction="column" gap="2">
                <Text size="2" color="gray" className="hover:text-blue-600 cursor-pointer" onClick={() => {
                  toast.info('Privacy Policy: We take your privacy seriously. Full policy coming soon.');
                }}>Privacy</Text>
                <Text size="2" color="gray" className="hover:text-blue-600 cursor-pointer" onClick={() => {
                  toast.info('Terms of Service: Fair and transparent terms. Full document coming soon.');
                }}>Terms</Text>
                <Text size="2" color="gray" className="hover:text-blue-600 cursor-pointer" onClick={() => {
                  toast.info('Security: End-to-end encryption and secure data storage.');
                }}>Security</Text>
                <Text size="2" color="gray" className="hover:text-blue-600 cursor-pointer" onClick={() => {
                  toast.info('GDPR Compliant: Your data rights are protected.');
                }}>GDPR</Text>
              </Flex>
            </Flex>
          </Grid>

          <Separator size="4" my="6" />

          <Flex justify="between" align="center">
            <Text size="2" color="gray">
              © 2024 HabitForge. All rights reserved.
            </Text>
            <Flex gap="4">
              <Text size="2" color="gray" className="hover:text-blue-600 cursor-pointer" onClick={() => {
                toast.info('Follow us on Twitter @habitforge');
                window.open('https://twitter.com', '_blank');
              }}>
                Twitter
              </Text>
              <Text size="2" color="gray" className="hover:text-blue-600 cursor-pointer" onClick={() => {
                toast.info('Connect with us on LinkedIn');
                window.open('https://linkedin.com', '_blank');
              }}>
                LinkedIn
              </Text>
              <Text size="2" color="gray" className="hover:text-blue-600 cursor-pointer" onClick={() => {
                toast.info('Check out our open source contributions');
                window.open('https://github.com', '_blank');
              }}>
                GitHub
              </Text>
            </Flex>
          </Flex>
        </Container>
      </Box>
    </Box>
  );
}