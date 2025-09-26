import { useEffect, useRef, useState } from 'react';
import { Box, Card, Flex, Heading, Text, Badge, Progress } from '@radix-ui/themes';
import { Layers, Zap, TrendingUp, Award, Sparkles } from 'lucide-react';
import type { RopeVisualization as RopeVizType } from '@/types';

interface RopeVisualizationProps {
  streak: number;
  ropeData: RopeVizType;
  habitTitle: string;
}

export function RopeVisualization({ streak, ropeData, habitTitle }: RopeVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isAnimating, setIsAnimating] = useState(true);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth * 2; // Retina display
    canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);

    let time = 0;
    const animate = () => {
      if (!isAnimating) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 4;
      const centerY = canvas.height / 4;

      // Draw rope strands
      for (let strand = 0; strand < ropeData.strands; strand++) {
        const offset = (strand - ropeData.strands / 2) * (ropeData.thickness / 2);
        
        ctx.beginPath();
        ctx.strokeStyle = ropeData.color;
        ctx.lineWidth = ropeData.thickness;
        ctx.lineCap = 'round';

        // Create a wavy rope effect
        for (let x = 0; x < canvas.width / 2; x++) {
          const y = centerY + 
            Math.sin((x / 50) + time + (strand * 0.5)) * 20 +
            Math.cos((x / 30) + time * 1.5 + (strand * 0.3)) * 10 +
            offset;
          
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        
        ctx.stroke();
      }

      // Draw glow effect
      if (ropeData.glowIntensity > 0) {
        ctx.shadowBlur = 20 * ropeData.glowIntensity;
        ctx.shadowColor = ropeData.color;
        
        // Redraw with glow
        for (let strand = 0; strand < Math.min(3, ropeData.strands); strand++) {
          const offset = (strand - 1) * (ropeData.thickness / 2);
          
          ctx.beginPath();
          ctx.strokeStyle = ropeData.color + '80'; // Semi-transparent
          ctx.lineWidth = ropeData.thickness * 0.5;
          
          for (let x = 0; x < canvas.width / 2; x++) {
            const y = centerY + 
              Math.sin((x / 50) + time + (strand * 0.5)) * 20 +
              offset;
            
            if (x === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          }
          
          ctx.stroke();
        }
        
        ctx.shadowBlur = 0;
      }

      // Add sparkle effects for high streaks
      if (ropeData.effects.includes('shimmer') || ropeData.effects.includes('radiate')) {
        const sparkleCount = Math.floor(ropeData.glowIntensity * 10);
        for (let i = 0; i < sparkleCount; i++) {
          const sparkleX = Math.random() * (canvas.width / 2);
          const sparkleY = centerY + (Math.random() - 0.5) * 60;
          const sparkleSize = Math.random() * 3 + 1;
          
          ctx.fillStyle = '#ffffff' + Math.floor(Math.random() * 100 + 155).toString(16);
          ctx.beginPath();
          ctx.arc(sparkleX, sparkleY, sparkleSize, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      time += 0.05;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [ropeData, isAnimating]);

  const getMilestoneText = () => {
    if (streak >= 90) return 'Steel Cable - Unbreakable!';
    if (streak >= 60) return 'Thick Rope - Nearly Indestructible!';
    if (streak >= 45) return 'Strong Rope - Very Durable!';
    if (streak >= 30) return 'Cord - Solid and Reliable!';
    if (streak >= 21) return 'Twine - Getting Stronger!';
    if (streak >= 14) return 'String - Building Consistency!';
    if (streak >= 7) return 'Yarn - Forming Patterns!';
    if (streak >= 3) return 'Thin String - Just Starting!';
    return 'Thread - Fragile Beginning';
  };

  const getNextMilestone = () => {
    const milestones = [3, 7, 14, 21, 30, 45, 60, 90];
    return milestones.find(m => m > streak) || 100;
  };

  const nextMilestone = getNextMilestone();
  const progressToNext = ((streak % nextMilestone) / nextMilestone) * 100;

  return (
    <Card size="4" className="overflow-hidden">
      <Flex direction="column" gap="4">
        <Flex justify="between" align="center">
          <Flex align="center" gap="2">
            <Layers className="h-6 w-6 text-blue-600" />
            <Heading size="5">Rope Strength Visualization</Heading>
          </Flex>
          <Badge 
            size="2" 
            color={streak >= 30 ? 'gold' : streak >= 14 ? 'purple' : streak >= 7 ? 'blue' : 'gray'}
          >
            {getMilestoneText()}
          </Badge>
        </Flex>

        {/* Canvas for rope animation */}
        <Box className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden">
          <canvas
            ref={canvasRef}
            className="w-full h-48"
            onMouseEnter={() => setIsAnimating(true)}
            onMouseLeave={() => setIsAnimating(false)}
          />
          
          {/* Overlay info */}
          <Box className="absolute top-4 left-4">
            <Badge size="3" variant="solid" className="bg-black/70 text-white">
              <Zap className="h-3 w-3 mr-1" />
              {ropeData.material}
            </Badge>
          </Box>
          
          <Box className="absolute bottom-4 right-4">
            <Badge size="3" variant="solid" className="bg-black/70 text-white">
              <TrendingUp className="h-3 w-3 mr-1" />
              {streak} days
            </Badge>
          </Box>
        </Box>

        {/* Rope Properties */}
        <Grid columns="3" gap="4">
          <Card variant="surface">
            <Flex direction="column" align="center" gap="2">
              <Text size="1" color="gray">Thickness</Text>
              <Text size="3" weight="bold">{ropeData.thickness}mm</Text>
              <Progress value={ropeData.thickness * 10} size="1" />
            </Flex>
          </Card>
          
          <Card variant="surface">
            <Flex direction="column" align="center" gap="2">
              <Text size="1" color="gray">Strands</Text>
              <Text size="3" weight="bold">{ropeData.strands}</Text>
              <Progress value={ropeData.strands * 5} size="1" />
            </Flex>
          </Card>
          
          <Card variant="surface">
            <Flex direction="column" align="center" gap="2">
              <Text size="1" color="gray">Strength</Text>
              <Text size="3" weight="bold">{Math.round((streak / 90) * 100)}%</Text>
              <Progress value={(streak / 90) * 100} size="1" />
            </Flex>
          </Card>
        </Grid>

        {/* Progress to next milestone */}
        <Box>
          <Flex justify="between" mb="2">
            <Text size="2" color="gray">Progress to {nextMilestone}-day milestone</Text>
            <Text size="2" weight="bold">{streak}/{nextMilestone}</Text>
          </Flex>
          <Progress value={progressToNext} size="3" color="green" />
        </Box>

        {/* Effects */}
        {ropeData.effects.length > 0 && (
          <Flex gap="2" wrap="wrap">
            {ropeData.effects.map(effect => (
              <Badge key={effect} variant="soft" color="purple">
                <Sparkles className="h-3 w-3 mr-1" />
                {effect}
              </Badge>
            ))}
          </Flex>
        )}

        {/* Motivational Message */}
        <Card variant="surface" className="bg-gradient-to-r from-blue-50 to-purple-50">
          <Flex align="center" gap="3">
            <Award className="h-6 w-6 text-gold-600" />
            <Box>
              <Text weight="bold">
                {streak >= 21 
                  ? 'Amazing! Your habit is becoming automatic!'
                  : 'Keep going! Every day makes your rope stronger!'}
              </Text>
              <Text size="2" color="gray">
                {streak >= 21
                  ? `You've been consistent for ${streak} days. This habit is now part of who you are!`
                  : `Just ${21 - streak} more days until your habit becomes automatic!`}
              </Text>
            </Box>
          </Flex>
        </Card>
      </Flex>
    </Card>
  );
}

// Grid utility - Add this type since we're using it
declare module '@radix-ui/themes' {
  interface BoxProps {
    columns?: string;
  }
}

const Grid = ({ children, columns, gap }: { children: React.ReactNode; columns: string; gap: string }) => (
  <Box style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: `${gap}px` }}>
    {children}
  </Box>
);