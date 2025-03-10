import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { BRAND, ROUTES } from '@/lib/constants';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerAsync } from '@/store/slices/auth';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
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

const registerSchema = z.object({
  name: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error, user } = useSelector((state: RootState) => state.auth);
  
  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate(user.role === 'admin' ? ROUTES.ADMIN.DASHBOARD : ROUTES.DASHBOARD, { replace: true });
    }
  }, [user, navigate]);

  // Show error toast
  useEffect(() => {
    if (error) {
      toast.error('Registration failed', {
        description: error
      });
    }
  }, [error]);

  async function onSubmit(data: RegisterFormData) {
    const result = await dispatch(registerAsync({
      email: data.email,
      password: data.password,
      fullName: data.name,
    }));
    
    if (registerAsync.fulfilled.match(result)) {
      toast.success('Account created successfully!');
      navigate(ROUTES.DASHBOARD);
    }
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Card className="w-[400px] p-8">
        <div className="flex flex-col items-center space-y-6 text-center mb-8">
          <BrandLogo size="lg" />
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Join {BRAND.name}
            </h1>
            <p className="text-sm text-muted-foreground">
              Create your account to access exclusive luxury air mobility
            </p>
          </div>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
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
            
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
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
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>
            
            <p className="text-sm text-center text-muted-foreground mt-4">
              Already have an account?{' '}
              <Button 
                variant="link" 
                className="p-0 h-auto" 
                onClick={() => navigate(ROUTES.LOGIN)}
              >
                Sign in
              </Button>
            </p>
          </form>
        </Form>
      </Card>
    </div>
  );
}