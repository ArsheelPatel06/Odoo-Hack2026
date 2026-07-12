"use client";

import type { ReactNode } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { chartTheme } from "./chart-theme";
import { cn } from "@/shared/lib";

type ChartPoint = Record<string, string | number>;

type LineChartWrapperProps = {
  data: ChartPoint[];
  dataKey: string;
  xKey?: string;
  height?: number;
  className?: string;
  title?: ReactNode;
};

export function LineChartWrapper({
  data,
  dataKey,
  xKey = "label",
  height = 240,
  className,
  title
}: LineChartWrapperProps) {
  return (
    <div className={cn("rounded-card border border-subtle bg-card p-4 shadow-soft", className)}>
      {title ? <div className="mb-4 text-heading-sm font-medium text-primary">{title}</div> : null}
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data}>
          <CartesianGrid stroke={chartTheme.grid} strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey={xKey} tick={{ fill: chartTheme.muted, fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: chartTheme.muted, fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ borderRadius: 12, borderColor: chartTheme.grid }} />
          <Line type="monotone" dataKey={dataKey} stroke={chartTheme.accent} strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
