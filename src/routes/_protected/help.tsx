import { createFileRoute } from '@tanstack/react-router';
import { 
  HelpCircle, 
  Book, 
  MessageCircle, 
  Mail, 
  FileText,
  Video,
  Users,
  Shield,
  Zap,
  ChevronRight
} from 'lucide-react';
import { Button, Box, Flex, Container, Card, Text, Heading, Grid } from '@radix-ui/themes';
import { useState } from 'react';

export const Route = createFileRoute('/_protected/help')({
  component: HelpPage,
});

function HelpPage() {
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const faqs = [
    {
      id: '1',
      question: 'How do I create my first habit?',
      answer: 'To create your first habit, click the "New Habit" button in the sidebar or on the Habits page. Fill in the habit details including name, category, frequency, and target. You can also use the Five-Factor Model to better understand your habit loop.',
    },
    {
      id: '2',
      question: 'What is the rope visualization?',
      answer: 'The rope visualization is a unique feature that represents the strength of your habits. As you maintain streaks and complete habits consistently, your rope becomes stronger. A frayed rope indicates inconsistent habits, while an unbreakable rope shows excellent habit discipline.',
    },
    {
      id: '3',
      question: 'How do streaks work?',
      answer: 'Streaks track consecutive days of completing a habit. If you complete a habit today and tomorrow, you have a 2-day streak. Missing a day resets the streak to 0. Longer streaks earn more points and strengthen your rope.',
    },
    {
      id: '4',
      question: 'Can I use HabitForge offline?',
      answer: 'Yes! HabitForge works offline thanks to Progressive Web App technology. Your data is saved locally and will sync when you reconnect to the internet. You can also install the app on your phone for a native app experience.',
    },
    {
      id: '5',
      question: 'How do I join challenges?',
      answer: 'Go to the Community page and click on the Challenges tab. Browse available challenges and click "Join" on any challenge you want to participate in. Track your progress and compete with others!',
    },
    {
      id: '6',
      question: 'What are achievements?',
      answer: 'Achievements are rewards for reaching milestones in your habit journey. They include streak achievements, completion goals, and special challenges. Each achievement earns you points and badges to showcase your progress.',
    },
    {
      id: '7',
      question: 'How do I export my data?',
      answer: 'You can export your habit data from the Settings page. Go to Settings > Profile > Export My Data. Your data will be downloaded as a JSON file that you can import later or analyze elsewhere.',
    },
    {
      id: '8',
      question: 'Is my data secure?',
      answer: 'Yes, your data is secure. We use Firebase Authentication for secure login, encrypted connections for all data transfers, and strict privacy rules. You own your data and can delete it at any time from Settings.',
    },
  ];

  const resources = [
    {
      title: 'Getting Started Guide',
      description: 'Learn the basics of HabitForge',
      icon: Book,
      link: '#',
    },
    {
      title: 'Video Tutorials',
      description: 'Watch step-by-step tutorials',
      icon: Video,
      link: '#',
    },
    {
      title: 'Community Forum',
      description: 'Get help from other users',
      icon: Users,
      link: '#',
    },
    {
      title: 'API Documentation',
      description: 'For developers and integrations',
      icon: FileText,
      link: '#',
    },
  ];

  const contactOptions = [
    {
      title: 'Email Support',
      description: 'Get help via email within 24 hours',
      icon: Mail,
      action: 'support@habitforge.app',
    },
    {
      title: 'Live Chat',
      description: 'Chat with our support team',
      icon: MessageCircle,
      action: 'Start Chat',
    },
    {
      title: 'Community Forum',
      description: 'Ask the community',
      icon: Users,
      action: 'Visit Forum',
    },
  ];

  return (
    <Container size="3">
      <Flex direction="column" gap="8">
        {/* Header */}
        <Box style={{ textAlign: 'center' }}>
          <Heading size="8" mb="2">Help Center</Heading>
          <Text color="gray">
            Everything you need to know about HabitForge
          </Text>
        </Box>

        {/* Quick Actions */}
        <Grid columns={{ initial: '1', md: '3' }} gap="4">
          <Card size="3">
            <Flex direction="column" align="center" gap="3">
              <Flex
                width="48px"
                height="48px"
                align="center"
                justify="center"
                style={{
                  borderRadius: '8px',
                  backgroundColor: 'var(--teal-3)',
                }}
              >
                <Zap size={24} color="var(--teal-11)" />
              </Flex>
              <Heading size="4">Quick Start</Heading>
              <Text size="2" color="gray" align="center">
                Get up and running in 5 minutes
              </Text>
              <Button size="2">
                Start Tour
              </Button>
            </Flex>
          </Card>

          <Card size="3">
            <Flex direction="column" align="center" gap="3">
              <Flex
                width="48px"
                height="48px"
                align="center"
                justify="center"
                style={{
                  borderRadius: '8px',
                  backgroundColor: 'var(--blue-3)',
                }}
              >
                <Book size={24} color="var(--blue-11)" />
              </Flex>
              <Heading size="4">User Guide</Heading>
              <Text size="2" color="gray" align="center">
                Detailed documentation
              </Text>
              <Button size="2" variant="outline">
                Read Docs
              </Button>
            </Flex>
          </Card>

          <Card size="3">
            <Flex direction="column" align="center" gap="3">
              <Flex
                width="48px"
                height="48px"
                align="center"
                justify="center"
                style={{
                  borderRadius: '8px',
                  backgroundColor: 'var(--purple-3)',
                }}
              >
                <Shield size={24} color="var(--purple-11)" />
              </Flex>
              <Heading size="4">Privacy</Heading>
              <Text size="2" color="gray" align="center">
                Your data is safe with us
              </Text>
              <Button size="2" variant="outline">
                Learn More
              </Button>
            </Flex>
          </Card>
        </Grid>

        {/* FAQs */}
        <Card>
          <Box p="6" style={{ borderBottom: '1px solid var(--gray-6)' }}>
            <Heading size="5">Frequently Asked Questions</Heading>
          </Box>
          <Box>
            {faqs.map((faq, index) => (
              <Box
                key={faq.id}
                p="6"
                style={{
                  borderBottom: index < faqs.length - 1 ? '1px solid var(--gray-6)' : 'none',
                }}
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                  style={{
                    width: '100%',
                    border: 'none',
                    background: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <Flex justify="between" align="center">
                    <Text size="3" weight="medium">
                      {faq.question}
                    </Text>
                    <ChevronRight
                      size={20}
                      style={{
                        color: 'var(--gray-10)',
                        transform: expandedFaq === faq.id ? 'rotate(90deg)' : 'none',
                        transition: 'transform 0.2s',
                      }}
                    />
                  </Flex>
                </button>
                {expandedFaq === faq.id && (
                  <Box mt="3">
                    <Text color="gray">
                      {faq.answer}
                    </Text>
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        </Card>

        {/* Resources */}
        <Box>
          <Heading size="5" mb="4">Resources</Heading>
          <Grid columns={{ initial: '1', md: '2' }} gap="4">
            {resources.map((resource) => {
              const Icon = resource.icon;
              return (
                <a
                  key={resource.title}
                  href={resource.link}
                  style={{ textDecoration: 'none' }}
                >
                  <Card size="2" style={{ cursor: 'pointer' }}>
                    <Flex gap="4" align="center">
                      <Flex
                        width="40px"
                        height="40px"
                        align="center"
                        justify="center"
                        flexShrink="0"
                        style={{
                          borderRadius: '8px',
                          backgroundColor: 'var(--gray-3)',
                        }}
                      >
                        <Icon size={20} color="var(--gray-11)" />
                      </Flex>
                      <Box>
                        <Text weight="medium">
                          {resource.title}
                        </Text>
                        <Text size="2" color="gray">
                          {resource.description}
                        </Text>
                      </Box>
                    </Flex>
                  </Card>
                </a>
              );
            })}
          </Grid>
        </Box>

        {/* Contact Support */}
        <Card size="3">
          <Heading size="5" mb="6">Contact Support</Heading>
          <Grid columns={{ initial: '1', md: '3' }} gap="4">
            {contactOptions.map((option) => {
              const Icon = option.icon;
              return (
                <Flex key={option.title} direction="column" align="center" gap="3">
                  <Flex
                    width="48px"
                    height="48px"
                    align="center"
                    justify="center"
                    style={{
                      borderRadius: '8px',
                      backgroundColor: 'var(--gray-3)',
                    }}
                  >
                    <Icon size={24} color="var(--gray-11)" />
                  </Flex>
                  <Text weight="medium">
                    {option.title}
                  </Text>
                  <Text size="2" color="gray" align="center">
                    {option.description}
                  </Text>
                  <Button size="2" variant="outline">
                    {option.action}
                  </Button>
                </Flex>
              );
            })}
          </Grid>
        </Card>

        {/* Feedback */}
        <Box
          p="8"
          style={{
            borderRadius: '8px',
            background: 'linear-gradient(to right, var(--teal-9), var(--teal-10))',
            textAlign: 'center',
          }}
        >
          <Flex direction="column" align="center" gap="4">
            <HelpCircle size={48} color="white" />
            <Heading size="6" style={{ color: 'white' }}>
              Still need help?
            </Heading>
            <Text size="3" style={{ color: 'white', opacity: 0.9 }}>
              Our support team is here to help you succeed with your habits
            </Text>
            <Flex gap="4" justify="center">
              <Button variant="soft">
                Contact Support
              </Button>
              <Button
                variant="outline"
                style={{
                  borderColor: 'white',
                  color: 'white',
                }}
              >
                Send Feedback
              </Button>
            </Flex>
          </Flex>
        </Box>
      </Flex>
    </Container>
  );
}