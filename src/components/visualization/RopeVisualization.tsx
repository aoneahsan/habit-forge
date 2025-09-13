import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import type { Habit } from '@/types/habit.types';

interface RopeVisualizationProps {
  habits: Habit[];
  currentStreak: number;
  maxStreak?: number;
}

export function RopeVisualization({ habits, currentStreak, maxStreak = 30 }: RopeVisualizationProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Calculate rope strength based on habits and streaks
  const calculateRopeStrength = () => {
    const activeHabits = habits.filter(h => h.status === 'active');
    const avgStreak = activeHabits.reduce((acc, h) => acc + (h.streak || 0), 0) / (activeHabits.length || 1);
    const completionRate = activeHabits.filter(h => {
      const today = new Date().toDateString();
      return h.lastCompletedAt && new Date(h.lastCompletedAt).toDateString() === today;
    }).length / (activeHabits.length || 1);
    
    // Strength is combination of current streak, average (habit.streak || 0)s, and today's completion
    const strength = (currentStreak / maxStreak) * 0.4 + 
                    (avgStreak / maxStreak) * 0.3 + 
                    completionRate * 0.3;
    
    return Math.min(1, Math.max(0, strength));
  };

  const strength = calculateRopeStrength();

  // Rope states: frayed (0-0.3), worn (0.3-0.6), strong (0.6-0.9), unbreakable (0.9-1)
  const getRopeState = (strength: number) => {
    if (strength < 0.3) return { state: 'frayed', color: '#ef4444', thickness: 3 };
    if (strength < 0.6) return { state: 'worn', color: '#f59e0b', thickness: 5 };
    if (strength < 0.9) return { state: 'strong', color: '#10b981', thickness: 7 };
    return { state: 'unbreakable', color: '#8b5cf6', thickness: 9 };
  };

  const ropeState = getRopeState(strength);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height: 300 });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    if (!svgRef.current || dimensions.width === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const { width, height } = dimensions;
    const margin = { top: 40, right: 40, bottom: 60, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Create main group
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create gradient for rope
    const gradient = svg.append('defs')
      .append('linearGradient')
      .attr('id', 'rope-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '0%');

    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', ropeState.color)
      .attr('stop-opacity', 0.8);

    gradient.append('stop')
      .attr('offset', '50%')
      .attr('stop-color', ropeState.color)
      .attr('stop-opacity', 1);

    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', ropeState.color)
      .attr('stop-opacity', 0.8);

    // Generate rope path with wave based on strength
    const numPoints = 50;
    const amplitude = (1 - strength) * 20 + 5; // Less wave when stronger
    const frequency = 4;
    
    const ropePoints: [number, number][] = [];
    for (let i = 0; i <= numPoints; i++) {
      const x = (i / numPoints) * innerWidth;
      const baseY = innerHeight / 2;
      const waveY = Math.sin((i / numPoints) * Math.PI * frequency) * amplitude;
      const randomY = (Math.random() - 0.5) * (1 - strength) * 10; // Add fraying effect
      ropePoints.push([x, baseY + waveY + randomY]);
    }

    // Create line generator
    const line = d3.line<[number, number]>()
      .x(d => d[0])
      .y(d => d[1])
      .curve(d3.curveBasis);

    // Draw rope shadow
    g.append('path')
      .datum(ropePoints)
      .attr('d', line)
      .attr('fill', 'none')
      .attr('stroke', '#000')
      .attr('stroke-width', ropeState.thickness + 2)
      .attr('stroke-opacity', 0.1)
      .attr('transform', 'translate(2, 2)');

    // Draw main rope
    const ropePath = g.append('path')
      .datum(ropePoints)
      .attr('d', line)
      .attr('fill', 'none')
      .attr('stroke', 'url(#rope-gradient)')
      .attr('stroke-width', ropeState.thickness)
      .attr('stroke-linecap', 'round')
      .attr('stroke-linejoin', 'round');

    // Animate rope drawing
    const totalLength = ropePath.node()?.getTotalLength() || 0;
    ropePath
      .attr('stroke-dasharray', totalLength)
      .attr('stroke-dashoffset', totalLength)
      .transition()
      .duration(1500)
      .ease(d3.easeQuadInOut)
      .attr('stroke-dashoffset', 0);

    // Draw rope fibers for texture
    if (strength < 0.6) {
      const fiberCount = Math.floor((1 - strength) * 10);
      for (let i = 0; i < fiberCount; i++) {
        const startIdx = Math.floor(Math.random() * (numPoints - 10));
        const fiberPoints = ropePoints.slice(startIdx, startIdx + 5);
        
        g.append('path')
          .datum(fiberPoints)
          .attr('d', line)
          .attr('fill', 'none')
          .attr('stroke', ropeState.color)
          .attr('stroke-width', 1)
          .attr('stroke-opacity', 0.3)
          .attr('transform', `translate(0, ${(Math.random() - 0.5) * 10})`);
      }
    }

    // Add knots at habit positions
    const knotPositions = habits
      .filter(h => h.status === 'active' && (h.streak || 0) > 0)
      .slice(0, 5)
      .map((h, i) => ({
        x: ((i + 1) / 6) * innerWidth,
        y: innerHeight / 2,
        strength: Math.min(1, (h.streak || 0) / 30),
        name: h.name,
      }));

    // Draw knots
    const knots = g.selectAll('.knot')
      .data(knotPositions)
      .enter()
      .append('g')
      .attr('class', 'knot')
      .attr('transform', d => `translate(${d.x}, ${d.y})`);

    knots.append('circle')
      .attr('r', d => 4 + d.strength * 4)
      .attr('fill', ropeState.color)
      .attr('fill-opacity', 0.8)
      .attr('stroke', '#fff')
      .attr('stroke-width', 1);

    // Add tooltips for knots
    knots.append('title')
      .text(d => d.name);

    // Add labels
    g.append('text')
      .attr('x', innerWidth / 2)
      .attr('y', -10)
      .attr('text-anchor', 'middle')
      .attr('class', 'text-lg font-semibold fill-gray-900 dark:fill-white')
      .text('Your Habit Rope');

    g.append('text')
      .attr('x', innerWidth / 2)
      .attr('y', innerHeight + 40)
      .attr('text-anchor', 'middle')
      .attr('class', 'text-sm fill-gray-600 dark:fill-gray-400')
      .text(`Strength: ${Math.round(strength * 100)}% - ${ropeState.state.charAt(0).toUpperCase() + ropeState.state.slice(1)}`);

    // Add strength indicator bar
    const barHeight = 8;
    const barY = innerHeight + 15;

    // Background bar
    g.append('rect')
      .attr('x', 0)
      .attr('y', barY)
      .attr('width', innerWidth)
      .attr('height', barHeight)
      .attr('rx', barHeight / 2)
      .attr('fill', '#e5e7eb')
      .attr('class', 'dark:fill-gray-700');

    // Strength bar
    g.append('rect')
      .attr('x', 0)
      .attr('y', barY)
      .attr('width', 0)
      .attr('height', barHeight)
      .attr('rx', barHeight / 2)
      .attr('fill', ropeState.color)
      .transition()
      .duration(1500)
      .delay(500)
      .ease(d3.easeQuadInOut)
      .attr('width', innerWidth * strength);

  }, [dimensions, habits, strength, ropeState]);

  return (
    <div ref={containerRef} className="w-full">
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        className="w-full"
      />
      
      {/* Legend */}
      <div className="mt-4 grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
        <div className="flex items-center">
          <div className="mr-2 h-3 w-3 rounded-full bg-red-500"></div>
          <span className="text-gray-600 dark:text-gray-400">Frayed (0-30%)</span>
        </div>
        <div className="flex items-center">
          <div className="mr-2 h-3 w-3 rounded-full bg-amber-500"></div>
          <span className="text-gray-600 dark:text-gray-400">Worn (30-60%)</span>
        </div>
        <div className="flex items-center">
          <div className="mr-2 h-3 w-3 rounded-full bg-green-500"></div>
          <span className="text-gray-600 dark:text-gray-400">Strong (60-90%)</span>
        </div>
        <div className="flex items-center">
          <div className="mr-2 h-3 w-3 rounded-full bg-purple-500"></div>
          <span className="text-gray-600 dark:text-gray-400">Unbreakable (90%+)</span>
        </div>
      </div>
    </div>
  );
}