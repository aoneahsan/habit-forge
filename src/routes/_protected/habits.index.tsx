import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUserHabits } from '@/services/firebase/habit.service';
import { useAuthStore } from '@/stores/auth.store';
import { Button, TextField, Box, Flex, Container, Card, Text, Heading, Grid, Select, Badge } from '@radix-ui/themes';
import { HabitList } from '@/components/habits/HabitList';
import { Plus, Search, Filter, Grid as GridIcon, List } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

export const Route = createFileRoute('/_protected/habits/')({
  component: HabitsPage,
});

function HabitsPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const { data: habits = [], isLoading } = useQuery({
    queryKey: ['habits', user?.uid],
    queryFn: () => {
      if (!user?.uid) throw new Error('User not authenticated');
      return getUserHabits(user.uid);
    },
    enabled: !!user?.uid,
  });

  const categories = [
    'all',
    'health',
    'productivity',
    'mindfulness',
    'fitness',
    'learning',
    'social',
    'finance',
    'creativity',
    'other',
  ];

  const filteredHabits = habits.filter((habit) => {
    const matchesSearch = habit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      habit.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || habit.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const activeHabits = filteredHabits.filter(h => h.status === 'active');
  const pausedHabits = filteredHabits.filter(h => h.status === 'paused');

  return (
    <Container size="4">
      <Flex direction="column" gap="6">
        {/* Header */}
        <Flex justify="between" align="start">
          <Box>
            <Heading size="8">My Habits</Heading>
            <Text color="gray" mt="1">
              Manage and track your daily habits
            </Text>
          </Box>
          <Button onClick={() => navigate({ to: '/habits/new' })}>
            <Plus size={16} style={{ marginRight: '8px' }} />
            New Habit
          </Button>
        </Flex>

        {/* Filters and Search */}
        <Card>
          <Flex
            direction={{ initial: 'column', md: 'row' }}
            gap="4"
            justify="between"
            align={{ initial: 'stretch', md: 'center' }}
          >
            {/* Search */}
            <Box position="relative" style={{ flex: '1', maxWidth: '400px' }}>
              <Search
                size={20}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--gray-10)',
                }}
              />
              <TextField.Root
                placeholder="Search habits..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '40px' }}
              />
            </Box>

            <Flex align="center" gap="4">
              {/* Category Filter */}
              <Flex align="center" gap="2">
                <Filter size={20} color="var(--gray-10)" />
                <Select.Root value={selectedCategory} onValueChange={setSelectedCategory}>
                  <Select.Trigger />
                  <Select.Content>
                    {categories.map((category) => (
                      <Select.Item key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </Flex>

              {/* View Mode Toggle */}
              <Flex style={{ border: '1px solid var(--gray-6)', borderRadius: '6px' }}>
                <Button
                  variant={viewMode === 'list' ? 'solid' : 'ghost'}
                  size="2"
                  onClick={() => setViewMode('list')}
                  style={{
                    borderRadius: '6px 0 0 6px',
                    minWidth: '40px',
                  }}
                >
                  <List size={16} />
                </Button>
                <Button
                  variant={viewMode === 'grid' ? 'solid' : 'ghost'}
                  size="2"
                  onClick={() => setViewMode('grid')}
                  style={{
                    borderRadius: '0 6px 6px 0',
                    minWidth: '40px',
                  }}
                >
                  <GridIcon size={16} />
                </Button>
              </Flex>
            </Flex>
          </Flex>
        </Card>

        {/* Stats */}
        <Grid columns={{ initial: '1', md: '4' }} gap="4">
          <Card>
            <Text size="7" weight="bold">
              {habits.length}
            </Text>
            <Text size="2" color="gray">Total Habits</Text>
          </Card>
          <Card>
            <Text size="7" weight="bold" color="green">
              {activeHabits.length}
            </Text>
            <Text size="2" color="gray">Active</Text>
          </Card>
          <Card>
            <Text size="7" weight="bold" color="yellow">
              {pausedHabits.length}
            </Text>
            <Text size="2" color="gray">Paused</Text>
          </Card>
          <Card>
            <Text size="7" weight="bold" color="blue">
              {habits.filter(h => (h.streak || 0) > 0).length}
            </Text>
            <Text size="2" color="gray">With Streaks</Text>
          </Card>
        </Grid>

        {/* Habits List */}
        <Flex direction="column" gap="6">
          {isLoading ? (
            <Card size="3" style={{ padding: '32px' }}>
              <Flex align="center" justify="center">
                <Text color="gray">Loading habits...</Text>
              </Flex>
            </Card>
        ) : filteredHabits.length > 0 ? (
          <>
              {activeHabits.length > 0 && (
                <Box>
                  <Heading size="5" mb="4">
                    Active Habits ({activeHabits.length})
                  </Heading>
                  {viewMode === 'list' ? (
                    <HabitList habits={activeHabits} />
                  ) : (
                    <Grid columns={{ initial: '1', md: '2', lg: '3' }} gap="4">
                      {activeHabits.map((habit) => (
                        <Card key={habit.id}>
                          <Heading size="3">{habit.name}</Heading>
                          <Text size="2" color="gray" mt="1">
                            {habit.description}
                          </Text>
                        </Card>
                      ))}
                    </Grid>
                  )}
                </Box>
              )}

              {pausedHabits.length > 0 && (
                <Box>
                  <Heading size="5" mb="4">
                    Paused Habits ({pausedHabits.length})
                  </Heading>
                  {viewMode === 'list' ? (
                    <HabitList habits={pausedHabits} />
                  ) : (
                    <Grid columns={{ initial: '1', md: '2', lg: '3' }} gap="4">
                      {pausedHabits.map((habit) => (
                        <Card key={habit.id} style={{ opacity: 0.6 }}>
                          <Heading size="3">{habit.name}</Heading>
                          <Text size="2" color="gray" mt="1">
                            {habit.description}
                          </Text>
                        </Card>
                      ))}
                    </Grid>
                  )}
                </Box>
              )}
          </>
          ) : (
            <Card size="3" style={{ padding: '32px' }}>
              <Flex direction="column" align="center" justify="center" gap="4">
                <Flex
                  width="64px"
                  height="64px"
                  align="center"
                  justify="center"
                  style={{
                    borderRadius: '50%',
                    backgroundColor: 'var(--teal-3)',
                  }}
                >
                  <Plus size={32} color="var(--teal-11)" />
                </Flex>
                <Heading size="4">No habits found</Heading>
                <Text color="gray" align="center">
                  {searchTerm || selectedCategory !== 'all'
                    ? 'Try adjusting your filters'
                    : 'Create your first habit to get started'}
                </Text>
                {!searchTerm && selectedCategory === 'all' && (
                  <Button
                    mt="4"
                    onClick={() => navigate({ to: '/habits/new' })}
                  >
                    Create First Habit
                  </Button>
                )}
              </Flex>
            </Card>
          )}
        </Flex>
      </Flex>
    </Container>
  );
}