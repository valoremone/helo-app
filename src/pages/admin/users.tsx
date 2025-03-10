import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MEMBERSHIP_TIERS } from '@/lib/constants';

const users = [
  {
    id: 'USR-001',
    name: 'John Doe',
    email: 'john@example.com',
    membershipTier: MEMBERSHIP_TIERS.PLATINUM,
    status: 'active',
  },
  {
    id: 'USR-002',
    name: 'Jane Smith',
    email: 'jane@example.com',
    membershipTier: MEMBERSHIP_TIERS.BLACK,
    status: 'active',
  },
  {
    id: 'USR-003',
    name: 'Robert Johnson',
    email: 'robert@example.com',
    membershipTier: MEMBERSHIP_TIERS.ELITE,
    status: 'inactive',
  },
];

export function AdminUsers() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Users</h1>
      
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Membership</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{user.membershipTier}</Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={user.status === 'active' ? 'default' : 'secondary'}
                  >
                    {user.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}