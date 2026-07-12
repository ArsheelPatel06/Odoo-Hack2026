import type { InputHTMLAttributes } from "react";
import { cn } from "@/shared/lib";

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

export function Checkbox({ className, ...props }: CheckboxProps) {
  return (
    <input
      type="checkbox"
      className={cn(
        "h-4 w-4 rounded border-subtle bg-surface text-accent accent-accent",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/25",
        className
      )}
      {...props}
    />
  );
}

type RadioProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

export function Radio({ className, ...props }: RadioProps) {
  return (
    <input
      type="radio"
      className={cn(
        "h-4 w-4 border-subtle bg-surface text-accent accent-accent",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/25",
        className
      )}
      {...props}
    />
  );
}

type SwitchProps = {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
  className?: string;
};

export function Switch({ checked, onCheckedChange, disabled, id, className }: SwitchProps) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onCheckedChange?.(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 rounded-full border border-subtle transition-colors duration-200",
        checked ? "bg-accent" : "bg-muted-surface",
        disabled && "opacity-50",
        className
      )}
    >
      <span
        className={cn(
          "pointer-events-none inline-block h-5 w-5 translate-x-0.5 rounded-full bg-surface shadow-soft transition-transform duration-200",
          checked && "translate-x-[22px]"
        )}
      />
    </button>
  );
}
