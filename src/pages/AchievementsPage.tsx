import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAuthStore } from '@/stores/authStore';
import { useAchievementStore } from '@/stores/achievementStore';
import { 
  Box, Button, Card, Container, Flex, Grid, Heading, Text, 
  Badge, Progress, Tabs, Avatar
} from '@radix-ui/themes';
import { 
  Trophy, Award, Crown, Star, Flame, Target, 
  TrendingUp, Zap, Medal, Gift, Sparkles,
  Lock, CheckCircle2
} from 'lucide-react';
import toast from 'react-hot-toast';

export function AchievementsPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { 
    achievements, 
    userAchievements, 
    userStats,
    leaderboard,
    fetchUserAchievements,
    fetchLeaderboard,
    getUserStats
  } = useAchievementStore();
  
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'streak' | 'completion' | 'social' | 'special'>('all');
  const [leaderboardTimeFrame, setLeaderboardTimeFrame] = useState<'daily' | 'weekly' | 'monthly' | 'all-time'>('weekly');

  useEffect(() => {
    if (!user) {
      navigate({ to: '/login' });
      return;
    }
    
    fetchUserAchievements(user.uid);
    getUserStats(user.uid);
    fetchLeaderboard('weekly');
  }, [user, navigate]);

  const filteredAchievements = achievements.filter(a => 
    selectedCategory === 'all' || a.category === selectedCategory
  );

  const unlockedCount = userAchievements.length;
  const totalCount = achievements.length;
  const progressPercentage = (unlockedCount / totalCount) * 100;

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'gray';
      case 'rare': return 'blue';
      case 'epic': return 'purple';
      case 'legendary': return 'gold';
      default: return 'gray';
    }
  };

  const getLevelColor = (level: number) => {
    if (level >= 50) return 'gold';
    if (level >= 30) return 'purple';
    if (level >= 20) return 'blue';
    if (level >= 10) return 'green';
    return 'gray';
  };

  const currentUser = leaderboard.find(entry => entry.userId === user?.uid);
  const userRank = currentUser?.rank || '-';

  return (
    <Container size="4" py="6">
      {/* Header */}
      <Box mb="8">
        <Flex justify="between" align="center">
          <Box>
            <Heading size="8" mb="2">Achievements & Rewards</Heading>
            <Text size="4" color="gray">Unlock achievements and climb the leaderboard</Text>
          </Box>
          <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <Flex align="center" gap="3">
              <Trophy className="h-8 w-8" />
              <Box>
                <Text size="5" weight="bold">Level {userStats.level}</Text>
                <Text size="2">{userStats.currentLevelPoints}/{userStats.nextLevelPoints} XP</Text>
              </Box>
            </Flex>
          </Card>
        </Flex>
      </Box>

      {/* Stats Overview */}
      <Grid columns={{ initial: '2', sm: '3', md: '6' }} gap="4" mb="8">
        <Card>
          <Flex direction="column" align="center" gap="2">
            <Medal className="h-6 w-6 text-yellow-600" />
            <Heading size="5">{unlockedCount}</Heading>
            <Text size="1" color="gray">Unlocked</Text>
          </Flex>
        </Card>
        
        <Card>
          <Flex direction="column" align="center" gap="2">
            <Star className="h-6 w-6 text-blue-600" />
            <Heading size="5">{userStats.totalPoints}</Heading>
            <Text size="1" color="gray">Total Points</Text>
          </Flex>
        </Card>
        
        <Card>
          <Flex direction="column" align="center" gap="2">
            <Crown className="h-6 w-6 text-purple-600" />
            <Heading size="5">#{userRank}</Heading>
            <Text size="1" color="gray">Global Rank</Text>
          </Flex>
        </Card>
        
        <Card>
          <Flex direction="column" align="center" gap="2">
            <Flame className="h-6 w-6 text-orange-600" />
            <Heading size="5">{userStats.streakRecord}</Heading>
            <Text size="1" color="gray">Best Streak</Text>
          </Flex>
        </Card>
        
        <Card>
          <Flex direction="column" align="center" gap="2">
            <Target className="h-6 w-6 text-green-600" />
            <Heading size="5">{userStats.habitsCompleted}</Heading>
            <Text size="1" color="gray">Completed</Text>
          </Flex>
        </Card>
        
        <Card>
          <Flex direction="column" align="center" gap="2">
            <Sparkles className="h-6 w-6 text-pink-600" />
            <Heading size="5">{userStats.perfectDays}</Heading>
            <Text size="1" color="gray">Perfect Days</Text>
          </Flex>
        </Card>
      </Grid>

      {/* Progress Bar */}
      <Card mb="8">
        <Flex direction="column" gap="3">
          <Flex justify="between">
            <Text weight="medium">Overall Achievement Progress</Text>
            <Text size="2" color="gray">{unlockedCount}/{totalCount} achievements</Text>
          </Flex>
          <Progress value={progressPercentage} size="3" />
          <Flex gap="2" wrap="wrap">
            {userStats.badges.slice(0, 10).map((badge, index) => (
              <Text key={index} size="5">{badge}</Text>
            ))}
            {userStats.badges.length > 10 && (
              <Badge color="gray" variant="soft">+{userStats.badges.length - 10} more</Badge>
            )}
          </Flex>
        </Flex>
      </Card>

      <Tabs.Root defaultValue="achievements">
        <Tabs.List size="2">
          <Tabs.Trigger value="achievements">
            <Award className="h-4 w-4 mr-2" />
            Achievements
          </Tabs.Trigger>
          <Tabs.Trigger value="leaderboard">
            <Crown className="h-4 w-4 mr-2" />
            Leaderboard
          </Tabs.Trigger>
          <Tabs.Trigger value="rewards">
            <Gift className="h-4 w-4 mr-2" />
            Rewards Shop
          </Tabs.Trigger>
        </Tabs.List>

        {/* Achievements Tab */}
        <Tabs.Content value="achievements">
          <Card mt="4">
            {/* Category Filter */}
            <Flex gap="2" mb="4" wrap="wrap">
              {['all', 'streak', 'completion', 'social', 'special'].map(category => (
                <Button
                  key={category}
                  size="2"
                  variant={selectedCategory === category ? 'solid' : 'soft'}
                  onClick={() => setSelectedCategory(category as any)}
                >
                  {category === 'all' ? 'All' : category.charAt(0).toUpperCase() + category.slice(1)}
                </Button>
              ))}
            </Flex>

            {/* Achievement Grid */}
            <Grid columns={{ initial: '1', sm: '2', lg: '3' }} gap="4">
              {filteredAchievements.map(achievement => {
                const isUnlocked = userAchievements.some(ua => ua.achievementId === achievement.id);
                const unlockDate = userAchievements.find(ua => ua.achievementId === achievement.id)?.unlockedAt;
                
                return (
                  <Card 
                    key={achievement.id}
                    className={`relative transition-all ${
                      isUnlocked 
                        ? 'border-2 border-green-500 bg-green-50' 
                        : 'opacity-75 grayscale hover:opacity-100 hover:grayscale-0'
                    }`}
                  >
                    {!isUnlocked && (
                      <Box className="absolute top-2 right-2">
                        <Lock className="h-4 w-4 text-gray-400" />
                      </Box>
                    )}
                    {isUnlocked && (
                      <Box className="absolute top-2 right-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      </Box>
                    )}
                    
                    <Flex direction="column" gap="3">
                      <Flex align="center" gap="3">
                        <Text size="6">{achievement.icon}</Text>
                        <Box>
                          <Heading size="3">{achievement.title}</Heading>
                          <Badge 
                            size="1" 
                            color={getRarityColor(achievement.rarity)}
                            variant="soft"
                          >
                            {achievement.rarity}
                          </Badge>
                        </Box>
                      </Flex>
                      
                      <Text size="2" color="gray">{achievement.description}</Text>
                      
                      <Flex justify="between" align="center">
                        <Flex align="center" gap="2">
                          <Zap className="h-3 w-3 text-yellow-600" />
                          <Text size="2" weight="bold">{achievement.points} pts</Text>
                        </Flex>
                        
                        {isUnlocked && unlockDate && (
                          <Text size="1" color="gray">
                            {new Date(unlockDate).toLocaleDateString()}
                          </Text>
                        )}
                      </Flex>
                      
                      {!isUnlocked && achievement.progress !== undefined && (
                        <Box>
                          <Flex justify="between" mb="1">
                            <Text size="1" color="gray">Progress</Text>
                            <Text size="1" weight="bold">{achievement.progress}%</Text>
                          </Flex>
                          <Progress value={achievement.progress} size="1" />
                        </Box>
                      )}
                    </Flex>
                  </Card>
                );
              })}
            </Grid>
          </Card>
        </Tabs.Content>

        {/* Leaderboard Tab */}
        <Tabs.Content value="leaderboard">
          <Card mt="4">
            {/* Time Frame Selector */}
            <Flex justify="between" align="center" mb="4">
              <Heading size="5">Global Rankings</Heading>
              <Flex gap="2">
                {(['daily', 'weekly', 'monthly', 'all-time'] as const).map(timeFrame => (
                  <Button
                    key={timeFrame}
                    size="1"
                    variant={leaderboardTimeFrame === timeFrame ? 'solid' : 'soft'}
                    onClick={() => {
                      setLeaderboardTimeFrame(timeFrame);
                      fetchLeaderboard(timeFrame);
                    }}
                  >
                    {timeFrame.charAt(0).toUpperCase() + timeFrame.slice(1).replace('-', ' ')}
                  </Button>
                ))}
              </Flex>
            </Flex>

            {/* Top 3 Podium */}
            <Grid columns="3" gap="4" mb="6">
              {leaderboard.slice(0, 3).map((entry, index) => (
                <Card 
                  key={entry.userId}
                  className={`text-center ${
                    index === 0 ? 'bg-gradient-to-br from-yellow-100 to-yellow-200' :
                    index === 1 ? 'bg-gradient-to-br from-gray-100 to-gray-200' :
                    'bg-gradient-to-br from-orange-100 to-orange-200'
                  }`}
                >
                  <Flex direction="column" align="center" gap="2">
                    <Text size="7">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                    </Text>
                    <Avatar 
                      size="4" 
                      fallback={entry.displayName[0]} 
                      src={entry.avatar}
                    />
                    <Text weight="bold">{entry.displayName}</Text>
                    <Badge color={getLevelColor(entry.level)} variant="solid">
                      Level {entry.level}
                    </Badge>
                    <Text size="3" weight="bold">{entry.totalPoints.toLocaleString()} pts</Text>
                  </Flex>
                </Card>
              ))}
            </Grid>

            {/* Full Leaderboard */}
            <Box className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Rank</th>
                    <th className="text-left py-2">User</th>
                    <th className="text-center py-2">Level</th>
                    <th className="text-center py-2">Achievements</th>
                    <th className="text-right py-2">Points</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.slice(3).map(entry => {
                    const isCurrentUser = entry.userId === user?.uid;
                    return (
                      <tr 
                        key={entry.userId} 
                        className={`border-b ${isCurrentUser ? 'bg-blue-50' : ''}`}
                      >
                        <td className="py-3">
                          <Flex align="center" gap="2">
                            #{entry.rank}
                            {entry.rank && entry.rank <= 10 && (
                              <TrendingUp className="h-3 w-3 text-green-600" />
                            )}
                          </Flex>
                        </td>
                        <td className="py-3">
                          <Flex align="center" gap="2">
                            <Avatar size="2" fallback={entry.displayName[0]} src={entry.avatar} />
                            <Text weight={isCurrentUser ? 'bold' : 'medium'}>
                              {entry.displayName} {isCurrentUser && '(You)'}
                            </Text>
                          </Flex>
                        </td>
                        <td className="text-center py-3">
                          <Badge color={getLevelColor(entry.level)}>
                            {entry.level}
                          </Badge>
                        </td>
                        <td className="text-center py-3">{entry.achievementCount}</td>
                        <td className="text-right py-3">
                          <Text weight="bold">{entry.totalPoints.toLocaleString()}</Text>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Box>
          </Card>
        </Tabs.Content>

        {/* Rewards Shop Tab */}
        <Tabs.Content value="rewards">
          <Card mt="4">
            <Heading size="5" mb="4">Rewards Shop</Heading>
            <Text size="2" color="gray" mb="6">
              Exchange your points for exclusive rewards and features
            </Text>

            <Grid columns={{ initial: '1', md: '2', lg: '3' }} gap="4">
              {[
                { name: 'Custom Theme', description: 'Unlock dark mode and custom colors', cost: 500, icon: '🎨' },
                { name: 'Profile Badge', description: 'Show off your achievements', cost: 300, icon: '🏅' },
                { name: 'Extra Habit Slot', description: 'Track one more habit', cost: 1000, icon: '➕' },
                { name: 'Analytics Pro', description: 'Advanced insights and reports', cost: 800, icon: '📊' },
                { name: 'Priority Support', description: 'Get help faster', cost: 600, icon: '⚡' },
                { name: 'Custom Reminders', description: 'Set unlimited reminders', cost: 400, icon: '🔔' },
              ].map(reward => (
                <Card key={reward.name}>
                  <Flex direction="column" gap="3">
                    <Flex align="center" gap="3">
                      <Text size="6">{reward.icon}</Text>
                      <Heading size="3">{reward.name}</Heading>
                    </Flex>
                    <Text size="2" color="gray">{reward.description}</Text>
                    <Flex justify="between" align="center">
                      <Flex align="center" gap="1">
                        <Star className="h-4 w-4 text-yellow-600" />
                        <Text weight="bold">{reward.cost} pts</Text>
                      </Flex>
                      <Button 
                        size="2" 
                        disabled={userStats.totalPoints < reward.cost}
                        onClick={() => {
                          if (userStats.totalPoints >= reward.cost) {
                            toast.success(`🎉 ${reward.name} unlocked!`);
                          } else {
                            toast.error(`Need ${reward.cost - userStats.totalPoints} more points`);
                          }
                        }}
                      >
                        {userStats.totalPoints >= reward.cost ? 'Unlock' : 'Locked'}
                      </Button>
                    </Flex>
                  </Flex>
                </Card>
              ))}
            </Grid>
          </Card>
        </Tabs.Content>
      </Tabs.Root>
    </Container>
  );
}