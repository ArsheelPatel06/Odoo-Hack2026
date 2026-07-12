import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/shared/lib";

type AutocompleteShellProps = {
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  children?: ReactNode;
  className?: string;
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
};

export function AutocompleteShell({
  value,
  placeholder,
  onChange,
  children,
  className,
  inputProps
}: AutocompleteShellProps) {
  return (
    <div className={cn("relative", className)}>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange?.(event.target.value)}
        className={cn(
          "h-10 w-full rounded-input border border-subtle bg-surface px-3 text-sm text-primary",
          "placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/25"
        )}
        role="combobox"
        aria-expanded={Boolean(children)}
        aria-autocomplete="list"
        {...inputProps}
      />
      {children ? (
        <div
          className="absolute z-20 mt-2 w-full overflow-hidden rounded-card border border-subtle bg-popover shadow-elevated animate-slide-up"
          role="listbox"
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}
