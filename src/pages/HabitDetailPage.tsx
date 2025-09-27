import { useState, useEffect } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useAuthStore } from '@/stores/authStore';
import { useHabitStore } from '@/stores/habitStore';
import { 
  Box, Button, Card, Container, Flex, Grid, Heading, Text, 
  Badge, Progress, Separator, Tabs
} from '@radix-ui/themes';
import { 
  ArrowLeft, Target, Calendar, TrendingUp, Award, 
  CheckCircle2, Clock, MapPin, Heart, Users, Zap,
  BarChart3, Edit, Trash2, Share2, Bell, History
} from 'lucide-react';
import toast from 'react-hot-toast';
import { RopeVisualization } from '@/components/RopeVisualization';
import { FiveFactorModal } from '@/components/FiveFactorModal';

export function HabitDetailPage() {
  const { habitId } = useParams({ from: '/habits/$habitId' });
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { 
    habits, 
    entries, 
    fetchEntries, 
    completeHabitToday, 
    trackHabit,
    deleteHabit 
  } = useHabitStore();
  
  const [showFiveFactorModal, setShowFiveFactorModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const habit = habits.find(h => h.id === habitId);

  useEffect(() => {
    if (!user) {
      navigate({ to: '/login' });
      return;
    }
    if (habitId) {
      fetchEntries(habitId);
    }
  }, [user, habitId, fetchEntries, navigate]);

  if (!habit) {
    return (
      <Container size="3" py="6">
        <Card>
          <Flex direction="column" align="center" py="9">
            <Text>Habit not found</Text>
            <Button onClick={() => navigate({ to: '/habits' })} mt="4">
              Back to Habits
            </Button>
          </Flex>
        </Card>
      </Container>
    );
  }

  const handleDelete = async () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      toast.error('⚠️ This will delete all habit data!');
      setTimeout(() => setShowDeleteConfirm(false), 5000);
    } else {
      await deleteHabit(habit.id);
      navigate({ to: '/habits' });
    }
  };

  const recentEntries = entries.slice(0, 7);
  const todayEntry = entries.find(e => {
    const today = new Date().toDateString();
    return new Date(e.timestamp).toDateString() === today;
  });

  return (
    <Container size="4" py="6">
      {/* Header */}
      <Flex justify="between" align="center" mb="6">
        <Flex align="center" gap="4">
          <Button variant="ghost" size="2" onClick={() => navigate({ to: '/habits' })}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Box>
            <Heading size="7">{habit.title}</Heading>
            <Flex gap="2" mt="2">
              <Badge color="blue">{habit.category}</Badge>
              <Badge color={habit.type === 'build' ? 'green' : 'red'}>
                {habit.type === 'build' ? 'Build' : 'Break'}
              </Badge>
              <Badge color="purple">
                <Flame className="h-3 w-3 mr-1" />
                {habit.currentStreak} day streak
              </Badge>
            </Flex>
          </Box>
        </Flex>
        
        <Flex gap="2">
          <Button variant="outline" size="2" onClick={() => {
            toast('Sharing coming soon!');
          }}>
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="2" onClick={() => {
            toast('Edit functionality coming soon!');
          }}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            color="red" 
            size="2" 
            onClick={handleDelete}
            className={showDeleteConfirm ? 'ring-2 ring-red-500' : ''}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </Flex>
      </Flex>

      {/* Quick Actions */}
      <Card mb="6">
        <Flex gap="3" wrap="wrap">
          {habit.completedToday ? (
            <Button size="3" variant="soft" color="green" disabled>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Completed Today
            </Button>
          ) : (
            <>
              <Button size="3" onClick={() => completeHabitToday(habit.id)}>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Quick Complete
              </Button>
              <Button size="3" variant="outline" onClick={() => setShowFiveFactorModal(true)}>
                <Target className="mr-2 h-4 w-4" />
                Track with Five Factors
              </Button>
            </>
          )}
          <Button size="3" variant="outline" onClick={() => {
            toast('Reminder settings coming soon!');
          }}>
            <Bell className="mr-2 h-4 w-4" />
            Set Reminder
          </Button>
        </Flex>
      </Card>

      {/* Stats Grid */}
      <Grid columns={{ initial: '2', md: '4' }} gap="4" mb="6">
        <Card>
          <Flex direction="column" gap="2">
            <Flex align="center" gap="2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <Text size="2" color="gray">Current Streak</Text>
            </Flex>
            <Heading size="6">{habit.currentStreak} days</Heading>
            <Progress value={(habit.currentStreak / 90) * 100} size="1" color="green" />
          </Flex>
        </Card>
        
        <Card>
          <Flex direction="column" gap="2">
            <Flex align="center" gap="2">
              <Award className="h-4 w-4 text-purple-600" />
              <Text size="2" color="gray">Longest Streak</Text>
            </Flex>
            <Heading size="6">{habit.longestStreak} days</Heading>
            <Progress value={(habit.longestStreak / 90) * 100} size="1" color="purple" />
          </Flex>
        </Card>
        
        <Card>
          <Flex direction="column" gap="2">
            <Flex align="center" gap="2">
              <BarChart3 className="h-4 w-4 text-blue-600" />
              <Text size="2" color="gray">Completion Rate</Text>
            </Flex>
            <Heading size="6">{Math.round(habit.completionRate * 100)}%</Heading>
            <Progress value={habit.completionRate * 100} size="1" color="blue" />
          </Flex>
        </Card>
        
        <Card>
          <Flex direction="column" gap="2">
            <Flex align="center" gap="2">
              <Calendar className="h-4 w-4 text-orange-600" />
              <Text size="2" color="gray">Total Completions</Text>
            </Flex>
            <Heading size="6">{habit.totalCompletions || 0}</Heading>
            <Text size="1" color="gray">
              Since {new Date(habit.createdAt).toLocaleDateString()}
            </Text>
          </Flex>
        </Card>
      </Grid>

      {/* Rope Visualization */}
      {habit.ropeVisualization && (
        <Box mb="6">
          <RopeVisualization 
            streak={habit.currentStreak}
            ropeData={habit.ropeVisualization}
            habitTitle={habit.title}
          />
        </Box>
      )}

      {/* Tabs for detailed info */}
      <Tabs.Root defaultValue="recent">
        <Tabs.List>
          <Tabs.Trigger value="recent">Recent Activity</Tabs.Trigger>
          <Tabs.Trigger value="patterns">Five-Factor Patterns</Tabs.Trigger>
          <Tabs.Trigger value="milestones">Milestones</Tabs.Trigger>
          <Tabs.Trigger value="insights">AI Insights</Tabs.Trigger>
        </Tabs.List>

        {/* Recent Activity */}
        <Tabs.Content value="recent">
          <Card mt="4">
            <Heading size="4" mb="4">
              <History className="inline-block h-5 w-5 mr-2" />
              Last 7 Days
            </Heading>
            {recentEntries.length === 0 ? (
              <Text color="gray">No entries yet. Start tracking today!</Text>
            ) : (
              <Flex direction="column" gap="3">
                {recentEntries.map(entry => (
                  <Card key={entry.id} variant="surface">
                    <Flex justify="between" align="center">
                      <Box>
                        <Text weight="medium">
                          {new Date(entry.timestamp).toLocaleDateString()}
                        </Text>
                        <Flex gap="2" mt="1">
                          {entry.fiveFactor && (
                            <>
                              <Badge size="1" variant="soft">
                                <MapPin className="h-3 w-3 mr-1" />
                                {entry.fiveFactor.location}
                              </Badge>
                              <Badge size="1" variant="soft">
                                <Heart className="h-3 w-3 mr-1" />
                                {entry.fiveFactor.emotion}
                              </Badge>
                              <Badge size="1" variant="soft">
                                <Clock className="h-3 w-3 mr-1" />
                                {entry.fiveFactor.timeOfDay}
                              </Badge>
                            </>
                          )}
                        </Flex>
                      </Box>
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    </Flex>
                  </Card>
                ))}
              </Flex>
            )}
          </Card>
        </Tabs.Content>

        {/* Five-Factor Patterns */}
        <Tabs.Content value="patterns">
          <Card mt="4">
            <Heading size="4" mb="4">
              <Target className="inline-block h-5 w-5 mr-2" />
              Your Patterns
            </Heading>
            <Grid columns={{ initial: '1', md: '2' }} gap="4">
              <Card variant="surface">
                <Text weight="medium" mb="2">Most Common Location</Text>
                <Badge size="2" color="blue">
                  <MapPin className="h-3 w-3 mr-1" />
                  {habit.lastEntry?.location || 'Not tracked yet'}
                </Badge>
              </Card>
              
              <Card variant="surface">
                <Text weight="medium" mb="2">Usual Emotion</Text>
                <Badge size="2" color="green">
                  <Heart className="h-3 w-3 mr-1" />
                  {habit.lastEntry?.emotion || 'Not tracked yet'}
                </Badge>
              </Card>
              
              <Card variant="surface">
                <Text weight="medium" mb="2">Best Time</Text>
                <Badge size="2" color="purple">
                  <Clock className="h-3 w-3 mr-1" />
                  {habit.lastEntry?.timeOfDay || 'Not tracked yet'}
                </Badge>
              </Card>
              
              <Card variant="surface">
                <Text weight="medium" mb="2">Common Trigger</Text>
                <Badge size="2" color="orange">
                  <Zap className="h-3 w-3 mr-1" />
                  {habit.lastEntry?.trigger || 'Not tracked yet'}
                </Badge>
              </Card>
            </Grid>
          </Card>
        </Tabs.Content>

        {/* Milestones */}
        <Tabs.Content value="milestones">
          <Card mt="4">
            <Heading size="4" mb="4">
              <Award className="inline-block h-5 w-5 mr-2" />
              Milestones
            </Heading>
            <Flex direction="column" gap="3">
              {habit.milestones?.map(milestone => (
                <Card 
                  key={milestone.days} 
                  variant={milestone.achieved ? 'surface' : 'ghost'}
                  className={milestone.achieved ? 'bg-green-50' : ''}
                >
                  <Flex justify="between" align="center">
                    <Flex align="center" gap="3">
                      {milestone.achieved ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      ) : (
                        <Box className="h-5 w-5 border-2 border-gray-300 rounded-full" />
                      )}
                      <Box>
                        <Text weight="medium">{milestone.days} Day Milestone</Text>
                        {milestone.achievedDate && (
                          <Text size="2" color="gray">
                            Achieved on {new Date(milestone.achievedDate).toLocaleDateString()}
                          </Text>
                        )}
                      </Box>
                    </Flex>
                    {milestone.achieved && (
                      <Badge color="green" variant="soft">
                        <Award className="h-3 w-3 mr-1" />
                        Achieved
                      </Badge>
                    )}
                  </Flex>
                </Card>
              ))}
            </Flex>
          </Card>
        </Tabs.Content>

        {/* AI Insights */}
        <Tabs.Content value="insights">
          <Card mt="4">
            <Heading size="4" mb="4">
              <Brain className="inline-block h-5 w-5 mr-2" />
              AI Insights
            </Heading>
            <Flex direction="column" gap="4">
              <Card variant="surface" className="bg-gradient-to-r from-blue-50 to-purple-50">
                <Text weight="medium" mb="2">🎯 Success Pattern Detected</Text>
                <Text size="2">
                  You're most successful with this habit in the {habit.lastEntry?.timeOfDay || 'morning'} 
                  when you're feeling {habit.lastEntry?.emotion || 'motivated'}. 
                  Keep scheduling it at this time!
                </Text>
              </Card>
              
              <Card variant="surface" className="bg-gradient-to-r from-green-50 to-emerald-50">
                <Text weight="medium" mb="2">🚀 Momentum Building</Text>
                <Text size="2">
                  Your {habit.currentStreak}-day streak shows strong commitment. 
                  You're {habit.currentStreak > 21 ? 'past' : 'approaching'} the 21-day 
                  habit formation threshold!
                </Text>
              </Card>
              
              {habit.currentStreak > 7 && (
                <Card variant="surface" className="bg-gradient-to-r from-purple-50 to-pink-50">
                  <Text weight="medium" mb="2">💡 Pro Tip</Text>
                  <Text size="2">
                    Consider stacking this habit with another routine. Your consistency 
                    shows you're ready to build on this success!
                  </Text>
                </Card>
              )}
            </Flex>
          </Card>
        </Tabs.Content>
      </Tabs.Root>

      {/* Five Factor Modal */}
      {user && (
        <FiveFactorModal
          open={showFiveFactorModal}
          onClose={() => setShowFiveFactorModal(false)}
          onSubmit={(factors) => trackHabit(habit.id, factors)}
          habitTitle={habit.title}
          userId={user.uid}
        />
      )}
    </Container>
  );
}

// Add Brain import since we're using it
import { Brain } from 'lucide-react';