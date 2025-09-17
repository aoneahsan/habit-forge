import { createFileRoute, useNavigate, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Loader2, Mail, Lock, Eye, EyeOff, User } from 'lucide-react';
import { signUpWithEmail, signInWithGoogle } from '@/services/firebase/auth.service';
import { createUserProfile } from '@/services/firebase/user.service';
import { 
  Button, 
  TextField, 
  Card, 
  Flex, 
  Box, 
  Text, 
  Heading, 
  Checkbox, 
  Separator,
  IconButton 
} from '@radix-ui/themes';

const signUpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type SignUpForm = z.infer<typeof signUpSchema>;

export const Route = createFileRoute('/_auth/signup')({
  component: SignUpPage,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      redirect: typeof search.redirect === 'string' ? search.redirect : undefined,
    };
  },
});

function SignUpPage() {
  const navigate = useNavigate();
  const { redirect } = Route.useSearch();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpForm) => {
    setIsLoading(true);
    try {
      const user = await signUpWithEmail(data.email, data.password, data.name);
      await createUserProfile(user);
      toast.success('Account created successfully!');
      // Delay navigation to allow auth state to update
      setTimeout(() => {
        navigate({ to: redirect || '/dashboard', replace: true });
      }, 100);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    try {
      const user = await signInWithGoogle();
      await createUserProfile(user);
      toast.success('Welcome to HabitForge!');
      // Delay navigation to allow auth state to update
      setTimeout(() => {
        navigate({ to: redirect || '/dashboard', replace: true });
      }, 100);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box maxWidth="450px" width="100%">
      <Card size="4">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex direction="column" gap="5">
            <Box>
              <Heading size="8" align="center" mb="2">Create Account</Heading>
              <Text align="center" size="2" color="gray">
                Start your habit transformation journey
              </Text>
            </Box>

            <Flex direction="column" gap="4">
              <Box>
                <Text as="label" size="2" mb="1" weight="bold">
                  Full Name
                </Text>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <TextField.Root
                      {...field}
                      size="3"
                      placeholder="John Doe"
                      disabled={isLoading}
                    >
                      <TextField.Slot>
                        <User size={16} />
                      </TextField.Slot>
                    </TextField.Root>
                  )}
                />
                {errors.name && (
                  <Text size="1" color="red" mt="1">
                    {errors.name.message}
                  </Text>
                )}
              </Box>

              <Box>
                <Text as="label" size="2" mb="1" weight="bold">
                  Email
                </Text>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <TextField.Root
                      {...field}
                      size="3"
                      placeholder="you@example.com"
                      disabled={isLoading}
                    >
                      <TextField.Slot>
                        <Mail size={16} />
                      </TextField.Slot>
                    </TextField.Root>
                  )}
                />
                {errors.email && (
                  <Text size="1" color="red" mt="1">
                    {errors.email.message}
                  </Text>
                )}
              </Box>

              <Box>
                <Text as="label" size="2" mb="1" weight="bold">
                  Password
                </Text>
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <TextField.Root
                      {...field}
                      size="3"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      disabled={isLoading}
                    >
                      <TextField.Slot>
                        <Lock size={16} />
                      </TextField.Slot>
                      <TextField.Slot>
                        <IconButton
                          size="1"
                          variant="ghost"
                          onClick={() => setShowPassword(!showPassword)}
                          type="button"
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </IconButton>
                      </TextField.Slot>
                    </TextField.Root>
                  )}
                />
                {errors.password && (
                  <Text size="1" color="red" mt="1">
                    {errors.password.message}
                  </Text>
                )}
              </Box>

              <Box>
                <Text as="label" size="2" mb="1" weight="bold">
                  Confirm Password
                </Text>
                <Controller
                  name="confirmPassword"
                  control={control}
                  render={({ field }) => (
                    <TextField.Root
                      {...field}
                      size="3"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      disabled={isLoading}
                    >
                      <TextField.Slot>
                        <Lock size={16} />
                      </TextField.Slot>
                      <TextField.Slot>
                        <IconButton
                          size="1"
                          variant="ghost"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          type="button"
                        >
                          {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </IconButton>
                      </TextField.Slot>
                    </TextField.Root>
                  )}
                />
                {errors.confirmPassword && (
                  <Text size="1" color="red" mt="1">
                    {errors.confirmPassword.message}
                  </Text>
                )}
              </Box>

              <Text size="2">
                <Checkbox
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => setAgreedToTerms(!!checked)}
                  required
                />
                <Text ml="2">
                  I agree to the{' '}
                  <Text color="blue" weight="medium">
                    Terms of Service
                  </Text>{' '}
                  and{' '}
                  <Text color="blue" weight="medium">
                    Privacy Policy
                  </Text>
                </Text>
              </Text>

              <Button
                type="submit"
                size="3"
                disabled={isLoading || !agreedToTerms}
                style={{ width: '100%' }}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            </Flex>

            <Separator size="4" />

            <Flex direction="column" gap="3">
              <Text align="center" size="2" color="gray">
                Or continue with
              </Text>
              
              <Button
                type="button"
                variant="outline"
                size="3"
                onClick={handleGoogleSignUp}
                disabled={isLoading}
                style={{ width: '100%' }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </Button>
            </Flex>

            <Text align="center" size="2" color="gray">
              Already have an account?{' '}
              <Link to="/signin" search={{ redirect: undefined }}>
                <Text color="blue" weight="medium">
                  Sign in
                </Text>
              </Link>
            </Text>
          </Flex>
        </form>
      </Card>
    </Box>
  );
}