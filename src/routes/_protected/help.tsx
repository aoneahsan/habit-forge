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
import { Button } from '@/components/ui/button';
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
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Help Center</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Everything you need to know about HabitForge
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="card p-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-900/20">
            <Zap className="h-6 w-6 text-primary-600 dark:text-primary-400" />
          </div>
          <h3 className="font-semibold">Quick Start</h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Get up and running in 5 minutes
          </p>
          <Button size="2" className="mt-3">
            Start Tour
          </Button>
        </div>

        <div className="card p-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/20">
            <Book className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="font-semibold">User Guide</h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Detailed documentation
          </p>
          <Button size="2" variant="outline" className="mt-3">
            Read Docs
          </Button>
        </div>

        <div className="card p-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/20">
            <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="font-semibold">Privacy</h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Your data is safe with us
          </p>
          <Button size="2" variant="outline" className="mt-3">
            Learn More
          </Button>
        </div>
      </div>

      {/* FAQs */}
      <div className="card">
        <div className="border-b border-gray-200 p-6 dark:border-gray-700">
          <h2 className="text-xl font-semibold">Frequently Asked Questions</h2>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {faqs.map((faq) => (
            <div key={faq.id} className="p-6">
              <button
                onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                className="flex w-full items-center justify-between text-left"
              >
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {faq.question}
                </h3>
                <ChevronRight
                  className={`h-5 w-5 text-gray-400 transition-transform ${
                    expandedFaq === faq.id ? 'rotate-90' : ''
                  }`}
                />
              </button>
              {expandedFaq === faq.id && (
                <p className="mt-3 text-gray-600 dark:text-gray-400">
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Resources */}
      <div>
        <h2 className="mb-4 text-xl font-semibold">Resources</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {resources.map((resource) => {
            const Icon = resource.icon;
            return (
              <a
                key={resource.title}
                href={resource.link}
                className="card flex items-center space-x-4 p-4 transition-shadow hover:shadow-md"
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                  <Icon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {resource.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {resource.description}
                  </p>
                </div>
              </a>
            );
          })}
        </div>
      </div>

      {/* Contact Support */}
      <div className="card p-6">
        <h2 className="mb-6 text-xl font-semibold">Contact Support</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {contactOptions.map((option) => {
            const Icon = option.icon;
            return (
              <div key={option.title} className="text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                  <Icon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                </div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {option.title}
                </h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  {option.description}
                </p>
                <Button size="2" variant="outline" className="mt-3">
                  {option.action}
                </Button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Feedback */}
      <div className="rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 p-8 text-center text-white">
        <HelpCircle className="mx-auto mb-4 h-12 w-12" />
        <h2 className="mb-2 text-2xl font-bold">Still need help?</h2>
        <p className="mb-6 opacity-90">
          Our support team is here to help you succeed with your habits
        </p>
        <div className="flex justify-center space-x-4">
          <Button variant="soft">
            Contact Support
          </Button>
          <Button variant="outline" className="border-white text-white hover:bg-white/10">
            Send Feedback
          </Button>
        </div>
      </div>
    </div>
  );
}