import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { BRAND, ROUTES } from '@/lib/constants';
import { loginAsync } from '@/store/slices/auth';
import { RootState, AppDispatch } from '@/store';
import { toast } from 'sonner';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BrandLogo } from '@/components/brand-logo';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error, user } = useSelector((state: RootState) => state.auth);
  
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      const from = (location.state as any)?.from || 
                  (user.role === 'admin' ? ROUTES.ADMIN.DASHBOARD : ROUTES.DASHBOARD);
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  // Show error toast
  useEffect(() => {
    if (error) {
      toast.error('Login failed', {
        description: error
      });
    }
  }, [error]);

  async function onSubmit(data: LoginFormData) {
    const result = await dispatch(loginAsync({
      email: data.email,
      password: data.password,
    }));
    
    if (loginAsync.fulfilled.match(result)) {
      const user = result.payload.user;
      toast.success('Welcome back!');
      
      // Navigate to the appropriate dashboard based on role
      navigate(user.role === 'admin' ? ROUTES.ADMIN.DASHBOARD : ROUTES.DASHBOARD);
    }
  }

  const setDemoCredentials = (userType: 'admin' | 'user') => {
    form.setValue('email', userType === 'admin' ? 'admin@demo.com' : 'user@demo.com');
    form.setValue('password', userType === 'admin' ? 'admin123' : 'user123');
  };

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Card className="w-[400px] p-8">
        <div className="flex flex-col items-center space-y-6 text-center mb-8">
          <BrandLogo size="lg" />
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Welcome to {BRAND.name}
            </h1>
            <p className="text-sm text-muted-foreground">
              {BRAND.description}
            </p>
          </div>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="name@example.com" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
            
            <div className="pt-4 space-y-2">
              <p className="text-sm text-center text-muted-foreground">Test Accounts</p>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => setDemoCredentials('admin')}
                >
                  Admin User
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => setDemoCredentials('user')}
                >
                  Regular User
                </Button>
              </div>
            </div>
            
            <p className="text-sm text-center text-muted-foreground mt-4">
              Don't have an account?{' '}
              <Button 
                variant="link" 
                className="p-0 h-auto" 
                onClick={() => navigate(ROUTES.REGISTER)}
              >
                Sign up
              </Button>
            </p>
          </form>
        </Form>
      </Card>
    </div>
  );
}