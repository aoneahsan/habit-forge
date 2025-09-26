import { useState } from 'react';
import { useNavigate, Link } from '@tanstack/react-router';
import { useAuthStore } from '@/stores/authStore';
import { Box, Button, Card, Container, Flex, Heading, Text, TextField, Separator, Badge, Section, Dialog } from '@radix-ui/themes';
import { 
  LogIn, Mail, Lock, ArrowRight, Sparkles, Activity, 
  Target, TrendingUp, Users, Brain, Shield, CheckCircle,
  Layers, Eye, EyeOff, Chrome, Github, Twitter
} from 'lucide-react';
import toast from 'react-hot-toast';

export function LoginPage() {
  const navigate = useNavigate();
  const { signIn, sendResetEmail } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: typeof errors = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Invalid email format';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setErrors({});
    setLoading(true);

    try {
      await signIn(email, password);
      toast.success('Welcome back! Redirecting to your dashboard...');
      navigate({ to: '/dashboard' });
    } catch (error: any) {
      const errorMessage = error.code === 'auth/user-not-found' 
        ? 'No account found with this email' 
        : error.code === 'auth/wrong-password'
        ? 'Incorrect password'
        : error.code === 'auth/invalid-email'
        ? 'Invalid email address'
        : error.code === 'auth/user-disabled'
        ? 'This account has been disabled'
        : 'Failed to sign in. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    toast.error(`${provider} login coming soon!`);
  };

  const handleForgotPassword = async () => {
    const emailToReset = resetEmail || email;
    if (!emailToReset) {
      toast.error('Please enter your email address');
      return;
    }
    
    try {
      setLoading(true);
      await sendResetEmail(emailToReset);
      setShowResetDialog(false);
      setResetEmail('');
    } catch (error) {
      console.error('Failed to send reset email:', error);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: Target, text: 'Track unlimited habits' },
    { icon: Activity, text: 'Real-time progress visualization' },
    { icon: Users, text: 'Join community challenges' },
    { icon: Brain, text: 'AI-powered insights' },
    { icon: Shield, text: 'Your data is always secure' },
    { icon: TrendingUp, text: 'Build lasting change' }
  ];

  return (
    <Box className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation Bar */}
      <Box className="absolute top-0 left-0 right-0 z-10">
        <Container size="4">
          <Flex justify="between" align="center" py="4">
            <Flex align="center" gap="2" className="cursor-pointer" onClick={() => navigate({ to: '/' })}>
              <Box className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                <Layers className="h-5 w-5 text-white" />
              </Box>
              <Heading size="5" className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                HabitForge
              </Heading>
            </Flex>
            <Flex gap="3">
              <Button variant="ghost" onClick={() => navigate({ to: '/' })}>
                Home
              </Button>
              <Button variant="ghost" onClick={() => navigate({ to: '/signup' })}>
                Sign Up
              </Button>
            </Flex>
          </Flex>
        </Container>
      </Box>

      <Container size="4" className="min-h-screen flex items-center justify-center py-20">
        <Flex className="w-full max-w-6xl" gap="8" align="center">
          {/* Left Side - Login Form */}
          <Box className="flex-1 w-full">
            <Card size="4" className="backdrop-blur-sm bg-white/95 shadow-2xl border-0">
              <Flex direction="column" gap="6">
                {/* Header */}
                <Box>
                  <Badge size="2" variant="soft" color="blue" className="mb-4">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Welcome Back
                  </Badge>
                  <Heading size="8" mb="3" className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    Sign In to Your Account
                  </Heading>
                  <Text size="3" color="gray">
                    Continue your habit journey where you left off
                  </Text>
                </Box>

                {/* Social Login Options */}
                <Flex gap="3">
                  <Button 
                    size="3" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => handleSocialLogin('Google')}
                  >
                    <Chrome className="h-4 w-4 mr-2" />
                    Google
                  </Button>
                  <Button 
                    size="3" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => handleSocialLogin('GitHub')}
                  >
                    <Github className="h-4 w-4 mr-2" />
                    GitHub
                  </Button>
                  <Button 
                    size="3" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => handleSocialLogin('Twitter')}
                  >
                    <Twitter className="h-4 w-4 mr-2" />
                    Twitter
                  </Button>
                </Flex>

                <Flex align="center" gap="3">
                  <Separator className="flex-1" />
                  <Text size="2" color="gray">or continue with email</Text>
                  <Separator className="flex-1" />
                </Flex>
                
                {/* Login Form */}
                <form onSubmit={handleSubmit}>
                  <Flex direction="column" gap="4">
                    <Box>
                      <Text as="label" size="2" weight="medium" mb="2">
                        Email Address
                      </Text>
                      <TextField.Root
                        size="3"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (errors.email) setErrors({ ...errors, email: undefined });
                        }}
                        className={errors.email ? 'border-red-500' : ''}
                      >
                        <TextField.Slot>
                          <Mail className="h-4 w-4" />
                        </TextField.Slot>
                      </TextField.Root>
                      {errors.email && (
                        <Text size="1" color="red" mt="1">{errors.email}</Text>
                      )}
                    </Box>
                    
                    <Box>
                      <Flex justify="between" mb="2">
                        <Text as="label" size="2" weight="medium">
                          Password
                        </Text>
                        <Text 
                          size="2" 
                          color="blue" 
                          className="cursor-pointer hover:underline"
                          onClick={() => {
                            setResetEmail(email);
                            setShowResetDialog(true);
                          }}
                        >
                          Forgot password?
                        </Text>
                      </Flex>
                      <TextField.Root
                        size="3"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (errors.password) setErrors({ ...errors, password: undefined });
                        }}
                        className={errors.password ? 'border-red-500' : ''}
                      >
                        <TextField.Slot>
                          <Lock className="h-4 w-4" />
                        </TextField.Slot>
                        <TextField.Slot>
                          <Box 
                            className="cursor-pointer"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Box>
                        </TextField.Slot>
                      </TextField.Root>
                      {errors.password && (
                        <Text size="1" color="red" mt="1">{errors.password}</Text>
                      )}
                    </Box>

                    <Flex justify="between" align="center">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="rounded border-gray-300"
                        />
                        <Text size="2">Remember me</Text>
                      </label>
                    </Flex>

                    <Button 
                      type="submit" 
                      size="4" 
                      disabled={loading}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      {loading ? (
                        <>
                          <Box className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                          Signing in...
                        </>
                      ) : (
                        <>
                          Sign In
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </Flex>
                </form>

                <Separator />

                <Flex align="center" justify="center" gap="2">
                  <Text size="2" color="gray">
                    Don't have an account?
                  </Text>
                  <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
                    Create one for free
                  </Link>
                </Flex>

                {/* Security Badge */}
                <Card className="bg-green-50 border-green-200">
                  <Flex align="center" gap="2">
                    <Shield className="h-4 w-4 text-green-600" />
                    <Text size="2" color="green">
                      Secure login with end-to-end encryption
                    </Text>
                  </Flex>
                </Card>
              </Flex>
            </Card>
          </Box>

          {/* Right Side - Features */}
          <Box className="flex-1 hidden lg:block">
            <Flex direction="column" gap="6">
              <Box>
                <Badge size="2" variant="surface" color="purple" className="mb-4">
                  <Activity className="h-3 w-3 mr-1" />
                  Why HabitForge?
                </Badge>
                <Heading size="7" mb="3">
                  Everything you need to build lasting habits
                </Heading>
                <Text size="3" color="gray" className="leading-relaxed">
                  Join thousands of users who have transformed their lives through 
                  science-backed habit building techniques.
                </Text>
              </Box>

              <Flex direction="column" gap="3">
                {features.map((feature, index) => (
                  <Flex key={index} align="center" gap="3">
                    <Box className="p-2 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg">
                      <feature.icon className="h-5 w-5 text-blue-600" />
                    </Box>
                    <Text size="3">{feature.text}</Text>
                  </Flex>
                ))}
              </Flex>

              {/* Testimonial */}
              <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
                <Flex direction="column" gap="3">
                  <Text size="3" className="italic">
                    "HabitForge changed my life. The rope visualization keeps me motivated, 
                    and the community support is incredible!"
                  </Text>
                  <Flex align="center" gap="2">
                    <Box className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-400" />
                    <Box>
                      <Text size="2" weight="bold">Sarah Chen</Text>
                      <Text size="1" color="gray">150-day streak</Text>
                    </Box>
                  </Flex>
                </Flex>
              </Card>

              {/* Stats */}
              <Flex gap="4">
                <Box>
                  <Heading size="6">50K+</Heading>
                  <Text size="2" color="gray">Active Users</Text>
                </Box>
                <Box>
                  <Heading size="6">250K+</Heading>
                  <Text size="2" color="gray">Habits Tracked</Text>
                </Box>
                <Box>
                  <Heading size="6">87%</Heading>
                  <Text size="2" color="gray">Success Rate</Text>
                </Box>
              </Flex>
            </Flex>
          </Box>
        </Flex>
      </Container>

      {/* Password Reset Dialog */}
      <Dialog.Root open={showResetDialog} onOpenChange={setShowResetDialog}>
        <Dialog.Content maxWidth="400px">
          <Dialog.Title>Reset Your Password</Dialog.Title>
          <Dialog.Description>
            Enter your email address and we'll send you a link to reset your password.
          </Dialog.Description>
          
          <Flex direction="column" gap="4" mt="4">
            <Box>
              <Text as="label" size="2" weight="medium" mb="2">
                Email Address
              </Text>
              <TextField.Root
                size="3"
                type="email"
                placeholder="Enter your email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
              >
                <TextField.Slot>
                  <Mail className="h-4 w-4" />
                </TextField.Slot>
              </TextField.Root>
            </Box>
          </Flex>
          
          <Flex gap="3" mt="5" justify="end">
            <Dialog.Close>
              <Button variant="soft" disabled={loading}>
                Cancel
              </Button>
            </Dialog.Close>
            <Button 
              onClick={handleForgotPassword}
              disabled={loading || !resetEmail}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </Box>
  );
}