import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { toast } from 'sonner';
import { authService } from '@/lib/auth/service';
import { RootState } from '@/store';
import { setCredentials } from '@/store/slices/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ProfilePage() {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state: RootState) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedUser = await authService.updateProfile({
        name,
        email,
      });
      
      dispatch(setCredentials({ 
        user: updatedUser,
        token: token || ''
      }));
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>
      
      <form onSubmit={handleUpdateProfile} className="space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          {isEditing ? (
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1"
            />
          ) : (
            <p className="mt-1 text-gray-900">{user.name}</p>
          )}
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          {isEditing ? (
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1"
            />
          ) : (
            <p className="mt-1 text-gray-900">{user.email}</p>
          )}
        </div>

        <div className="flex space-x-4">
          {isEditing ? (
            <>
              <Button type="submit">
                Save Changes
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button
              type="button"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}