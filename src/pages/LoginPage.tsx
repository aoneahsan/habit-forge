import { useState } from 'react';
import { useNavigate, Link } from '@tanstack/react-router';
import { useAuthStore } from '@/stores/authStore';
import { Box, Button, Card, Container, Flex, Heading, Text, TextField } from '@radix-ui/themes';
import toast from 'react-hot-toast';

export function LoginPage() {
  const navigate = useNavigate();
  const { signIn } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: typeof errors = {};
    if (!email) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setErrors({});
    setLoading(true);

    try {
      await signIn(email, password);
      toast.success('Welcome back!');
      navigate({ to: '/dashboard' });
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="1" className="min-h-screen flex items-center justify-center">
      <Box className="w-full max-w-md">
        <Card size="4">
          <Flex direction="column" gap="6">
            <Box>
              <Heading size="6" align="center" mb="2">Welcome Back</Heading>
              <Text align="center" color="gray">Sign in to your HabitForge account</Text>
            </Box>
            
            <form onSubmit={handleSubmit}>
              <Flex direction="column" gap="4">
                <Box>
                  <Text as="label" size="2" weight="medium" mb="1">
                    Email
                  </Text>
                  <TextField.Root
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  {errors.email && (
                    <Text size="1" color="red" mt="1">{errors.email}</Text>
                  )}
                </Box>
                
                <Box>
                  <Text as="label" size="2" weight="medium" mb="1">
                    Password
                  </Text>
                  <TextField.Root
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  {errors.password && (
                    <Text size="1" color="red" mt="1">{errors.password}</Text>
                  )}
                </Box>

                <Button type="submit" size="3" disabled={loading}>
                  {loading ? 'Signing in...' : 'Login'}
                </Button>
              </Flex>
            </form>

            <Text align="center" size="2" color="gray">
              Don't have an account?{' '}
              <Link to="/signup" className="text-blue-600 hover:underline">
                Sign up
              </Link>
            </Text>
          </Flex>
        </Card>
      </Box>
    </Container>
  );
}