import { useMutation } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CardContent } from '@/components/ui/card';
import { CardDescription } from '@/components/ui/card';
import { CardFooter } from '@/components/ui/card';
import { CardHeader } from '@/components/ui/card';
import { CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { auth } from '@/lib/auth-client';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/admin/dashboard';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const { mutate: login, isPending } = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const result = await auth.signIn(credentials);
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      return result.user;
    },
    onSuccess: (user) => {
      toast.success(`Welcome back, ${user.name}!`);
      navigate(from, { replace: true });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Login failed');
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    login({ email, password });
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isPending}
            >
              {isPending ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <p className="text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </p>
          <div className="border-t pt-4 text-center w-full">
            <p className="text-xs text-gray-500 mb-1">Demo Credentials</p>
            <div className="flex justify-between text-xs">
              <div>
                <p className="font-semibold">Admin User</p>
                <p>admin@flyhelo.one</p>
                <p>admin123</p>
              </div>
              <div>
                <p className="font-semibold">Member User</p>
                <p>member@flyhelo.one</p>
                <p>member123</p>
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}