import { useState } from 'react';
import { useNavigate, Link } from '@tanstack/react-router';
import { useAuthStore } from '@/stores/authStore';
import { Box, Button, Card, Container, Flex, Heading, Text, TextField } from '@radix-ui/themes';
import toast from 'react-hot-toast';

export function SignUpPage() {
  const navigate = useNavigate();
  const { signUp } = useAuthStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: typeof errors = {};
    if (!name) newErrors.name = 'Name is required';
    if (!email) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setErrors({});
    setLoading(true);

    try {
      await signUp(email, password, name);
      toast.success('Account created successfully!');
      navigate({ to: '/dashboard' });
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account');
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
              <Heading size="6" align="center" mb="2">Create Your Account</Heading>
              <Text align="center" color="gray">Start building better habits today</Text>
            </Box>
            
            <form onSubmit={handleSubmit}>
              <Flex direction="column" gap="4">
                <Box>
                  <Text as="label" size="2" weight="medium" mb="1">
                    Name
                  </Text>
                  <TextField.Root
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  {errors.name && (
                    <Text size="1" color="red" mt="1">{errors.name}</Text>
                  )}
                </Box>
                
                <Box>
                  <Text as="label" size="2" weight="medium" mb="1">
                    Email
                  </Text>
                  <TextField.Root
                    type="email"
                    placeholder="john@example.com"
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
                    placeholder="Minimum 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  {errors.password && (
                    <Text size="1" color="red" mt="1">{errors.password}</Text>
                  )}
                </Box>

                <Button type="submit" size="3" disabled={loading}>
                  {loading ? 'Creating account...' : 'Sign Up'}
                </Button>
              </Flex>
            </form>

            <Text align="center" size="2" color="gray">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:underline">
                Sign in
              </Link>
            </Text>
          </Flex>
        </Card>
      </Box>
    </Container>
  );
}