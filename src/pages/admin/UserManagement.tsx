import { useState, useEffect } from 'react';
import { 
  Box, Button, Card, Container, Flex, Grid, Heading, Text, 
  TextField, Select, Table, Badge, IconButton, Dialog
} from '@radix-ui/themes';
import { useAdminStore } from '@/stores/adminStore';
import { 
  Search, 
  Filter, 
  Shield, 
  Ban,
  Edit,
  Trash2,
  Download,
  Eye,
  UserCheck,
  AlertTriangle
} from 'lucide-react';
import toast from 'react-hot-toast';

export function UserManagement() {
  const { 
    users, 
    loading, 
    fetchUsers, 
    updateUserStatus, 
    deleteUser, 
    upgradeUser,
    exportUserData,
    flagUser
  } = useAdminStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserDialog, setShowUserDialog] = useState(false);

  useEffect(() => {
    loadUsers();
  }, [filterType]);

  const loadUsers = async () => {
    const filters = filterType !== 'all' ? { status: filterType } : {};
    await fetchUsers(filters);
  };

  const handleUserAction = async (userId: string, action: string) => {
    const user = users.find(u => u.uid === userId);
    if (!user) return;

    try {
      switch (action) {
        case 'suspend':
          await updateUserStatus(userId, 'suspended');
          break;
        case 'activate':
          await updateUserStatus(userId, 'active');
          break;
        case 'ban':
          await updateUserStatus(userId, 'banned');
          break;
        case 'delete':
          if (window.confirm(`Are you sure you want to permanently delete ${user.displayName || user.email}? This action cannot be undone.`)) {
            await deleteUser(userId);
          }
          break;
        case 'upgrade':
          await upgradeUser(userId, 'premium');
          break;
        case 'export':
          await exportUserData(userId);
          break;
        case 'view':
          setSelectedUser(user);
          setShowUserDialog(true);
          break;
        case 'flag':
          const reason = window.prompt('Reason for flagging this user:');
          if (reason) {
            await flagUser(userId, reason);
          }
          break;
      }
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
                      color={user.accountStatus === 'active' ? 'green' : 
                             user.accountStatus === 'suspended' ? 'yellow' : 'red'}
                      variant="soft"
                    >
                      {user.accountStatus || 'active'}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <Flex align="center" gap="1">
                      {user.accountType === 'premium' && (
                        <Shield className="h-4 w-4 text-yellow-500" />
                      )}
                      <Text size="2">{user.accountType || 'free'}</Text>
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
                    <Flex gap="1" wrap="wrap">
                      <IconButton
                        size="1"
                        variant="ghost"
                        onClick={() => handleUserAction(user.uid, 'view')}
                        title="View Details"
                      >
                        <Eye className="h-3 w-3" />
                      </IconButton>
                      <IconButton
                        size="1"
                        variant="ghost"
                        onClick={() => handleUserAction(user.uid, 'export')}
                        title="Export Data"
                      >
                        <Download className="h-3 w-3" />
                      </IconButton>
                      <IconButton
                        size="1"
                        variant="ghost"
                        onClick={() => handleUserAction(user.uid, user.accountStatus === 'suspended' ? 'activate' : 'suspend')}
                        title={user.accountStatus === 'suspended' ? 'Activate' : 'Suspend'}
                      >
                        {user.accountStatus === 'suspended' ? (
                          <UserCheck className="h-3 w-3 text-green-600" />
                        ) : (
                          <Ban className="h-3 w-3 text-yellow-600" />
                        )}
                      </IconButton>
                      <IconButton
                        size="1"
                        variant="ghost"
                        onClick={() => handleUserAction(user.uid, 'flag')}
                        title="Flag User"
                      >
                        <AlertTriangle className="h-3 w-3 text-orange-600" />
                      </IconButton>
                      <IconButton
                        size="1"
                        variant="ghost"
                        color="red"
                        onClick={() => handleUserAction(user.uid, 'delete')}
                        title="Delete User"
                      >
                        <Trash2 className="h-3 w-3" />
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