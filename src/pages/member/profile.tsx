import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { MEMBERSHIP_TIERS } from '@/lib/constants';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useState } from 'react';
import { updateProfile } from '@/lib/local-auth';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { setUser } from '@/store/slices/auth';

export function ProfilePage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('+1 (555) 000-0000');
  const [location, setLocation] = useState('Los Angeles, CA');
  const [isUpdating, setIsUpdating] = useState(false);
  
  if (!user) return null;
  
  const handleUpdateProfile = async () => {
    try {
      setIsUpdating(true);
      
      const updatedUser = await updateProfile(user.id, {
        name,
        // membership tier stays the same
      });
      
      if (updatedUser) {
        dispatch(setUser(updatedUser));
        toast.success('Profile updated successfully');
      }
    } catch (error: any) {
      toast.error('Failed to update profile', {
        description: error.message
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Profile</h1>
        <Badge variant="secondary">{user.membershipTier}</Badge>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email}
                  disabled
                  className="bg-muted cursor-not-allowed opacity-70"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input 
                  id="phone" 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input 
                  id="location" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>
            <Button onClick={handleUpdateProfile} disabled={isUpdating}>
              {isUpdating ? 'Saving Changes...' : 'Save Changes'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Membership Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Member Since</span>
                <span className="font-medium">January 2025</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Membership Level</span>
                <span className="font-medium">{user.membershipTier}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Points Balance</span>
                <span className="font-medium">
                  {user.role === 'admin' ? '250,000' : '125,000'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}