type ChartShellProps = {
  title: string;
  children?: React.ReactNode;
};

export function ChartShell({ title, children }: ChartShellProps) {
  return (
    <section className="rounded-card border border-border bg-surface p-4">
      <h2 className="text-sm font-medium text-muted">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}
