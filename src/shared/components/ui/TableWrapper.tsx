type TableWrapperProps = {
  children?: React.ReactNode;
};

export function TableWrapper({ children }: TableWrapperProps) {
  return <div className="overflow-hidden rounded-card border border-border bg-surface">{children}</div>;
}
