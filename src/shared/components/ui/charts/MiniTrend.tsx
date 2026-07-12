"use client";

import { Line, LineChart, ResponsiveContainer } from "recharts";
import { chartTheme } from "./chart-theme";
import { cn } from "@/shared/lib";

type MiniTrendProps = {
  data: Array<{ value: number }>;
  height?: number;
  className?: string;
};

export function MiniTrend({ data, height = 40, className }: MiniTrendProps) {
  return (
    <div className={cn("w-24", className)}>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data}>
          <Line type="monotone" dataKey="value" stroke={chartTheme.accent} strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
