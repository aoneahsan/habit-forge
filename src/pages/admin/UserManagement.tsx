import { useState, useEffect } from 'react';
import { 
  Box, Button, Card, Container, Flex, Grid, Heading, Text, 
  TextField, Select, Table, Badge, IconButton
} from '@radix-ui/themes';
import { AdminService } from '@/services/admin.service';
import { 
  Search, 
  Filter, 
  Shield, 
  Ban,
  Edit,
  Trash2
} from 'lucide-react';
import type { User } from '@/types';

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [loading, setLoading] = useState(true);
  const adminService = AdminService.getInstance();

  useEffect(() => {
    loadUsers();
  }, [filterType]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await adminService.getUsers(filterType);
      setUsers(data);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = async (userId: string, action: string) => {
    try {
      switch (action) {
        case 'suspend':
          await adminService.suspendUser(userId);
          break;
        case 'activate':
          await adminService.activateUser(userId);
          break;
        case 'delete':
          if (confirm('Are you sure you want to delete this user?')) {
            await adminService.deleteUser(userId);
          }
          break;
        case 'upgrade':
          await adminService.upgradeUser(userId);
          break;
      }
      loadUsers();
    } catch (error) {
      console.error(`Failed to ${action} user:`, error);
    }
  };

  const filteredUsers = users.filter(user => 
    user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container size="4" py="6">
      <Box mb="8">
        <Heading size="8">User Management</Heading>
        <Text color="gray" size="3">Manage user accounts and permissions</Text>
      </Box>

      {/* Filters */}
      <Card mb="6">
        <Flex gap="4" direction={{ initial: 'column', sm: 'row' }}>
          <Box flexGrow="1">
            <TextField.Root
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            >
              <TextField.Slot>
                <Search className="h-4 w-4" />
              </TextField.Slot>
            </TextField.Root>
          </Box>
          <Flex gap="2">
            <Select.Root
              value={filterType}
              onValueChange={(value) => setFilterType(value)}
            >
              <Select.Trigger />
              <Select.Content>
                <Select.Item value="all">All Users</Select.Item>
                <Select.Item value="active">Active</Select.Item>
                <Select.Item value="suspended">Suspended</Select.Item>
                <Select.Item value="premium">Premium</Select.Item>
                <Select.Item value="free">Free</Select.Item>
              </Select.Content>
            </Select.Root>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </Flex>
        </Flex>
      </Card>

      {/* Users Table */}
      <Card>
        {loading ? (
          <Flex align="center" justify="center" py="9">
            <Box className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></Box>
          </Flex>
        ) : filteredUsers.length === 0 ? (
          <Flex align="center" justify="center" py="9">
            <Text color="gray">No users found</Text>
          </Flex>
        ) : (
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>User</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Plan</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Joined</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Last Active</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {filteredUsers.map((user) => (
                <Table.Row key={user.id}>
                  <Table.Cell>
                    <Box>
                      <Text weight="medium">{user.displayName || 'Unknown'}</Text>
                      <Text size="1" color="gray">{user.email}</Text>
                    </Box>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge 
                      color={user.status === 'active' ? 'green' : 'red'}
                      variant="soft"
                    >
                      {user.status || 'active'}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <Flex align="center" gap="1">
                      {user.subscriptionTier === 'premium' && (
                        <Shield className="h-4 w-4 text-yellow-500" />
                      )}
                      <Text size="2">{user.subscriptionTier || 'free'}</Text>
                    </Flex>
                  </Table.Cell>
                  <Table.Cell>
                    <Text size="2" color="gray">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text size="2" color="gray">
                      {user.lastActive ? new Date(user.lastActive).toLocaleDateString() : 'Never'}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Flex gap="2">
                      <IconButton
                        size="1"
                        variant="ghost"
                        onClick={() => handleUserAction(user.id, 'edit')}
                      >
                        <Edit className="h-4 w-4" />
                      </IconButton>
                      <IconButton
                        size="1"
                        variant="ghost"
                        onClick={() => handleUserAction(user.id, user.status === 'suspended' ? 'activate' : 'suspend')}
                      >
                        <Ban className="h-4 w-4" />
                      </IconButton>
                      <IconButton
                        size="1"
                        variant="ghost"
                        color="red"
                        onClick={() => handleUserAction(user.id, 'delete')}
                      >
                        <Trash2 className="h-4 w-4" />
                      </IconButton>
                    </Flex>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        )}
      </Card>
    </Container>
  );
}