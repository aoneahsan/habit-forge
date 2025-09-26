import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useHabitStore } from '@/stores/habitStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Plus, Target } from 'lucide-react';
import toast from 'react-hot-toast';

export function HabitsPage() {
  const { user } = useAuthStore();
  const { habits, createHabit, fetchHabits } = useHabitStore();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'health',
    type: 'build' as 'build' | 'break',
    goal: '',
    duration: 30,
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
    motivation: ''
  });

  useEffect(() => {
    if (user) {
      fetchHabits(user.uid);
    }
  }, [user, fetchHabits]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await createHabit({
        ...formData,
        userId: user.uid,
        frequency: { type: 'daily' },
        reminders: [],
        milestones: [
          { days: 7, achieved: false },
          { days: 21, achieved: false },
          { days: 30, achieved: false },
          { days: 60, achieved: false },
          { days: 90, achieved: false }
        ],
        successCriteria: formData.goal,
        accountability: 'private'
      });
      toast.success('Habit created successfully!');
      setShowForm(false);
      setFormData({
        title: '',
        description: '',
        category: 'health',
        type: 'build',
        goal: '',
        duration: 30,
        difficulty: 'medium',
        motivation: ''
      });
    } catch (error) {
      toast.error('Failed to create habit');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Habits</h1>
          <p className="text-gray-600">Track and manage all your habits</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          New Habit
        </Button>
      </div>

      {showForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Create New Habit</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    placeholder="e.g., Morning meditation"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <select
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="health">Health</option>
                    <option value="productivity">Productivity</option>
                    <option value="learning">Learning</option>
                    <option value="fitness">Fitness</option>
                    <option value="mindfulness">Mindfulness</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Type</label>
                  <select
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as 'build' | 'break' })}
                  >
                    <option value="build">Build Habit</option>
                    <option value="break">Break Habit</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Duration (days)</label>
                  <Input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                    min="7"
                    max="365"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  placeholder="Why is this habit important to you?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Goal</label>
                <Input
                  value={formData.goal}
                  onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                  placeholder="What do you want to achieve?"
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit">Create Habit</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {habits.map((habit) => (
          <Card key={habit.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{habit.title}</CardTitle>
                  <p className="text-sm text-gray-500 capitalize">{habit.category}</p>
                </div>
                <Target className="h-5 w-5 text-primary-600" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">{habit.description}</p>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Current Streak</span>
                  <span className="font-semibold">{habit.currentStreak} days</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Completion Rate</span>
                  <span className="font-semibold">{Math.round(habit.completionRate * 100)}%</span>
                </div>
                
                <div className="mt-4">
                  <div className="text-xs text-gray-600 mb-1">Habit Strength</div>
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary-400 to-primary-600 transition-all"
                      style={{ width: `${habit.strength}%` }}
                    />
                  </div>
                </div>
              </div>

              <Button className="w-full mt-4" size="sm">
                Track Today
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {habits.length === 0 && !showForm && (
        <div className="text-center py-16">
          <Target className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No habits yet</h2>
          <p className="text-gray-600 mb-6">Start your transformation journey today</p>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Your First Habit
          </Button>
        </div>
      )}
    </div>
  );
}