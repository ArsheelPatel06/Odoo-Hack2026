type TableShellProps = {
  children?: React.ReactNode;
};

export function TableShell({ children }: TableShellProps) {
  return <div className="overflow-hidden rounded-card border border-border bg-surface">{children}</div>;
}
