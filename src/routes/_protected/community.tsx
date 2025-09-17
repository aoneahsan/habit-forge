import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth.store';
import { Button, TextField, Box, Flex, Container, Card, Text, Heading, Grid, TextArea, Badge, Avatar, Tabs } from '@radix-ui/themes';
import { Users, Trophy, TrendingUp, MessageCircle, Heart, Share2, UserPlus } from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/_protected/community')({
  component: CommunityPage,
});

function CommunityPage() {
  const user = useAuthStore((state) => state.user);
  const userProfile = useAuthStore((state) => state.userProfile);
  const [activeTab, setActiveTab] = useState<'feed' | 'leaderboard' | 'challenges' | 'friends'>('feed');
  const [postContent, setPostContent] = useState('');
  const queryClient = useQueryClient();

  // Mock data for demonstration
  const posts = [
    {
      id: '1',
      userId: 'user1',
      userName: 'Sarah Johnson',
      userAvatar: null,
      content: 'Just completed my 30-day meditation streak! Feeling more focused than ever. 🧘‍♀️',
      likes: 24,
      comments: 5,
      createdAt: new Date('2024-01-15T10:00:00'),
      isLiked: false,
    },
    {
      id: '2',
      userId: 'user2',
      userName: 'Mike Chen',
      userAvatar: null,
      content: 'Morning run complete! 5km in 25 minutes. The rope visualization really helps me stay motivated!',
      likes: 18,
      comments: 3,
      createdAt: new Date('2024-01-15T08:30:00'),
      isLiked: true,
    },
    {
      id: '3',
      userId: 'user3',
      userName: 'Emma Davis',
      userAvatar: null,
      content: 'Started a new habit of reading 20 pages daily. Already finished 2 books this month! 📚',
      likes: 32,
      comments: 8,
      createdAt: new Date('2024-01-14T20:00:00'),
      isLiked: false,
    },
  ];

  const leaderboard = [
    { rank: 1, name: 'Alex Thompson', points: 15420, streak: 89, avatar: null },
    { rank: 2, name: 'Sarah Johnson', points: 14200, streak: 75, avatar: null },
    { rank: 3, name: 'Mike Chen', points: 13850, streak: 68, avatar: null },
    { rank: 4, name: 'Emma Davis', points: 12500, streak: 60, avatar: null },
    { rank: 5, name: 'John Smith', points: 11200, streak: 52, avatar: null },
    { rank: 6, name: userProfile?.displayName || 'You', points: userProfile?.stats?.totalPoints || 0, streak: userProfile?.stats?.currentStreak || 0, avatar: user?.photoURL, isCurrentUser: true },
  ];

  const challenges = [
    {
      id: '1',
      name: '30-Day Fitness Challenge',
      description: 'Complete a workout every day for 30 days',
      participants: 234,
      daysLeft: 15,
      progress: 50,
      joined: true,
    },
    {
      id: '2',
      name: 'Morning Routine Master',
      description: 'Build a consistent morning routine',
      participants: 189,
      daysLeft: 20,
      progress: 0,
      joined: false,
    },
    {
      id: '3',
      name: 'Digital Detox Week',
      description: 'Reduce screen time by 50%',
      participants: 567,
      daysLeft: 5,
      progress: 80,
      joined: true,
    },
  ];

  const friends = [
    { id: '1', name: 'Sarah Johnson', status: 'active', mutualHabits: 3, streak: 75 },
    { id: '2', name: 'Mike Chen', status: 'active', mutualHabits: 2, streak: 68 },
    { id: '3', name: 'Emma Davis', status: 'inactive', mutualHabits: 1, streak: 60 },
  ];

  const handlePost = () => {
    if (!postContent.trim()) return;
    
    toast.success('Post shared successfully!');
    setPostContent('');
  };

  return (
    <Container size="3">
      <Flex direction="column" gap="6">
        {/* Header */}
        <Box>
          <Heading size="8">Community</Heading>
          <Text color="gray" mt="1">
            Connect with others on their habit journey
          </Text>
        </Box>

        {/* Tabs */}
        <Tabs.Root value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <Tabs.List size="2">
            <Tabs.Trigger value="feed">
              <MessageCircle size={16} style={{ marginRight: '8px' }} />
              Feed
            </Tabs.Trigger>
            <Tabs.Trigger value="leaderboard">
              <Trophy size={16} style={{ marginRight: '8px' }} />
              Leaderboard
            </Tabs.Trigger>
            <Tabs.Trigger value="challenges">
              <TrendingUp size={16} style={{ marginRight: '8px' }} />
              Challenges
            </Tabs.Trigger>
            <Tabs.Trigger value="friends">
              <Users size={16} style={{ marginRight: '8px' }} />
              Friends
            </Tabs.Trigger>
          </Tabs.List>

          {/* Content */}
          {activeTab === 'feed' && (
            <Tabs.Content value="feed">
              <Flex direction="column" gap="6">
                {/* Create Post */}
                <Card>
                  <Flex gap="3">
                    <Avatar size="3" fallback="U" radius="full" />
                    <Flex direction="column" flexGrow="1" gap="2">
                      <TextArea
                        value={postContent}
                        onChange={(e) => setPostContent(e.target.value)}
                        placeholder="Share your progress..."
                        size="2"
                        style={{ minHeight: '80px' }}
                      />
                      <Flex justify="end">
                        <Button size="2" onClick={handlePost}>
                          Share
                        </Button>
                      </Flex>
                    </Flex>
                  </Flex>
                </Card>

                {/* Posts */}
                <Flex direction="column" gap="4">
                  {posts.map((post) => (
                    <Card key={post.id}>
                      <Flex gap="3">
                        <Avatar size="3" fallback={post.userName.substring(0, 2)} radius="full" />
                        <Flex direction="column" flexGrow="1" gap="2">
                          <Flex justify="between" align="start">
                            <Box>
                              <Text weight="medium">{post.userName}</Text>
                              <Text size="1" color="gray">
                                {new Date(post.createdAt).toLocaleString()}
                              </Text>
                            </Box>
                          </Flex>
                          <Text>{post.content}</Text>
                          <Flex gap="4" mt="2">
                            <Button
                              variant="ghost"
                              size="1"
                              color={post.isLiked ? 'red' : 'gray'}
                              style={{ padding: '4px 8px', cursor: 'pointer' }}
                            >
                              <Heart
                                size={16}
                                fill={post.isLiked ? 'currentColor' : 'none'}
                                style={{ marginRight: '4px' }}
                              />
                              {post.likes}
                            </Button>
                            <Button
                              variant="ghost"
                              size="1"
                              color="gray"
                              style={{ padding: '4px 8px', cursor: 'pointer' }}
                            >
                              <MessageCircle size={16} style={{ marginRight: '4px' }} />
                              {post.comments}
                            </Button>
                            <Button
                              variant="ghost"
                              size="1"
                              color="gray"
                              style={{ padding: '4px 8px', cursor: 'pointer' }}
                            >
                              <Share2 size={16} />
                            </Button>
                          </Flex>
                        </Flex>
                      </Flex>
                    </Card>
                  ))}
                </Flex>
              </Flex>
            </Tabs.Content>
          )}

          {activeTab === 'leaderboard' && (
            <Tabs.Content value="leaderboard">
              <Card>
                <Box p="6">
                  <Heading size="5">Global Leaderboard</Heading>
                  <Text size="2" color="gray">Top performers this month</Text>
                </Box>
                <Box>
                  {leaderboard.map((entry, index) => (
                    <Box
                      key={entry.rank}
                      p="4"
                      style={{
                        backgroundColor: entry.isCurrentUser ? 'var(--teal-2)' : 'transparent',
                        borderTop: index > 0 ? '1px solid var(--gray-6)' : 'none',
                      }}
                    >
                      <Flex justify="between" align="center">
                        <Flex align="center" gap="4">
                          <Badge
                            size="2"
                            color={entry.rank <= 3 ? 'yellow' : 'gray'}
                            radius="full"
                            style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          >
                            {entry.rank}
                          </Badge>
                          <Avatar size="3" fallback={entry.name.substring(0, 2)} radius="full" />
                          <Box>
                            <Text weight="medium">
                              {entry.name}
                              {entry.isCurrentUser && ' (You)'}
                            </Text>
                            <Text size="2" color="gray">
                              {entry.streak} day streak
                            </Text>
                          </Box>
                        </Flex>
                        <Box style={{ textAlign: 'right' }}>
                          <Text size="5" weight="bold">
                            {entry.points.toLocaleString()}
                          </Text>
                          <Text size="2" color="gray">points</Text>
                        </Box>
                      </Flex>
                    </Box>
                  ))}
                </Box>
              </Card>
            </Tabs.Content>
          )}

          {activeTab === 'challenges' && (
            <Tabs.Content value="challenges">
              <Flex direction="column" gap="4">
                {challenges.map((challenge) => (
                  <Card key={challenge.id} size="3">
                    <Flex justify="between" align="start">
                      <Flex direction="column" flexGrow="1" gap="3">
                        <Heading size="4">{challenge.name}</Heading>
                        <Text size="2" color="gray">{challenge.description}</Text>
                        <Flex gap="4">
                          <Flex align="center" gap="1">
                            <Users size={16} color="var(--gray-10)" />
                            <Text size="2" color="gray">
                              {challenge.participants} participants
                            </Text>
                          </Flex>
                          <Flex align="center" gap="1">
                            <Trophy size={16} color="var(--gray-10)" />
                            <Text size="2" color="gray">
                              {challenge.daysLeft} days left
                            </Text>
                          </Flex>
                        </Flex>
                        {challenge.joined && (
                          <Box>
                            <Flex justify="between" align="center" mb="1">
                              <Text size="2" color="gray">Progress</Text>
                              <Text size="2" weight="medium">{challenge.progress}%</Text>
                            </Flex>
                            <Box
                              style={{
                                height: '8px',
                                backgroundColor: 'var(--gray-6)',
                                borderRadius: '9999px',
                                overflow: 'hidden',
                              }}
                            >
                              <Box
                                style={{
                                  height: '100%',
                                  width: `${challenge.progress}%`,
                                  backgroundColor: 'var(--teal-9)',
                                  transition: 'width 0.3s',
                                }}
                              />
                            </Box>
                          </Box>
                        )}
                      </Flex>
                      <Button
                        size="2"
                        variant={challenge.joined ? 'outline' : 'solid'}
                        ml="4"
                      >
                        {challenge.joined ? 'View' : 'Join'}
                      </Button>
                    </Flex>
                  </Card>
                ))}
              </Flex>
            </Tabs.Content>
          )}

          {activeTab === 'friends' && (
            <Tabs.Content value="friends">
              <Flex direction="column" gap="4">
                <Card>
                  <Flex justify="between" align="center">
                    <TextField.Root
                      placeholder="Search friends by username..."
                      size="2"
                      style={{ maxWidth: '400px' }}
                    />
                    <Button size="2">
                      <UserPlus size={16} style={{ marginRight: '8px' }} />
                      Add Friend
                    </Button>
                  </Flex>
                </Card>

                <Flex direction="column" gap="2">
                  {friends.map((friend) => (
                    <Card key={friend.id}>
                      <Flex justify="between" align="center">
                        <Flex align="center" gap="3">
                          <Avatar size="3" fallback={friend.name.substring(0, 2)} radius="full" />
                          <Box>
                            <Text weight="medium">{friend.name}</Text>
                            <Text size="2" color="gray">
                              {friend.mutualHabits} mutual habits • {friend.streak} day streak
                            </Text>
                          </Box>
                        </Flex>
                        <Flex align="center" gap="2">
                          <Box
                            style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              backgroundColor: friend.status === 'active' ? 'var(--green-9)' : 'var(--gray-9)',
                            }}
                          />
                          <Button size="2" variant="ghost">
                            View Profile
                          </Button>
                        </Flex>
                      </Flex>
                    </Card>
                  ))}
                </Flex>
              </Flex>
            </Tabs.Content>
          )}
        </Tabs.Root>
      </Flex>
    </Container>
  );
}