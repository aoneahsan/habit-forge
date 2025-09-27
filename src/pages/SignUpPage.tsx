import { useState } from 'react';
import { useNavigate, Link } from '@tanstack/react-router';
import { useAuthStore } from '@/stores/authStore';
import { Box, Button, Card, Container, Flex, Heading, Text, TextField, Badge, Progress, Checkbox, Separator } from '@radix-ui/themes';
import { 
  UserPlus, Mail, Lock, ArrowRight, Sparkles, Activity, 
  Target, TrendingUp, Users, Brain, Shield, CheckCircle,
  Layers, Eye, EyeOff, Chrome, Github, Twitter, User,
  Info, AlertCircle, Check, X, Rocket
} from 'lucide-react';
import toast from 'react-hot-toast';

export function SignUpPage() {
  const navigate = useNavigate();
  const { signUp } = useAuthStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToMarketing, setAgreedToMarketing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; confirmPassword?: string; terms?: string }>({});

  // Password strength calculation
  const calculatePasswordStrength = () => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 25;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 12.5;
    if (/[^A-Za-z0-9]/.test(password)) strength += 12.5;
    return strength;
  };

  const passwordStrength = calculatePasswordStrength();
  const getPasswordStrengthColor = () => {
    if (passwordStrength < 30) return 'red';
    if (passwordStrength < 60) return 'orange';
    if (passwordStrength < 80) return 'yellow';
    return 'green';
  };

  const passwordRequirements = [
    { met: password.length >= 8, text: 'At least 8 characters' },
    { met: /[A-Z]/.test(password), text: 'One uppercase letter' },
    { met: /[a-z]/.test(password), text: 'One lowercase letter' },
    { met: /[0-9]/.test(password), text: 'One number' },
    { met: /[^A-Za-z0-9]/.test(password), text: 'One special character' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: typeof errors = {};
    if (!name) newErrors.name = 'Name is required';
    else if (name.length < 2) newErrors.name = 'Name must be at least 2 characters';
    
    if (!email) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Invalid email format';
    
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    else if (passwordStrength < 60) newErrors.password = 'Password is too weak';
    
    if (!confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    
    if (!agreedToTerms) newErrors.terms = 'You must agree to the terms and conditions';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setErrors({});
    setLoading(true);

    try {
      await signUp(email, password, name);
      toast.success('🎉 Welcome to HabitForge! Your account has been created.');
      navigate({ to: '/dashboard' });
    } catch (error: any) {
      const errorMessage = error.code === 'auth/email-already-in-use'
        ? 'An account with this email already exists'
        : error.code === 'auth/weak-password'
        ? 'Password is too weak. Please choose a stronger password'
        : error.code === 'auth/invalid-email'
        ? 'Invalid email address'
        : 'Failed to create account. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignup = (provider: string) => {
    toast.error(`${provider} signup coming soon!`);
  };

  const benefits = [
    'Track unlimited habits for free',
    'Science-backed methodology',
    'Beautiful visualizations',
    'Community support',
    'Privacy-first approach',
    'Cross-platform sync'
  ];

  return (
    <Box className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
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
              <Button variant="ghost" onClick={() => navigate({ to: '/login' })}>
                Sign In
              </Button>
            </Flex>
          </Flex>
        </Container>
      </Box>

      <Container size="4" className="min-h-screen flex items-center justify-center py-20">
        <Flex className="w-full max-w-6xl" gap="8" align="center">
          {/* Left Side - Benefits */}
          <Box className="flex-1 hidden lg:block">
            <Flex direction="column" gap="6">
              <Box>
                <Badge size="2" variant="surface" color="green" className="mb-4">
                  <Rocket className="h-3 w-3 mr-1" />
                  Start Your Journey
                </Badge>
                <Heading size="7" mb="3">
                  Join 50,000+ people building better habits
                </Heading>
                <Text size="3" color="gray" className="leading-relaxed mb-6">
                  Create your free account and start transforming your life today. 
                  No credit card required.
                </Text>
              </Box>

              <Flex direction="column" gap="3">
                {benefits.map((benefit, index) => (
                  <Flex key={index} align="center" gap="3">
                    <Box className="p-1.5 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </Box>
                    <Text size="3">{benefit}</Text>
                  </Flex>
                ))}
              </Flex>

              {/* Success Story */}
              <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
                <Flex direction="column" gap="3">
                  <Flex gap="1">
                    {[...Array(5)].map((_, i) => (
                      <Box key={i} className="text-yellow-400">★</Box>
                    ))}
                  </Flex>
                  <Text size="3" className="italic">
                    "I've tried every habit app out there. HabitForge is the only one 
                    that actually helped me stick to my goals. The five-factor tracking 
                    is a game-changer!"
                  </Text>
                  <Flex align="center" gap="2">
                    <Box className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-blue-400" />
                    <Box>
                      <Text size="2" weight="bold">Michael Rodriguez</Text>
                      <Text size="1" color="gray">90-day streak</Text>
                    </Box>
                  </Flex>
                </Flex>
              </Card>

              {/* Trust Badges */}
              <Flex gap="4" align="center">
                <Flex align="center" gap="1">
                  <Shield className="h-4 w-4 text-green-600" />
                  <Text size="2" color="gray">SSL Secured</Text>
                </Flex>
                <Flex align="center" gap="1">
                  <Lock className="h-4 w-4 text-blue-600" />
                  <Text size="2" color="gray">GDPR Compliant</Text>
                </Flex>
                <Flex align="center" gap="1">
                  <CheckCircle className="h-4 w-4 text-purple-600" />
                  <Text size="2" color="gray">No Spam</Text>
                </Flex>
              </Flex>
            </Flex>
          </Box>

          {/* Right Side - Signup Form */}
          <Box className="flex-1 w-full">
            <Card size="4" className="backdrop-blur-sm bg-white/95 shadow-2xl border-0">
              <Flex direction="column" gap="5">
                {/* Header */}
                <Box>
                  <Badge size="2" variant="soft" color="purple" className="mb-4">
                    <UserPlus className="h-3 w-3 mr-1" />
                    Get Started Free
                  </Badge>
                  <Heading size="8" mb="3" className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    Create Your Account
                  </Heading>
                  <Text size="3" color="gray">
                    Join thousands building lasting habits with science
                  </Text>
                </Box>

                {/* Social Signup Options */}
                <Flex gap="3">
                  <Button 
                    size="3" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => handleSocialSignup('Google')}
                  >
                    <Chrome className="h-4 w-4 mr-2" />
                    Google
                  </Button>
                  <Button 
                    size="3" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => handleSocialSignup('GitHub')}
                  >
                    <Github className="h-4 w-4 mr-2" />
                    GitHub
                  </Button>
                  <Button 
                    size="3" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => handleSocialSignup('Twitter')}
                  >
                    <Twitter className="h-4 w-4 mr-2" />
                    Twitter
                  </Button>
                </Flex>

                <Flex align="center" gap="3">
                  <Separator className="flex-1" />
                  <Text size="2" color="gray">or sign up with email</Text>
                  <Separator className="flex-1" />
                </Flex>
                
                {/* Signup Form */}
                <form onSubmit={handleSubmit}>
                  <Flex direction="column" gap="4">
                    <Box>
                      <Text as="label" size="2" weight="medium" mb="2">
                        Full Name
                      </Text>
                      <TextField.Root
                        size="3"
                        type="text"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          if (errors.name) setErrors({ ...errors, name: undefined });
                        }}
                        className={errors.name ? 'border-red-500' : ''}
                      >
                        <TextField.Slot>
                          <User className="h-4 w-4" />
                        </TextField.Slot>
                      </TextField.Root>
                      {errors.name && (
                        <Text size="1" color="red" mt="1">{errors.name}</Text>
                      )}
                    </Box>

                    <Box>
                      <Text as="label" size="2" weight="medium" mb="2">
                        Email Address
                      </Text>
                      <TextField.Root
                        size="3"
                        type="email"
                        placeholder="john@example.com"
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
                      <Text as="label" size="2" weight="medium" mb="2">
                        Password
                      </Text>
                      <TextField.Root
                        size="3"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Create a strong password"
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
                      {password && (
                        <Box mt="2">
                          <Flex justify="between" mb="1">
                            <Text size="1" color="gray">Password strength</Text>
                            <Text size="1" color={getPasswordStrengthColor()} weight="medium">
                              {passwordStrength < 30 ? 'Weak' : passwordStrength < 60 ? 'Fair' : passwordStrength < 80 ? 'Good' : 'Strong'}
                            </Text>
                          </Flex>
                          <Progress value={passwordStrength} size="1" color={getPasswordStrengthColor()} />
                          <Flex direction="column" gap="1" mt="2">
                            {passwordRequirements.map((req, index) => (
                              <Flex key={index} align="center" gap="1">
                                {req.met ? (
                                  <Check className="h-3 w-3 text-green-600" />
                                ) : (
                                  <X className="h-3 w-3 text-gray-400" />
                                )}
                                <Text size="1" color={req.met ? 'green' : 'gray'}>
                                  {req.text}
                                </Text>
                              </Flex>
                            ))}
                          </Flex>
                        </Box>
                      )}
                      {errors.password && (
                        <Text size="1" color="red" mt="1">{errors.password}</Text>
                      )}
                    </Box>

                    <Box>
                      <Text as="label" size="2" weight="medium" mb="2">
                        Confirm Password
                      </Text>
                      <TextField.Root
                        size="3"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: undefined });
                        }}
                        className={errors.confirmPassword ? 'border-red-500' : ''}
                      >
                        <TextField.Slot>
                          <Lock className="h-4 w-4" />
                        </TextField.Slot>
                        <TextField.Slot>
                          <Box 
                            className="cursor-pointer"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Box>
                        </TextField.Slot>
                      </TextField.Root>
                      {confirmPassword && password !== confirmPassword && (
                        <Text size="1" color="red" mt="1">Passwords do not match</Text>
                      )}
                      {errors.confirmPassword && (
                        <Text size="1" color="red" mt="1">{errors.confirmPassword}</Text>
                      )}
                    </Box>

                    <Flex direction="column" gap="2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <Checkbox 
                          checked={agreedToTerms}
                          onCheckedChange={(checked) => {
                            setAgreedToTerms(checked as boolean);
                            if (errors.terms) setErrors({ ...errors, terms: undefined });
                          }}
                        />
                        <Text size="2">
                          I agree to the{' '}
                          <Link to="#" className="text-blue-600 hover:underline">Terms of Service</Link>
                          {' '}and{' '}
                          <Link to="#" className="text-blue-600 hover:underline">Privacy Policy</Link>
                        </Text>
                      </label>
                      {errors.terms && (
                        <Text size="1" color="red">{errors.terms}</Text>
                      )}

                      <label className="flex items-center gap-2 cursor-pointer">
                        <Checkbox 
                          checked={agreedToMarketing}
                          onCheckedChange={(checked) => setAgreedToMarketing(checked as boolean)}
                        />
                        <Text size="2">
                          Send me tips and updates about habit building (optional)
                        </Text>
                      </label>
                    </Flex>

                    <Button 
                      type="submit" 
                      size="4" 
                      disabled={loading || !agreedToTerms}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    >
                      {loading ? (
                        <>
                          <Box className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                          Creating your account...
                        </>
                      ) : (
                        <>
                          Create Free Account
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </Flex>
                </form>

                <Separator />

                <Flex align="center" justify="center" gap="2">
                  <Text size="2" color="gray">
                    Already have an account?
                  </Text>
                  <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                    Sign in instead
                  </Link>
                </Flex>
              </Flex>
            </Card>
          </Box>
        </Flex>
      </Container>
    </Box>
  );
}