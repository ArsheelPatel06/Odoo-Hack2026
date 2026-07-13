import { cn } from "@/shared/lib";

type CircularGaugeProps = {
  value: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
};

export function CircularGauge({
  value,
  size = 48,
  strokeWidth = 4,
  className
}: CircularGaugeProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  let colorClass = "text-emerald-500";
  if (value < 50) colorClass = "text-rose-500";
  else if (value < 80) colorClass = "text-amber-500";
  else if (value < 90) colorClass = "text-indigo-500";

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)} style={{ width: size, height: size }}>
      {/* Background Circle */}
      <svg className="absolute inset-0 -rotate-90 transform" width={size} height={size}>
        <circle
          className="text-slate-100"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Progress Circle */}
        <circle
          className={cn("transition-all duration-1000 ease-out", colorClass)}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      {/* Center Value */}
      <span className="text-[10px] font-bold text-slate-700">{value}%</span>
    </div>
  );
}
