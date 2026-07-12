"use client";

import type { ReactNode } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { chartPalette, chartTheme } from "./chart-theme";
import { cn } from "@/shared/lib";

type ChartPoint = Record<string, string | number>;

type BarChartWrapperProps = {
  data: ChartPoint[];
  dataKey: string;
  xKey?: string;
  height?: number;
  className?: string;
  title?: ReactNode;
};

export function BarChartWrapper({
  data,
  dataKey,
  xKey = "label",
  height = 240,
  className,
  title
}: BarChartWrapperProps) {
  return (
    <div className={cn("rounded-card border border-subtle bg-card p-4 shadow-soft", className)}>
      {title ? <div className="mb-4 text-heading-sm font-medium text-primary">{title}</div> : null}
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data}>
          <CartesianGrid stroke={chartTheme.grid} strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey={xKey} tick={{ fill: chartTheme.muted, fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: chartTheme.muted, fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ borderRadius: 12, borderColor: chartTheme.grid }} />
          <Bar dataKey={dataKey} fill={chartPalette[0]} radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
