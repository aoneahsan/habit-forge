import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { updateUserEmail, updateUserPassword } from '@/services/firebase/auth.service';
import { updateUserProfile } from '@/services/firebase/user.service';
import { Button, TextField, Box, Flex, Container, Card, Text, Heading, Grid, Select, Switch, Tabs, TextArea } from '@radix-ui/themes';
import { toast } from 'sonner';
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Smartphone,
  CreditCard,
  HelpCircle,
  LogOut,
  Save
} from 'lucide-react';

export const Route = createFileRoute('/_protected/settings')({
  component: SettingsPage,
});

function SettingsPage() {
  const user = useAuthStore((state) => state.user);
  const userProfile = useAuthStore((state) => state.userProfile);
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy & Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'language', label: 'Language & Region', icon: Globe },
    { id: 'mobile', label: 'Mobile App', icon: Smartphone },
    { id: 'subscription', label: 'Subscription', icon: CreditCard },
    { id: 'help', label: 'Help & Support', icon: HelpCircle },
  ];

  return (
    <Container size="4">
      <Flex direction="column" gap="6">
        {/* Header */}
        <Box>
          <Heading size="8">Settings</Heading>
          <Text color="gray" mt="1">
            Manage your account and preferences
          </Text>
        </Box>

        <Grid columns={{ initial: '1', lg: '260px 1fr' }} gap="6">
          {/* Sidebar */}
          <Box>
            <Flex direction="column" gap="1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <Button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    variant={activeTab === tab.id ? 'soft' : 'ghost'}
                    style={{
                      justifyContent: 'flex-start',
                      width: '100%',
                    }}
                  >
                    <Icon size={20} style={{ marginRight: '12px' }} />
                    <Text>{tab.label}</Text>
                  </Button>
                );
              })}
            </Flex>
          </Box>

          {/* Content */}
          <Box>
            {activeTab === 'profile' && <ProfileSettings />}
            {activeTab === 'notifications' && <NotificationSettings />}
            {activeTab === 'privacy' && <PrivacySettings />}
            {activeTab === 'appearance' && <AppearanceSettings />}
            {activeTab === 'language' && <LanguageSettings />}
            {activeTab === 'mobile' && <MobileSettings />}
            {activeTab === 'subscription' && <SubscriptionSettings />}
            {activeTab === 'help' && <HelpSettings />}
          </Box>
        </Grid>
      </Flex>
    </Container>
  );
}

function ProfileSettings() {
  const user = useAuthStore((state) => state.user);
  const userProfile = useAuthStore((state) => state.userProfile);
  const [displayName, setDisplayName] = useState(userProfile?.displayName || '');
  const [bio, setBio] = useState(userProfile?.bio || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (user?.uid && userProfile) {
        await updateUserProfile(user.uid, { displayName, bio });
      }
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Flex direction="column" gap="6">
      <Card size="3">
        <Heading size="5" mb="4">Profile Information</Heading>
        
        <Flex direction="column" gap="4">
          <Box>
            <Text as="label" size="2" weight="medium" color="gray">
              Display Name
            </Text>
            <TextField.Root
              value={displayName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDisplayName(e.target.value)}
              mt="1"
              placeholder="Your name"
            />
          </Box>

          <Box>
            <Text as="label" size="2" weight="medium" color="gray">
              Email
            </Text>
            <TextField.Root
              value={user?.email || ''}
              disabled
              mt="1"
            />
            <Text size="1" color="gray" mt="1">Contact support to change your email</Text>
          </Box>

          <Box>
            <Text as="label" size="2" weight="medium" color="gray">
              Bio
            </Text>
            <TextArea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              mt="1"
              size="2"
              style={{ minHeight: '80px' }}
              placeholder="Tell us about yourself"
            />
          </Box>

          <Box>
            <Text as="label" size="2" weight="medium" color="gray">
              Member Since
            </Text>
            <Text size="2" color="gray" mt="1">
              {userProfile?.createdAt ? new Date(userProfile.createdAt).toLocaleDateString() : 'N/A'}
            </Text>
          </Box>
        </Flex>

        <Flex justify="end" mt="6">
          <Button onClick={handleSave} disabled={isSaving}>
            <Save size={16} style={{ marginRight: '8px' }} />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </Flex>
      </Card>

      <Card size="3">
        <Heading size="5" color="red" mb="4">Danger Zone</Heading>
        <Text size="2" color="gray" mb="4">
          These actions are irreversible. Please be certain.
        </Text>
        <Flex direction="column" gap="3">
          <Button variant="outline" style={{ width: '100%', justifyContent: 'flex-start' }}>
            Export My Data
          </Button>
          <Button color="red" style={{ width: '100%', justifyContent: 'flex-start' }}>
            Delete Account
          </Button>
        </Flex>
      </Card>
    </Flex>
  );
}

function NotificationSettings() {
  const userProfile = useAuthStore((state) => state.userProfile);
  const [notifications, setNotifications] = useState({
    email: userProfile?.preferences?.notifications?.email ?? true,
    push: userProfile?.preferences?.notifications?.push ?? true,
    reminders: userProfile?.preferences?.notifications?.reminders ?? true,
  });

  return (
    <div className="card p-6">
      <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Notification Preferences</h2>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900 dark:text-white">Email Notifications</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Receive updates and reminders via email
            </p>
          </div>
          <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              checked={notifications.email}
              onChange={(e) => setNotifications({ ...notifications, email: e.target.checked })}
              className="peer sr-only"
            />
            <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none dark:bg-gray-700"></div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900 dark:text-white">Push Notifications</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Get instant updates on your device
            </p>
          </div>
          <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              checked={notifications.push}
              onChange={(e) => setNotifications({ ...notifications, push: e.target.checked })}
              className="peer sr-only"
            />
            <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none dark:bg-gray-700"></div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900 dark:text-white">Habit Reminders</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Daily reminders to complete your habits
            </p>
          </div>
          <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              checked={notifications.reminders}
              onChange={(e) => setNotifications({ ...notifications, reminders: e.target.checked })}
              className="peer sr-only"
            />
            <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none dark:bg-gray-700"></div>
          </label>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button>Save Preferences</Button>
      </div>
    </div>
  );
}

function PrivacySettings() {
  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Privacy Settings</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Profile Visibility</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Control who can see your profile
              </p>
            </div>
            <select className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100">
              <option>Public</option>
              <option>Friends Only</option>
              <option>Private</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Show Stats</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Display your statistics publicly
              </p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input type="checkbox" className="peer sr-only" defaultChecked />
              <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none dark:bg-gray-700"></div>
            </label>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Security</h2>
        
        <div className="space-y-4">
          <Button variant="outline" className="w-full justify-start">
            Change Password
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Enable Two-Factor Authentication
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Manage Sessions
          </Button>
        </div>
      </div>
    </div>
  );
}

function AppearanceSettings() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'system');

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else if (newTheme === 'light') {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      localStorage.removeItem('theme');
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    toast.success('Theme updated');
  };

  return (
    <div className="card p-6">
      <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Appearance</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Theme
          </label>
          <div className="mt-2 grid grid-cols-3 gap-3">
            {['light', 'dark', 'system'].map((t) => (
              <button
                key={t}
                onClick={() => handleThemeChange(t)}
                className={`rounded-lg border-2 p-3 text-sm font-medium capitalize transition-colors ${
                  theme === t
                    ? 'border-primary-500 bg-primary-50 text-primary-600 dark:bg-primary-900/20'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Accent Color
          </label>
          <div className="mt-2 flex space-x-3">
            {['green', 'blue', 'purple', 'pink', 'orange'].map((color) => (
              <button
                key={color}
                className={`h-10 w-10 rounded-full bg-${color}-500 ring-2 ring-offset-2 hover:ring-${color}-600`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function LanguageSettings() {
  return (
    <div className="card p-6">
      <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Language & Region</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Language
          </label>
          <select className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100">
            <option>English (US)</option>
            <option>Spanish</option>
            <option>French</option>
            <option>German</option>
            <option>Japanese</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Time Zone
          </label>
          <select className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100">
            <option>UTC-08:00 Pacific Time</option>
            <option>UTC-05:00 Eastern Time</option>
            <option>UTC+00:00 GMT</option>
            <option>UTC+01:00 Central European Time</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Date Format
          </label>
          <select className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100">
            <option>MM/DD/YYYY</option>
            <option>DD/MM/YYYY</option>
            <option>YYYY-MM-DD</option>
          </select>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button>Save Preferences</Button>
      </div>
    </div>
  );
}

function MobileSettings() {
  return (
    <div className="card p-6">
      <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Mobile App Settings</h2>
      
      <div className="space-y-4">
        <div className="rounded-lg bg-primary-50 p-4 dark:bg-primary-900/20">
          <p className="text-sm text-primary-900 dark:text-primary-100">
            Download the HabitForge mobile app to track your habits on the go!
          </p>
          <div className="mt-3 flex space-x-3">
            <Button size="2">Download for iOS</Button>
            <Button size="2" variant="outline">Download for Android</Button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Sync with Mobile</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Automatically sync data between devices
              </p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input type="checkbox" className="peer sr-only" defaultChecked />
              <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none dark:bg-gray-700"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Offline Mode</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Enable offline tracking on mobile
              </p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input type="checkbox" className="peer sr-only" defaultChecked />
              <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none dark:bg-gray-700"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

function SubscriptionSettings() {
  const userProfile = useAuthStore((state) => state.userProfile);
  
  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Current Plan</h2>
        
        <div className="rounded-lg border border-primary-200 bg-primary-50 p-4 dark:border-primary-800 dark:bg-primary-900/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-semibold text-primary-900 dark:text-primary-100">
                {userProfile?.subscription?.plan === 'free' ? 'Free Plan' : 'Premium Plan'}
              </p>
              <p className="text-sm text-primary-700 dark:text-primary-300">
                {userProfile?.subscription?.plan === 'free' 
                  ? 'Basic features with limited habits'
                  : 'Unlimited habits and advanced features'}
              </p>
            </div>
            {userProfile?.subscription?.plan === 'free' && (
              <Button>Upgrade to Premium</Button>
            )}
          </div>
        </div>

        <div className="mt-6">
          <h3 className="mb-3 font-medium">Plan Features</h3>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li className="flex items-center">
              <span className="mr-2">✓</span>
              {userProfile?.subscription?.plan === 'free' ? 'Up to 5 habits' : 'Unlimited habits'}
            </li>
            <li className="flex items-center">
              <span className="mr-2">✓</span>
              Basic analytics
            </li>
            <li className="flex items-center">
              <span className="mr-2">✓</span>
              Daily reminders
            </li>
            {userProfile?.subscription?.plan === 'premium' && (
              <>
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  Advanced analytics
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  Priority support
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  Custom themes
                </li>
              </>
            )}
          </ul>
        </div>
      </div>

      {userProfile?.subscription?.plan === 'premium' && (
        <div className="card p-6">
          <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Billing</h2>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Next billing date</span>
              <span className="font-medium">January 1, 2025</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Amount</span>
              <span className="font-medium">$9.99/month</span>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <Button variant="outline" className="w-full">Update Payment Method</Button>
            <Button variant="outline" className="w-full">View Billing History</Button>
            <Button color="red" className="w-full">Cancel Subscription</Button>
          </div>
        </div>
      )}
    </div>
  );
}

function HelpSettings() {
  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Help & Support</h2>
        
        <div className="space-y-3">
          <Button variant="outline" className="w-full justify-start">
            <HelpCircle className="mr-2 h-4 w-4" />
            Help Center
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Contact Support
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Report a Bug
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Request a Feature
          </Button>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Resources</h2>
        
        <div className="space-y-3">
          <a href="#" className="block text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400">
            Getting Started Guide
          </a>
          <a href="#" className="block text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400">
            API Documentation
          </a>
          <a href="#" className="block text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400">
            Community Forum
          </a>
          <a href="#" className="block text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400">
            Blog
          </a>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Legal</h2>
        
        <div className="space-y-3">
          <a href="#" className="block text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400">
            Terms of Service
          </a>
          <a href="#" className="block text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400">
            Privacy Policy
          </a>
          <a href="#" className="block text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400">
            Cookie Policy
          </a>
        </div>
      </div>
    </div>
  );
}