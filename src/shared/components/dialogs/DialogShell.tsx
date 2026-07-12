type DialogShellProps = {
  title: string;
  children?: React.ReactNode;
};

export function DialogShell({ title, children }: DialogShellProps) {
  return (
    <div role="dialog" aria-label={title}>
      {children}
    </div>
  );
}
