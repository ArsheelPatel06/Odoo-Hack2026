"use client";

import type { ReactNode } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { chartPalette, chartTheme } from "./chart-theme";
import { cn } from "@/shared/lib";

type DonutPoint = { name: string; value: number };

type DonutChartWrapperProps = {
  data: DonutPoint[];
  height?: number;
  className?: string;
  title?: ReactNode;
};

export function DonutChartWrapper({ data, height = 240, className, title }: DonutChartWrapperProps) {
  return (
    <div className={cn("rounded-card border border-subtle bg-card p-4 shadow-soft", className)}>
      {title ? <div className="mb-4 text-heading-sm font-medium text-primary">{title}</div> : null}
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Tooltip contentStyle={{ borderRadius: 12, borderColor: chartTheme.grid }} />
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} paddingAngle={2}>
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={chartPalette[index % chartPalette.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
