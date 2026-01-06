"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { ScoreHistoryEntry } from "@/lib/types";

interface Props {
  history: ScoreHistoryEntry[];
  currentTotal: number;
}

export function ScoreHistoryChart({ history, currentTotal }: Props) {
  // If only one data point, show a simple display instead of a chart
  if (history.length <= 1) {
    return (
      <div className="text-center py-8 text-dim text-sm">
        <p>Score history will appear here after future reviews.</p>
        <p className="text-muted mt-2">Current score: {currentTotal}/70</p>
      </div>
    );
  }

  // Format data for recharts
  const data = history.map((entry) => ({
    date: new Date(entry.date).toLocaleDateString("en-US", {
      month: "short",
      year: "2-digit",
    }),
    total: entry.total,
    reviewer: entry.reviewer,
    fullDate: entry.date,
  }));

  return (
    <div className="w-full h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
        >
          <XAxis
            dataKey="date"
            tick={{ fill: "#6b7280", fontSize: 12 }}
            axisLine={{ stroke: "#374151" }}
            tickLine={{ stroke: "#374151" }}
          />
          <YAxis
            domain={[0, 70]}
            tick={{ fill: "#6b7280", fontSize: 12 }}
            axisLine={{ stroke: "#374151" }}
            tickLine={{ stroke: "#374151" }}
            ticks={[0, 35, 70]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#0a0a14",
              border: "1px solid #374151",
              borderRadius: "4px",
              fontSize: "12px",
            }}
            labelStyle={{ color: "#9ca3af" }}
            formatter={(value) => [`${value}/70`, "Score"]}
          />
          <ReferenceLine
            y={35}
            stroke="#374151"
            strokeDasharray="3 3"
            label={{
              value: "Median",
              position: "right",
              fill: "#6b7280",
              fontSize: 10,
            }}
          />
          <Line
            type="monotone"
            dataKey="total"
            stroke="#00ff00"
            strokeWidth={2}
            dot={{
              fill: "#00ff00",
              strokeWidth: 0,
              r: 4,
            }}
            activeDot={{
              fill: "#00ff00",
              strokeWidth: 0,
              r: 6,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
