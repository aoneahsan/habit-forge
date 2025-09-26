import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Box } from '@radix-ui/themes';
import type { RopeState } from '@/types';

interface RopeVisualizationProps {
  ropeState: RopeState;
  width?: number;
  height?: number;
  animate?: boolean;
}

export function RopeVisualization({ 
  ropeState, 
  width = 300, 
  height = 400,
  animate = true 
}: RopeVisualizationProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Create gradient for rope material
    const gradient = svg.append('defs')
      .append('linearGradient')
      .attr('id', 'rope-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '100%');

    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', ropeState.color)
      .attr('stop-opacity', 0.8);

    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', ropeState.color)
      .attr('stop-opacity', 1);

    // Create glow effect
    if (ropeState.glowIntensity > 0) {
      const filter = svg.append('defs')
        .append('filter')
        .attr('id', 'glow');

      filter.append('feGaussianBlur')
        .attr('stdDeviation', ropeState.glowIntensity / 10)
        .attr('result', 'coloredBlur');

      const feMerge = filter.append('feMerge');
      feMerge.append('feMergeNode').attr('in', 'coloredBlur');
      feMerge.append('feMergeNode').attr('in', 'SourceGraphic');
    }

    // Draw rope strands
    const centerX = width / 2;
    const strandSpacing = Math.min(ropeState.thickness / 2, 10);
    
    for (let i = 0; i < ropeState.strands; i++) {
      const offsetX = (i - ropeState.strands / 2) * strandSpacing;
      
      const path = d3.path();
      path.moveTo(centerX + offsetX, 20);
      
      // Create twisted rope effect
      for (let y = 20; y <= height - 20; y += 10) {
        const twist = Math.sin((y / 30) + (i * Math.PI / ropeState.strands)) * 5;
        path.lineTo(centerX + offsetX + twist, y);
      }

      const strand = svg.append('path')
        .attr('d', path.toString())
        .attr('stroke', 'url(#rope-gradient)')
        .attr('stroke-width', ropeState.thickness / ropeState.strands)
        .attr('fill', 'none')
        .attr('stroke-linecap', 'round')
        .attr('filter', ropeState.glowIntensity > 0 ? 'url(#glow)' : null);

      if (animate) {
        strand
          .attr('stroke-dasharray', height)
          .attr('stroke-dashoffset', height)
          .transition()
          .duration(1500)
          .ease(d3.easeCubicOut)
          .attr('stroke-dashoffset', 0);
      }
    }

    // Add material texture overlay
    if (ropeState.material !== 'thread') {
      const textureOpacity = {
        'string': 0.1,
        'cord': 0.2,
        'rope': 0.3,
        'cable': 0.4
      }[ropeState.material] || 0.1;

      svg.append('rect')
        .attr('width', width)
        .attr('height', height)
        .attr('fill', ropeState.color)
        .attr('opacity', textureOpacity)
        .attr('mix-blend-mode', 'multiply');
    }

  }, [ropeState, width, height, animate]);

  return (
    <Box>
      <svg 
        ref={svgRef} 
        width={width} 
        height={height}
      />
    </Box>
  );
}