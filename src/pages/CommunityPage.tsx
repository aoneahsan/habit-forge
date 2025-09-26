import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAuthStore } from '@/stores/authStore';
import { useCommunityStore } from '@/stores/communityStore';
import { 
  Box, Button, Card, Container, Flex, Grid, Heading, Text, 
  Badge, Progress, Tabs, Avatar, Dialog, TextField, TextArea,
  Select, Separator
} from '@radix-ui/themes';
import { 
  Users, Trophy, Target, Calendar, TrendingUp, Award, 
  Plus, Search, Filter, Clock, MapPin, Heart, Zap,
  UserPlus, MessageCircle, Star, Flame, Shield, Crown,
  ChevronRight, Sparkles, Activity
} from 'lucide-react';
import toast from 'react-hot-toast';

export function CommunityPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { 
    challenges, 
    buddies,
    fetchChallenges,
    joinChallenge,
    leaveChallenge,
    createChallenge,
    findBuddies,
    requestBuddy
  } = useCommunityStore();
  
  const [showCreateChallenge, setShowCreateChallenge] = useState(false);
  const [showBuddyFinder, setShowBuddyFinder] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [buddyPreferences, setBuddyPreferences] = useState({
    categories: [],
    preferredTime: 'morning',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  });

  useEffect(() => {
    if (!user) {
      navigate({ to: '/login' });
      return;
    }
    fetchChallenges();
  }, [user, fetchChallenges, navigate]);

  const handleJoinChallenge = async (challengeId: string) => {
    if (!user) return;
    
    const challenge = challenges.find(c => c.id === challengeId);
    if (challenge?.participants.includes(user.uid)) {
      await leaveChallenge(challengeId, user.uid);
    } else {
      await joinChallenge(challengeId, user.uid);
    }
  };

  const handleFindBuddies = async () => {
    if (!user) return;
    setShowBuddyFinder(true);
    await findBuddies(user.uid, buddyPreferences);
  };

  const filteredChallenges = challenges.filter(c => {
    if (selectedCategory !== 'all' && c.category !== selectedCategory) return false;
    if (searchTerm && !c.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  return (
    <Container size="4" py="6">
      {/* Header */}
      <Box mb="8">
        <Heading size="8" mb="2">Community Hub</Heading>
        <Text size="4" color="gray">Connect, compete, and grow together</Text>
      </Box>

      {/* Stats */}
      <Grid columns={{ initial: '2', md: '4' }} gap="4" mb="8">
        <Card>
          <Flex direction="column" gap="2">
            <Flex align="center" gap="2">
              <Users className="h-5 w-5 text-blue-600" />
              <Text size="2" color="gray">Active Members</Text>
            </Flex>
            <Heading size="6">50,234</Heading>
            <Badge color="green" variant="soft">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12% this month
            </Badge>
          </Flex>
        </Card>
        
        <Card>
          <Flex direction="column" gap="2">
            <Flex align="center" gap="2">
              <Trophy className="h-5 w-5 text-yellow-600" />
              <Text size="2" color="gray">Active Challenges</Text>
            </Flex>
            <Heading size="6">{challenges.length}</Heading>
            <Text size="1" color="gray">Join to compete</Text>
          </Flex>
        </Card>
        
        <Card>
          <Flex direction="column" gap="2">
            <Flex align="center" gap="2">
              <UserPlus className="h-5 w-5 text-green-600" />
              <Text size="2" color="gray">Buddy Matches</Text>
            </Flex>
            <Heading size="6">2,145</Heading>
            <Text size="1" color="gray">This week</Text>
          </Flex>
        </Card>
        
        <Card>
          <Flex direction="column" gap="2">
            <Flex align="center" gap="2">
              <Award className="h-5 w-5 text-purple-600" />
              <Text size="2" color="gray">Achievements</Text>
            </Flex>
            <Heading size="6">89,432</Heading>
            <Text size="1" color="gray">Earned today</Text>
          </Flex>
        </Card>
      </Grid>

      <Tabs.Root defaultValue="challenges">
        <Tabs.List size="2">
          <Tabs.Trigger value="challenges">
            <Trophy className="h-4 w-4 mr-2" />
            Challenges
          </Tabs.Trigger>
          <Tabs.Trigger value="buddies">
            <Users className="h-4 w-4 mr-2" />
            Accountability Buddies
          </Tabs.Trigger>
          <Tabs.Trigger value="leaderboard">
            <Crown className="h-4 w-4 mr-2" />
            Leaderboard
          </Tabs.Trigger>
          <Tabs.Trigger value="groups">
            <Shield className="h-4 w-4 mr-2" />
            Groups
          </Tabs.Trigger>
        </Tabs.List>

        {/* Challenges Tab */}
        <Tabs.Content value="challenges">
          <Card mt="4">
            {/* Filters */}
            <Flex justify="between" align="center" mb="4">
              <Flex gap="3" align="center">
                <TextField.Root 
                  placeholder="Search challenges..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                >
                  <TextField.Slot>
                    <Search className="h-4 w-4" />
                  </TextField.Slot>
                </TextField.Root>
                
                <Select.Root value={selectedCategory} onValueChange={setSelectedCategory}>
                  <Select.Trigger>
                    <Filter className="h-4 w-4 mr-2" />
                    {selectedCategory === 'all' ? 'All Categories' : selectedCategory}
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Item value="all">All Categories</Select.Item>
                    <Select.Item value="health">Health</Select.Item>
                    <Select.Item value="fitness">Fitness</Select.Item>
                    <Select.Item value="productivity">Productivity</Select.Item>
                    <Select.Item value="mindfulness">Mindfulness</Select.Item>
                    <Select.Item value="learning">Learning</Select.Item>
                  </Select.Content>
                </Select.Root>
              </Flex>
              
              <Button onClick={() => setShowCreateChallenge(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Challenge
              </Button>
            </Flex>

            {/* Challenge Cards */}
            <Grid columns={{ initial: '1', md: '2', lg: '3' }} gap="4">
              {filteredChallenges.map(challenge => {
                const isJoined = user && challenge.participants.includes(user.uid);
                const daysLeft = Math.ceil((challenge.endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                
                return (
                  <Card key={challenge.id} className="hover:shadow-lg transition-all">
                    <Flex direction="column" gap="3">
                      <Flex justify="between" align="start">
                        <Box>
                          <Heading size="4">{challenge.title}</Heading>
                          <Flex gap="2" mt="1">
                            <Badge color="blue" variant="soft">{challenge.category}</Badge>
                            <Badge 
                              color={challenge.difficulty === 'easy' ? 'green' : challenge.difficulty === 'hard' ? 'red' : 'yellow'}
                              variant="soft"
                            >
                              {challenge.difficulty}
                            </Badge>
                          </Flex>
                        </Box>
                        {isJoined && (
                          <Badge color="green" variant="solid">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Joined
                          </Badge>
                        )}
                      </Flex>
                      
                      <Text size="2" color="gray">{challenge.description}</Text>
                      
                      <Flex gap="4">
                        <Flex align="center" gap="1">
                          <Users className="h-3 w-3" />
                          <Text size="1">{challenge.participantCount}</Text>
                        </Flex>
                        <Flex align="center" gap="1">
                          <Calendar className="h-3 w-3" />
                          <Text size="1">{challenge.duration} days</Text>
                        </Flex>
                        <Flex align="center" gap="1">
                          <Clock className="h-3 w-3" />
                          <Text size="1">{daysLeft} days left</Text>
                        </Flex>
                      </Flex>
                      
                      <Progress value={(challenge.participantCount / 100) * 100} size="2" />
                      
                      <Flex gap="2">
                        <Button 
                          size="2" 
                          variant={isJoined ? 'soft' : 'solid'}
                          className="flex-1"
                          onClick={() => handleJoinChallenge(challenge.id)}
                        >
                          {isJoined ? 'Leave' : 'Join Challenge'}
                        </Button>
                        <Button size="2" variant="outline" onClick={() => {
                          toast.info('Challenge details coming soon!');
                        }}>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </Flex>
                    </Flex>
                  </Card>
                );
              })}
            </Grid>
          </Card>
        </Tabs.Content>

        {/* Buddies Tab */}
        <Tabs.Content value="buddies">
          <Card mt="4">
            <Flex justify="between" align="center" mb="4">
              <Box>
                <Heading size="5">Find Your Perfect Accountability Partner</Heading>
                <Text size="2" color="gray">Get matched based on your habits and preferences</Text>
              </Box>
              <Button onClick={handleFindBuddies}>
                <Search className="mr-2 h-4 w-4" />
                Find Buddies
              </Button>
            </Flex>

            {buddies.length === 0 ? (
              <Card variant="surface" className="text-center py-9">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <Text size="3" color="gray">Click "Find Buddies" to discover your matches!</Text>
              </Card>
            ) : (
              <Grid columns={{ initial: '1', md: '2' }} gap="4">
                {buddies.map(buddy => (
                  <Card key={buddy.id} className="hover:shadow-lg transition-all">
                    <Flex gap="4">
                      <Avatar 
                        size="5" 
                        fallback={buddy.displayName[0]}
                        className="flex-shrink-0"
                      />
                      <Box className="flex-1">
                        <Flex justify="between" align="start" mb="2">
                          <Box>
                            <Heading size="3">{buddy.displayName}</Heading>
                            <Text size="2" color="gray">{buddy.bio}</Text>
                          </Box>
                          {buddy.matchScore && (
                            <Badge color="green" variant="soft">
                              {buddy.matchScore}% match
                            </Badge>
                          )}
                        </Flex>
                        
                        <Flex gap="2" wrap="wrap" mb="3">
                          {buddy.habitCategories.slice(0, 3).map(cat => (
                            <Badge key={cat} size="1" variant="outline">{cat}</Badge>
                          ))}
                        </Flex>
                        
                        <Flex gap="4" mb="3">
                          <Flex align="center" gap="1">
                            <Trophy className="h-3 w-3 text-yellow-600" />
                            <Text size="1">{buddy.stats.habitsCompleted} habits</Text>
                          </Flex>
                          <Flex align="center" gap="1">
                            <Flame className="h-3 w-3 text-orange-600" />
                            <Text size="1">{buddy.stats.currentStreak} day streak</Text>
                          </Flex>
                        </Flex>
                        
                        <Flex gap="2">
                          <Button size="2" className="flex-1" onClick={() => {
                            if (user) {
                              requestBuddy(user.uid, buddy.id);
                            }
                          }}>
                            <UserPlus className="mr-2 h-3 w-3" />
                            Connect
                          </Button>
                          <Button size="2" variant="outline" onClick={() => {
                            toast.info('Profile view coming soon!');
                          }}>
                            <MessageCircle className="h-3 w-3" />
                          </Button>
                        </Flex>
                      </Box>
                    </Flex>
                  </Card>
                ))}
              </Grid>
            )}
          </Card>
        </Tabs.Content>

        {/* Leaderboard Tab */}
        <Tabs.Content value="leaderboard">
          <Card mt="4">
            <Heading size="5" mb="4">Top Performers This Week</Heading>
            
            <Box className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Rank</th>
                    <th className="text-left py-2">User</th>
                    <th className="text-center py-2">Streak</th>
                    <th className="text-center py-2">Habits</th>
                    <th className="text-center py-2">Points</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { rank: 1, name: 'Alex Chen', streak: 142, habits: 12, points: 8420 },
                    { rank: 2, name: 'Sarah Miller', streak: 98, habits: 8, points: 6230 },
                    { rank: 3, name: 'John Davis', streak: 76, habits: 10, points: 5890 },
                  ].map(entry => (
                    <tr key={entry.rank} className="border-b">
                      <td className="py-3">
                        <Flex align="center" gap="2">
                          {entry.rank === 1 && <Crown className="h-4 w-4 text-yellow-500" />}
                          {entry.rank === 2 && <Crown className="h-4 w-4 text-gray-400" />}
                          {entry.rank === 3 && <Crown className="h-4 w-4 text-orange-600" />}
                          #{entry.rank}
                        </Flex>
                      </td>
                      <td className="py-3">
                        <Flex align="center" gap="2">
                          <Avatar size="2" fallback={entry.name[0]} />
                          <Text weight="medium">{entry.name}</Text>
                        </Flex>
                      </td>
                      <td className="text-center py-3">
                        <Badge color="orange">
                          <Flame className="h-3 w-3 mr-1" />
                          {entry.streak}
                        </Badge>
                      </td>
                      <td className="text-center py-3">{entry.habits}</td>
                      <td className="text-center py-3">
                        <Text weight="bold">{entry.points.toLocaleString()}</Text>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          </Card>
        </Tabs.Content>

        {/* Groups Tab */}
        <Tabs.Content value="groups">
          <Card mt="4">
            <Heading size="5" mb="4">Habit Groups</Heading>
            <Text size="2" color="gray" mb="4">Join groups based on your interests</Text>
            
            <Grid columns={{ initial: '1', md: '2', lg: '3' }} gap="4">
              {[
                { name: 'Morning Warriors', members: 1234, category: 'productivity' },
                { name: 'Fitness Fanatics', members: 3456, category: 'fitness' },
                { name: 'Mindful Meditators', members: 2890, category: 'mindfulness' },
                { name: 'Book Club', members: 567, category: 'learning' },
              ].map(group => (
                <Card key={group.name} className="hover:shadow-lg transition-all">
                  <Flex direction="column" gap="3">
                    <Flex align="center" gap="2">
                      <Shield className="h-5 w-5 text-blue-600" />
                      <Heading size="3">{group.name}</Heading>
                    </Flex>
                    <Flex gap="2">
                      <Badge variant="soft">{group.category}</Badge>
                      <Badge variant="outline">
                        <Users className="h-3 w-3 mr-1" />
                        {group.members}
                      </Badge>
                    </Flex>
                    <Button size="2" variant="soft">Join Group</Button>
                  </Flex>
                </Card>
              ))}
            </Grid>
          </Card>
        </Tabs.Content>
      </Tabs.Root>

      {/* Create Challenge Dialog */}
      <Dialog.Root open={showCreateChallenge} onOpenChange={setShowCreateChallenge}>
        <Dialog.Content maxWidth="500px">
          <Dialog.Title>Create New Challenge</Dialog.Title>
          <Dialog.Description>
            Start a challenge and invite others to join you
          </Dialog.Description>
          
          <Flex direction="column" gap="4" mt="4">
            <Box>
              <Text size="2" weight="medium" mb="1">Challenge Title</Text>
              <TextField.Root placeholder="30-Day Meditation Challenge" />
            </Box>
            
            <Box>
              <Text size="2" weight="medium" mb="1">Description</Text>
              <TextArea placeholder="Describe your challenge..." rows={3} />
            </Box>
            
            <Flex gap="3">
              <Box className="flex-1">
                <Text size="2" weight="medium" mb="1">Category</Text>
                <Select.Root defaultValue="mindfulness">
                  <Select.Trigger className="w-full" />
                  <Select.Content>
                    <Select.Item value="health">Health</Select.Item>
                    <Select.Item value="fitness">Fitness</Select.Item>
                    <Select.Item value="mindfulness">Mindfulness</Select.Item>
                    <Select.Item value="productivity">Productivity</Select.Item>
                    <Select.Item value="learning">Learning</Select.Item>
                  </Select.Content>
                </Select.Root>
              </Box>
              
              <Box className="flex-1">
                <Text size="2" weight="medium" mb="1">Duration (days)</Text>
                <TextField.Root type="number" defaultValue="30" />
              </Box>
            </Flex>
            
            <Box>
              <Text size="2" weight="medium" mb="1">Difficulty</Text>
              <Select.Root defaultValue="medium">
                <Select.Trigger className="w-full" />
                <Select.Content>
                  <Select.Item value="easy">Easy</Select.Item>
                  <Select.Item value="medium">Medium</Select.Item>
                  <Select.Item value="hard">Hard</Select.Item>
                </Select.Content>
              </Select.Root>
            </Box>
          </Flex>
          
          <Flex gap="3" mt="5" justify="end">
            <Dialog.Close>
              <Button variant="soft">Cancel</Button>
            </Dialog.Close>
            <Button onClick={() => {
              toast.success('🚀 Challenge created!');
              setShowCreateChallenge(false);
            }}>
              Create Challenge
            </Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>

      {/* Buddy Finder Dialog */}
      <Dialog.Root open={showBuddyFinder} onOpenChange={setShowBuddyFinder}>
        <Dialog.Content maxWidth="500px">
          <Dialog.Title>Find Your Accountability Buddy</Dialog.Title>
          <Dialog.Description>
            We'll match you based on your preferences
          </Dialog.Description>
          
          <Flex direction="column" gap="4" mt="4">
            <Box>
              <Text size="2" weight="medium" mb="1">Habit Categories</Text>
              <Text size="1" color="gray" mb="2">Select categories you're working on</Text>
              <Flex gap="2" wrap="wrap">
                {['health', 'fitness', 'productivity', 'mindfulness', 'learning'].map(cat => (
                  <Badge 
                    key={cat}
                    variant={buddyPreferences.categories.includes(cat) ? 'solid' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => {
                      setBuddyPreferences(prev => ({
                        ...prev,
                        categories: prev.categories.includes(cat) 
                          ? prev.categories.filter(c => c !== cat)
                          : [...prev.categories, cat]
                      }));
                    }}
                  >
                    {cat}
                  </Badge>
                ))}
              </Flex>
            </Box>
            
            <Box>
              <Text size="2" weight="medium" mb="1">Preferred Check-in Time</Text>
              <Select.Root 
                value={buddyPreferences.preferredTime} 
                onValueChange={(value) => setBuddyPreferences(prev => ({ ...prev, preferredTime: value }))}
              >
                <Select.Trigger className="w-full" />
                <Select.Content>
                  <Select.Item value="morning">Morning</Select.Item>
                  <Select.Item value="afternoon">Afternoon</Select.Item>
                  <Select.Item value="evening">Evening</Select.Item>
                </Select.Content>
              </Select.Root>
            </Box>
          </Flex>
          
          <Flex gap="3" mt="5" justify="end">
            <Dialog.Close>
              <Button variant="soft">Close</Button>
            </Dialog.Close>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </Container>
  );
}

// Import CheckCircle2 since we're using it
import { CheckCircle2 } from 'lucide-react';