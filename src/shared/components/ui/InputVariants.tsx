import type { ReactNode } from "react";
import { Search } from "lucide-react";
import { Input, type InputProps } from "./Input";
import { cn } from "@/shared/lib";

type SearchInputProps = Omit<InputProps, "type"> & {
  onValueChange?: (value: string) => void;
  icon?: ReactNode;
};

export function SearchInput({ className, icon, onValueChange, onChange, ...props }: SearchInputProps) {
  return (
    <div className={cn("relative", className)}>
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">
        {icon ?? <Search className="h-4 w-4" aria-hidden />}
      </span>
      <Input
        type="search"
        className="pl-9"
        onChange={(event) => {
          onChange?.(event);
          onValueChange?.(event.target.value);
        }}
        {...props}
      />
    </div>
  );
}

export function PasswordInput(props: Omit<InputProps, "type">) {
  return <Input type="password" autoComplete="current-password" {...props} />;
}

export function NumberInput(props: Omit<InputProps, "type">) {
  return <Input type="number" inputMode="decimal" {...props} />;
}

export function DateInput(props: Omit<InputProps, "type">) {
  return <Input type="date" {...props} />;
}
