import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth.store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Community</h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          Connect with others on their habit journey
        </p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
        {[
          { id: 'feed', label: 'Feed', icon: MessageCircle },
          { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
          { id: 'challenges', label: 'Challenges', icon: TrendingUp },
          { id: 'friends', label: 'Friends', icon: Users },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex flex-1 items-center justify-center space-x-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white'
                : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'feed' && (
        <div className="space-y-6">
          {/* Create Post */}
          <div className="card p-4">
            <div className="flex space-x-3">
              <div className="h-10 w-10 flex-shrink-0 rounded-full bg-primary-100 dark:bg-primary-900/20" />
              <div className="flex-1">
                <textarea
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder="Share your progress..."
                  className="w-full resize-none rounded-lg border border-gray-300 p-3 text-sm focus:border-primary-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800"
                  rows={3}
                />
                <div className="mt-2 flex justify-end">
                  <Button size="2" onClick={handlePost}>
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Posts */}
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="card p-4">
                <div className="flex space-x-3">
                  <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-200 dark:bg-gray-700" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {post.userName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(post.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <p className="mt-2 text-gray-700 dark:text-gray-300">{post.content}</p>
                    <div className="mt-3 flex items-center space-x-4">
                      <button className={`flex items-center space-x-1 text-sm ${
                        post.isLiked ? 'text-danger-600' : 'text-gray-500 hover:text-danger-600'
                      }`}>
                        <Heart className={`h-4 w-4 ${post.isLiked ? 'fill-current' : ''}`} />
                        <span>{post.likes}</span>
                      </button>
                      <button className="flex items-center space-x-1 text-sm text-gray-500 hover:text-primary-600">
                        <MessageCircle className="h-4 w-4" />
                        <span>{post.comments}</span>
                      </button>
                      <button className="flex items-center space-x-1 text-sm text-gray-500 hover:text-primary-600">
                        <Share2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'leaderboard' && (
        <div className="card overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold">Global Leaderboard</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Top performers this month</p>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {leaderboard.map((entry) => (
              <div
                key={entry.rank}
                className={`flex items-center justify-between p-4 ${
                  entry.isCurrentUser ? 'bg-primary-50 dark:bg-primary-900/20' : ''
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full font-bold ${
                    entry.rank <= 3
                      ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                  }`}>
                    {entry.rank}
                  </div>
                  <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {entry.name}
                      {entry.isCurrentUser && ' (You)'}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {entry.streak} day streak
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {entry.points.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">points</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'challenges' && (
        <div className="space-y-4">
          {challenges.map((challenge) => (
            <div key={challenge.id} className="card p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {challenge.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {challenge.description}
                  </p>
                  <div className="mt-4 flex items-center space-x-4 text-sm">
                    <div className="flex items-center text-gray-500">
                      <Users className="mr-1 h-4 w-4" />
                      {challenge.participants} participants
                    </div>
                    <div className="flex items-center text-gray-500">
                      <Trophy className="mr-1 h-4 w-4" />
                      {challenge.daysLeft} days left
                    </div>
                  </div>
                  {challenge.joined && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Progress</span>
                        <span className="font-medium">{challenge.progress}%</span>
                      </div>
                      <div className="mt-1 h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                        <div
                          className="h-full bg-primary-500 transition-all duration-300"
                          style={{ width: `${challenge.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
                <Button
                  size="2"
                  variant={challenge.joined ? 'outline' : 'solid'}
                  className="ml-4"
                >
                  {challenge.joined ? 'View' : 'Join'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'friends' && (
        <div className="space-y-4">
          <div className="card p-4">
            <div className="flex items-center justify-between">
              <Input
                placeholder="Search friends by username..."
                className="max-w-sm"
              />
              <Button size="2">
                <UserPlus className="mr-2 h-4 w-4" />
                Add Friend
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            {friends.map((friend) => (
              <div key={friend.id} className="card p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {friend.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {friend.mutualHabits} mutual habits • {friend.streak} day streak
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`h-2 w-2 rounded-full ${
                      friend.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                    }`} />
                    <Button size="2" variant="ghost">
                      View Profile
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}