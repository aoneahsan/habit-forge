import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAuthStore } from '@/stores/authStore';
import { 
  Box, Button, Card, Container, Flex, Grid, Heading, Text, 
  TextField, Switch, Section, Separator, Badge, Avatar, Select
} from '@radix-ui/themes';
import { 
  ArrowLeft, Bell, Shield, Palette, 
  Upload, Key, Download, Trash2, Lock
} from 'lucide-react';
import toast from 'react-hot-toast';

export function SettingsPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(false);
  const [profileVisibility, setProfileVisibility] = useState('public');
  const [theme, setTheme] = useState('system');
  const [language, setLanguage] = useState('en');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSaveChanges = () => {
    toast.success('✅ Settings saved successfully!');
    toast('Your preferences have been updated.', {
      duration: 3000,
      icon: '💾'
    });
  };

  const handleUploadPhoto = () => {
    toast('📸 Photo upload dialog opening...');
    // In a real app, this would open a file picker
    toast('Select an image from your device', {
      duration: 3000,
      icon: '🖼️'
    });
  };

  const handleChangePassword = () => {
    toast('🔐 Password change email sent!');
    toast('Check your email for the password reset link.', {
      duration: 5000,
      icon: '📧'
    });
  };

  const handleEnableTwoFactor = () => {
    toast.success('🔐 Two-factor authentication enabled!');
    toast('Your account is now more secure. Set up your authenticator app.', {
      duration: 5000,
      icon: '✨'
    });
  };

  const handleExportData = () => {
    toast.loading('Preparing your data export...', { duration: 2000 });
    setTimeout(() => {
      toast.success('📦 Data export ready for download!');
      toast('Your data has been compiled into a ZIP file.', {
        duration: 4000,
        icon: '💾'
      });
    }, 2000);
  };

  const handleDeleteAccount = () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      toast.error('⚠️ This action cannot be undone!');
      toast('Click again to confirm account deletion.', {
        duration: 5000,
        icon: '🚨'
      });
      setTimeout(() => setShowDeleteConfirm(false), 10000);
    } else {
      toast.error('Account deletion initiated. We\'re sorry to see you go!');
      // In a real app, this would delete the account
    }
  };

  return (
    <Container size="3" py="6">
      <Flex align="center" gap="4" mb="6">
        <Button variant="ghost" size="2" onClick={() => navigate({ to: '/dashboard' })}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Heading size="7">Settings</Heading>
      </Flex>

      {/* Profile Settings */}
      <Section size="1" mb="6">
        <Card>
          <Flex justify="between" align="start" mb="4">
            <Heading size="4">Profile Settings</Heading>
            <Badge color="green" variant="soft">Active</Badge>
          </Flex>
          
          <Grid columns={{ initial: '1', md: '2' }} gap="4" mb="4">
            <Box>
              <Text size="2" weight="medium" mb="2">Profile Photo</Text>
              <Flex align="center" gap="4">
                <Avatar 
                  size="5" 
                  fallback={user?.displayName?.[0] || 'U'} 
                  className="cursor-pointer"
                />
                <Button size="2" variant="outline" onClick={handleUploadPhoto}>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Photo
                </Button>
              </Flex>
            </Box>
            
            <Box>
              <Text size="2" weight="medium" mb="2">Display Name</Text>
              <TextField.Root 
                defaultValue={user?.displayName || ''} 
                placeholder="Your name"
              />
            </Box>
            
            <Box>
              <Text size="2" weight="medium" mb="2">Email</Text>
              <TextField.Root 
                defaultValue={user?.email || ''} 
                disabled
              />
            </Box>
            
            <Box>
              <Text size="2" weight="medium" mb="2">Phone</Text>
              <TextField.Root 
                placeholder="+1 (555) 000-0000"
              />
            </Box>
            
            <Box>
              <Text size="2" weight="medium" mb="2">Location</Text>
              <TextField.Root 
                placeholder="City, Country"
              />
            </Box>
            
            <Box>
              <Text size="2" weight="medium" mb="2">Timezone</Text>
              <Select.Root defaultValue="utc-5">
                <Select.Trigger className="w-full" />
                <Select.Content>
                  <Select.Item value="utc-5">UTC-5 (Eastern)</Select.Item>
                  <Select.Item value="utc-6">UTC-6 (Central)</Select.Item>
                  <Select.Item value="utc-7">UTC-7 (Mountain)</Select.Item>
                  <Select.Item value="utc-8">UTC-8 (Pacific)</Select.Item>
                </Select.Content>
              </Select.Root>
            </Box>
          </Grid>
          
          <Button onClick={handleSaveChanges}>Save Changes</Button>
        </Card>
      </Section>

      {/* Notification Preferences */}
      <Section size="1" mb="6">
        <Card>
          <Heading size="4" mb="4">
            <Bell className="inline-block h-5 w-5 mr-2" />
            Notification Preferences
          </Heading>
          
          <Flex direction="column" gap="4">
            <Flex justify="between" align="center">
              <Box>
                <Text weight="medium">Email Notifications</Text>
                <Text size="2" color="gray">Receive habit reminders via email</Text>
              </Box>
              <Switch 
                checked={emailNotifications} 
                onCheckedChange={(checked) => {
                  setEmailNotifications(checked);
                  toast(checked ? '📧 Email notifications enabled' : '📧 Email notifications disabled');
                }}
              />
            </Flex>
            
            <Separator size="4" />
            
            <Flex justify="between" align="center">
              <Box>
                <Text weight="medium">Push Notifications</Text>
                <Text size="2" color="gray">Get real-time updates on your device</Text>
              </Box>
              <Switch 
                checked={pushNotifications} 
                onCheckedChange={(checked) => {
                  setPushNotifications(checked);
                  toast(checked ? '🔔 Push notifications enabled' : '🔕 Push notifications disabled');
                }}
              />
            </Flex>
            
            <Separator size="4" />
            
            <Flex justify="between" align="center">
              <Box>
                <Text weight="medium">Weekly Progress Reports</Text>
                <Text size="2" color="gray">Summary of your habit performance</Text>
              </Box>
              <Switch 
                checked={weeklyReports} 
                onCheckedChange={(checked) => {
                  setWeeklyReports(checked);
                  toast(checked ? '📊 Weekly reports enabled' : '📊 Weekly reports disabled');
                }}
              />
            </Flex>
          </Flex>
        </Card>
      </Section>

      {/* Privacy & Security */}
      <Section size="1" mb="6">
        <Card>
          <Heading size="4" mb="4">
            <Shield className="inline-block h-5 w-5 mr-2" />
            Privacy & Security
          </Heading>
          
          <Grid columns={{ initial: '1', md: '2' }} gap="4" mb="4">
            <Box>
              <Text size="2" weight="medium" mb="2">Profile Visibility</Text>
              <Select.Root value={profileVisibility} onValueChange={(value) => {
                setProfileVisibility(value);
                toast(`👤 Profile visibility set to ${value}`);
              }}>
                <Select.Trigger className="w-full" />
                <Select.Content>
                  <Select.Item value="public">Public</Select.Item>
                  <Select.Item value="friends">Friends Only</Select.Item>
                  <Select.Item value="private">Private</Select.Item>
                </Select.Content>
              </Select.Root>
            </Box>
            
            <Box>
              <Text size="2" weight="medium" mb="2">Data Sharing</Text>
              <Select.Root defaultValue="minimal" onValueChange={(value) => {
                toast(`🔒 Data sharing set to ${value}`);
              }}>
                <Select.Trigger className="w-full" />
                <Select.Content>
                  <Select.Item value="full">Full Analytics</Select.Item>
                  <Select.Item value="minimal">Minimal</Select.Item>
                  <Select.Item value="none">None</Select.Item>
                </Select.Content>
              </Select.Root>
            </Box>
          </Grid>
          
          <Flex gap="3" wrap="wrap">
            <Button variant="outline" onClick={handleChangePassword}>
              <Key className="mr-2 h-4 w-4" />
              Change Password
            </Button>
            <Button variant="outline" onClick={handleEnableTwoFactor}>
              <Lock className="mr-2 h-4 w-4" />
              Enable Two-Factor
            </Button>
          </Flex>
        </Card>
      </Section>

      {/* Appearance */}
      <Section size="1" mb="6">
        <Card>
          <Heading size="4" mb="4">
            <Palette className="inline-block h-5 w-5 mr-2" />
            Appearance
          </Heading>
          
          <Grid columns={{ initial: '1', md: '2' }} gap="4">
            <Box>
              <Text size="2" weight="medium" mb="2">Theme</Text>
              <Select.Root value={theme} onValueChange={(value) => {
                setTheme(value);
                toast(`🎨 Theme changed to ${value}`);
              }}>
                <Select.Trigger className="w-full" />
                <Select.Content>
                  <Select.Item value="light">Light</Select.Item>
                  <Select.Item value="dark">Dark</Select.Item>
                  <Select.Item value="system">System</Select.Item>
                </Select.Content>
              </Select.Root>
            </Box>
            
            <Box>
              <Text size="2" weight="medium" mb="2">Language</Text>
              <Select.Root value={language} onValueChange={(value) => {
                setLanguage(value);
                toast(`🌍 Language changed to ${value}`);
              }}>
                <Select.Trigger className="w-full" />
                <Select.Content>
                  <Select.Item value="en">English</Select.Item>
                  <Select.Item value="es">Español</Select.Item>
                  <Select.Item value="fr">Français</Select.Item>
                  <Select.Item value="de">Deutsch</Select.Item>
                </Select.Content>
              </Select.Root>
            </Box>
          </Grid>
        </Card>
      </Section>

      {/* Data Management */}
      <Section size="1">
        <Card>
          <Heading size="4" mb="4" color="red">
            Danger Zone
          </Heading>
          
          <Flex direction="column" gap="3">
            <Button variant="outline" onClick={handleExportData}>
              <Download className="mr-2 h-4 w-4" />
              Export My Data
            </Button>
            
            <Button 
              variant="outline" 
              color="red" 
              onClick={handleDeleteAccount}
              className={showDeleteConfirm ? 'ring-2 ring-red-500' : ''}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {showDeleteConfirm ? 'Click Again to Confirm Deletion' : 'Delete Account'}
            </Button>
          </Flex>
        </Card>
      </Section>
    </Container>
  );
}