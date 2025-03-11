import { MoreHorizontal, Search, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { UserForm } from '@/components/users/UserForm';
import { MEMBERSHIP_TIERS } from '@/lib/constants';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member';
  membershipTier: keyof typeof MEMBERSHIP_TIERS;
  status: 'active' | 'inactive';
  createdAt: Date;
  lastLogin: Date;
}

// Temporary mock data
const mockUsers: User[] = [
  {
    id: '1',
    name: 'HELO Admin',
    email: 'admin@flyhelo.one',
    role: 'admin',
    membershipTier: 'PLATINUM',
    status: 'active',
    createdAt: new Date('2024-03-01'),
    lastLogin: new Date('2024-03-10T12:00:00'),
  },
  {
    id: '2',
    name: 'HELO Member',
    email: 'member@flyhelo.one',
    role: 'member',
    membershipTier: 'ELITE',
    status: 'active',
    createdAt: new Date('2024-03-05'),
    lastLogin: new Date('2024-03-10T09:00:00'),
  },
  {
    id: '3',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'member',
    membershipTier: 'STANDARD',
    status: 'active',
    createdAt: new Date('2024-01-15'),
    lastLogin: new Date('2024-03-09'),
  },
  {
    id: '4',
    name: 'Robert Johnson',
    email: 'robert@example.com',
    role: 'member',
    membershipTier: 'ELITE',
    status: 'inactive',
    createdAt: new Date('2023-11-20'),
    lastLogin: new Date('2024-02-10'),
  },
];

export interface UserFormValues {
  name: string;
  role: 'admin' | 'member';
  email: string;
  membershipTier: keyof typeof MEMBERSHIP_TIERS;
  password?: string;
}

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

  const handleAddUser = async (data: UserFormValues) => {
    try {
      // TODO: Replace with actual API call
      const newUser: User = {
        id: String(users.length + 1),
        ...data,
        status: 'active',
        createdAt: new Date(),
        lastLogin: new Date(),
      };
      setUsers([...users, newUser]);
      setIsAddingUser(false);
    } catch (error) {
      console.error('Failed to add user:', error);
    }
  };

  const handleEditUser = async (data: UserFormValues) => {
    try {
      // TODO: Replace with actual API call
      const updatedUsers = users.map(user => 
        user.id === selectedUser?.id ? { ...user, ...data } as User : user
      );
      setUsers(updatedUsers);
      setSelectedUser(null);
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  const handleToggleUserStatus = (userId: string) => {
    const updatedUsers = users.map(user =>
      user.id === userId ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' } as User : user
    );
    setUsers(updatedUsers);
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
              <TableHead>Created At</TableHead>
              <TableHead>Last Login</TableHead>
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
                  {user.createdAt.toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {user.lastLogin.toLocaleDateString()}
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
                        onClick={() => handleToggleUserStatus(user.id)}
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