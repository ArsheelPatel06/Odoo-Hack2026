type LoadingOverlayProps = {
  label?: string;
};

export function LoadingOverlay({ label = "Loading" }: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-background/80 backdrop-blur-sm">
      <div className="rounded-card border border-border bg-surface px-5 py-4 shadow-panel">
        <div className="flex items-center gap-3">
          <div className="size-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="text-sm text-muted">{label}</span>
        </div>
      </div>
    </div>
  );
}
