/**
 * RadarChart Component
 *
 * 7-axis spider chart showing the "shape" of each agent.
 * The shape matters more than the total score.
 *
 * Uses Recharts for visualization.
 * Fill: Translucent neon green (#00FF0033)
 * Stroke: Solid neon green (#00FF00)
 */

'use client';

import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';
import { Scores, scoresToRadarData } from '@/lib/types';

interface RadarChartProps {
  scores: Scores;
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
}

const sizeConfig = {
  sm: { width: 200, height: 200 },
  md: { width: 300, height: 300 },
  lg: { width: 400, height: 400 },
};

export function RadarChart({ scores, size = 'md', showLabels = true }: RadarChartProps) {
  const data = scoresToRadarData(scores);
  const { width, height } = sizeConfig[size];

  return (
    <div className="radar-container" style={{ width, height, minWidth: width, minHeight: height }}>
      <ResponsiveContainer width={width} height={height} minWidth={width} minHeight={height}>
        <RechartsRadarChart data={data} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
          <PolarGrid
            stroke="var(--border-default)"
            strokeOpacity={0.5}
          />
          <PolarAngleAxis
            dataKey="subject"
            tick={showLabels ? {
              fill: 'var(--text-muted)',
              fontSize: 10,
              fontFamily: 'var(--font-mono)',
            } : false}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 10]}
            tick={{
              fill: 'var(--text-dim)',
              fontSize: 8,
              fontFamily: 'var(--font-mono)',
            }}
            tickCount={6}
          />
          <Radar
            name="Score"
            dataKey="value"
            stroke="var(--spirit-green)"
            strokeWidth={2}
            fill="var(--spirit-green)"
            fillOpacity={0.2}
          />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default RadarChart;
