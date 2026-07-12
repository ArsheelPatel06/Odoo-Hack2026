import { SearchInput } from "./InputVariants";
import type { InputProps } from "./Input";

type SearchBarProps = Omit<InputProps, "type">;

export function SearchBar(props: SearchBarProps) {
  return <SearchInput className="min-w-[220px] flex-1" {...props} />;
}
