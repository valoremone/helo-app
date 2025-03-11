import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { auth } from '@/lib/better-auth';
import { LoginForm } from '@/components/auth/login-form';
import { setCredentials } from '@/store/slices/auth';
import { User } from '@/lib/auth/config';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  
  // Get redirect location from state or default to dashboard
  const from = (location.state as any)?.from?.pathname || '/';

  const handleLogin = async (data: { email: string; password: string }) => {
    try {
      setIsLoading(true);
      
      // Use Better Auth directly
      const response = await auth.signIn.email({
        email: data.email,
        password: data.password
      });
      
      if (response.error) {
        throw new Error(response.error.message || 'Authentication failed');
      }
      
      // Get session data and update Redux store
      const session = await auth.getSession();
      if (session.data) {
        // Create a user object that matches our expected User type
        const user: User = {
          id: session.data.user.id,
          email: session.data.user.email,
          name: session.data.user.name || 'User',
          role: 'admin' as const, // Default role
          isActive: true,
          createdAt: new Date(session.data.user.createdAt),
          updatedAt: new Date(session.data.user.updatedAt),
          permissions: [] // Default permissions
        };
        
        // Create a token from the session token
        const token = session.data.session?.token || '';
        
        dispatch(setCredentials({
          user,
          token
        }));
        
        toast.success('Logged in successfully');
        // Navigate to the page they tried to visit or dashboard
        navigate(from, { replace: true });
      } else {
        throw new Error('Failed to get session data');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <img src="/logo.svg" alt="Logo" className="h-8 w-8 mr-2" />
          HELO Admin
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              "Streamline your aviation operations with our comprehensive admin dashboard."
            </p>
            <footer className="text-sm">HELO Aviation</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
            <p className="text-sm text-muted-foreground">
              Enter your credentials to access your account
            </p>
          </div>
          <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
} 