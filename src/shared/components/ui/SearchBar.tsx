import type { InputHTMLAttributes } from "react";
import { Search } from "lucide-react";
import { Input } from "./Input";

type SearchBarProps = InputHTMLAttributes<HTMLInputElement>;

export function SearchBar({ className, ...props }: SearchBarProps) {
  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
      <Input className={`pl-9 ${className ?? ""}`} placeholder="Search" type="search" {...props} />
    </div>
  );
}
