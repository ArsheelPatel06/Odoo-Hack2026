"use client";

import type { ReactNode } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { chartTheme } from "./chart-theme";
import { cn } from "@/shared/lib";

type ChartPoint = Record<string, string | number>;

type AreaChartWrapperProps = {
  data: ChartPoint[];
  dataKey: string;
  xKey?: string;
  height?: number;
  className?: string;
  title?: ReactNode;
};

export function AreaChartWrapper({
  data,
  dataKey,
  xKey = "label",
  height = 240,
  className,
  title
}: AreaChartWrapperProps) {
  return (
    <div className={cn("rounded-card border border-subtle bg-card p-4 shadow-soft", className)}>
      {title ? <div className="mb-4 text-heading-sm font-medium text-primary">{title}</div> : null}
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={chartTheme.accent} stopOpacity={0.25} />
              <stop offset="95%" stopColor={chartTheme.accent} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={chartTheme.grid} strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey={xKey} tick={{ fill: chartTheme.muted, fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: chartTheme.muted, fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ borderRadius: 12, borderColor: chartTheme.grid }} />
          <Area type="monotone" dataKey={dataKey} stroke={chartTheme.accent} fill="url(#areaFill)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
