type TimelineShellProps = {
  children?: React.ReactNode;
};

export function TimelineShell({ children }: TimelineShellProps) {
  return <ol className="grid gap-3">{children}</ol>;
}
