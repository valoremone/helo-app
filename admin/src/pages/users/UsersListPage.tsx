import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { MEMBERSHIP_TIERS } from '@/lib/constants';
import { MoreHorizontal, Plus, Search, UserPlus } from 'lucide-react';
import { UserForm } from '@/components/users/UserForm';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  membershipTier: keyof typeof MEMBERSHIP_TIERS;
  status: 'active' | 'inactive';
  lastActive: string;
}

// Temporary mock data
const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'member',
    membershipTier: 'STANDARD',
    status: 'active',
    lastActive: '2024-03-20T10:00:00Z',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'admin',
    membershipTier: 'PLATINUM',
    status: 'active',
    lastActive: '2024-03-20T09:30:00Z',
  },
];

export default function UsersListPage() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getMembershipColor = (tier: keyof typeof MEMBERSHIP_TIERS) => {
    const colors = {
      PLATINUM: 'bg-zinc-300 text-zinc-900',
      BLACK: 'bg-black text-white',
      ELITE: 'bg-purple-600 text-white',
      STANDARD: 'bg-blue-600 text-white',
    };
    return colors[tier] || 'bg-gray-600 text-white';
  };

  const handleAddUser = async (data: any) => {
    try {
      // TODO: Replace with actual API call
      const newUser = {
        id: String(users.length + 1),
        ...data,
        status: 'active',
        lastActive: new Date().toISOString(),
      };
      setUsers([...users, newUser]);
      setIsAddingUser(false);
    } catch (error) {
      console.error('Failed to add user:', error);
    }
  };

  const handleEditUser = async (data: any) => {
    try {
      // TODO: Replace with actual API call
      const updatedUsers = users.map(user =>
        user.id === selectedUser?.id ? { ...user, ...data } : user
      );
      setUsers(updatedUsers);
      setSelectedUser(null);
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Users</h1>
        <Dialog open={isAddingUser} onOpenChange={setIsAddingUser}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
            </DialogHeader>
            <UserForm onSubmit={handleAddUser} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Membership</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell className="capitalize">{user.role}</TableCell>
                <TableCell>
                  <Badge className={getMembershipColor(user.membershipTier)}>
                    {MEMBERSHIP_TIERS[user.membershipTier]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(user.lastActive).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => setSelectedUser(user)}>
                        Edit User
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => {
                          const updatedUsers = users.map(u =>
                            u.id === user.id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u
                          );
                          setUsers(updatedUsers);
                        }}
                      >
                        {user.status === 'active' ? 'Disable' : 'Enable'} Account
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <UserForm
              initialData={selectedUser}
              onSubmit={handleEditUser}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 