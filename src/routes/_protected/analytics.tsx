import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { getUserHabits, getHabitCompletions } from '@/services/firebase/habit.service';
import { useAuthStore } from '@/stores/auth.store';
import { RopeVisualization } from '@/components/visualization/RopeVisualization';
import { BarChart3, TrendingUp, Calendar, Award } from 'lucide-react';
import { useState, useMemo } from 'react';
import * as d3 from 'd3';
import { useEffect, useRef } from 'react';

export const Route = createFileRoute('/_protected/analytics')({
  component: AnalyticsPage,
});

function AnalyticsPage() {
  const user = useAuthStore((state) => state.user);
  const userProfile = useAuthStore((state) => state.userProfile);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');

  const { data: habits = [] } = useQuery({
    queryKey: ['habits', user?.uid],
    queryFn: () => getUserHabits(user?.uid!),
    enabled: !!user?.uid,
  });

  // Calculate analytics data
  const analytics = useMemo(() => {
    const now = new Date();
    const activeHabits = habits.filter(h => h.status === 'active');
    
    // Completion rate
    const todayCompletions = activeHabits.filter(h => {
      const today = now.toDateString();
      return h.lastCompletedAt && new Date(h.lastCompletedAt).toDateString() === today;
    }).length;
    const completionRate = activeHabits.length > 0 
      ? (todayCompletions / activeHabits.length) * 100 
      : 0;

    // Category distribution
    const categoryCount = habits.reduce((acc, h) => {
      acc[h.category] = (acc[h.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Best performing habits
    const topHabits = [...habits]
      .sort((a, b) => b.streak - a.streak)
      .slice(0, 5);

    // Weekly progress data
    const weekData = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(now);
      date.setDate(date.getDate() - (6 - i));
      return {
        day: date.toLocaleDateString('en', { weekday: 'short' }),
        date: date.toDateString(),
        completed: Math.floor(Math.random() * activeHabits.length), // Mock data
        total: activeHabits.length,
      };
    });

    return {
      completionRate,
      categoryCount,
      topHabits,
      weekData,
      totalPoints: userProfile?.stats?.totalPoints || 0,
      currentStreak: userProfile?.stats?.currentStreak || 0,
      longestStreak: userProfile?.stats?.longestStreak || 0,
      totalCompletions: habits.reduce((acc, h) => acc + h.totalCompletions, 0),
    };
  }, [habits, userProfile]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics</h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          Track your progress and discover insights
        </p>
      </div>

      {/* Time Range Selector */}
      <div className="flex space-x-2">
        {(['week', 'month', 'year'] as const).map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              timeRange === range
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            {range.charAt(0).toUpperCase() + range.slice(1)}
          </button>
        ))}
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Completion Rate</p>
              <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                {analytics.completionRate.toFixed(0)}%
              </p>
            </div>
            <div className="rounded-lg bg-green-100 p-3 dark:bg-green-900/20">
              <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Current Streak</p>
              <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                {analytics.currentStreak} days
              </p>
            </div>
            <div className="rounded-lg bg-orange-100 p-3 dark:bg-orange-900/20">
              <Calendar className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Points</p>
              <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                {analytics.totalPoints.toLocaleString()}
              </p>
            </div>
            <div className="rounded-lg bg-purple-100 p-3 dark:bg-purple-900/20">
              <Award className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Completions</p>
              <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                {analytics.totalCompletions}
              </p>
            </div>
            <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-900/20">
              <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Rope Visualization */}
      <div className="card p-6">
        <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
          Habit Rope Strength
        </h2>
        <RopeVisualization 
          habits={habits} 
          currentStreak={analytics.currentStreak}
          maxStreak={30}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Weekly Progress */}
        <div className="card p-6">
          <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
            Weekly Progress
          </h2>
          <WeeklyProgressChart data={analytics.weekData} />
        </div>

        {/* Category Distribution */}
        <div className="card p-6">
          <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
            Habits by Category
          </h2>
          <CategoryChart data={analytics.categoryCount} />
        </div>
      </div>

      {/* Top Performing Habits */}
      <div className="card p-6">
        <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
          Top Performing Habits
        </h2>
        <div className="space-y-3">
          {analytics.topHabits.length > 0 ? (
            analytics.topHabits.map((habit, index) => (
              <div key={habit.id} className="flex items-center justify-between rounded-lg border p-3 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-600 dark:bg-primary-900/20 dark:text-primary-400">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{habit.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{habit.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {habit.streak} day streak
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {habit.totalCompletions} completions
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No habits yet</p>
          )}
        </div>
      </div>
    </div>
  );
}

// Weekly Progress Chart Component
function WeeklyProgressChart({ data }: { data: any[] }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const { width } = container.getBoundingClientRect();
    const height = 200;
    const margin = { top: 20, right: 20, bottom: 40, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Scales
    const xScale = d3.scaleBand()
      .domain(data.map(d => d.day))
      .range([0, innerWidth])
      .padding(0.3);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.total) || 1])
      .nice()
      .range([innerHeight, 0]);

    // Bars
    g.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => xScale(d.day) || 0)
      .attr('y', innerHeight)
      .attr('width', xScale.bandwidth())
      .attr('height', 0)
      .attr('fill', '#10b981')
      .transition()
      .duration(500)
      .delay((_, i) => i * 50)
      .attr('y', d => yScale(d.completed))
      .attr('height', d => innerHeight - yScale(d.completed));

    // X Axis
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale))
      .attr('class', 'text-gray-600 dark:text-gray-400');

    // Y Axis
    g.append('g')
      .call(d3.axisLeft(yScale).ticks(5))
      .attr('class', 'text-gray-600 dark:text-gray-400');

  }, [data]);

  return (
    <div ref={containerRef} className="w-full">
      <svg ref={svgRef} width="100%" height={200} />
    </div>
  );
}

// Category Chart Component
function CategoryChart({ data }: { data: Record<string, number> }) {
  const categories = Object.entries(data).sort((a, b) => b[1] - a[1]);
  const total = Object.values(data).reduce((acc, val) => acc + val, 0);

  const colors: Record<string, string> = {
    health: 'bg-green-500',
    productivity: 'bg-blue-500',
    mindfulness: 'bg-purple-500',
    fitness: 'bg-orange-500',
    learning: 'bg-yellow-500',
    social: 'bg-pink-500',
    finance: 'bg-indigo-500',
    creativity: 'bg-cyan-500',
    other: 'bg-gray-500',
  };

  return (
    <div className="space-y-3">
      {categories.length > 0 ? (
        categories.map(([category, count]) => {
          const percentage = (count / total) * 100;
          return (
            <div key={category}>
              <div className="flex justify-between text-sm">
                <span className="capitalize text-gray-700 dark:text-gray-300">{category}</span>
                <span className="font-medium">{count} habits</span>
              </div>
              <div className="mt-1 h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  className={`h-full transition-all duration-500 ${colors[category] || colors.other}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })
      ) : (
        <p className="text-center text-gray-500">No habits yet</p>
      )}
    </div>
  );
}