"use client";

import { ChevronsUpDown } from "lucide-react";
import { WORKSPACES } from "@/shared/domain/constants/shell";
import { Button } from "@/shared/components/ui";
import { Dropdown } from "@/shared/components/ui/Overlays";
import { useShellStore } from "@/shared/store/shell-store";
import { cn } from "@/shared/lib";

type WorkspaceSwitcherProps = {
  className?: string;
};

export function WorkspaceSwitcher({ className }: WorkspaceSwitcherProps) {
  const { activeWorkspaceId, setActiveWorkspaceId } = useShellStore();
  const activeWorkspace = WORKSPACES.find((workspace) => workspace.id === activeWorkspaceId) ?? WORKSPACES[0];

  return (
    <Dropdown
      align="end"
      className={className}
      trigger={
        <Button variant="outline" size="sm" className="hidden max-w-[220px] gap-2 lg:inline-flex">
          <span className="grid size-6 place-items-center rounded-input bg-accent/10 text-[10px] font-semibold text-accent">
            {activeWorkspace.initials}
          </span>
          <span className="min-w-0 truncate text-left">
            <span className="block truncate text-body-sm font-medium text-primary">{activeWorkspace.label}</span>
            <span className="block truncate text-caption text-muted">{activeWorkspace.region}</span>
          </span>
          <ChevronsUpDown className="size-3.5 shrink-0 text-muted" />
        </Button>
      }
      items={WORKSPACES.map((workspace) => ({
        id: workspace.id,
        label: workspace.label,
        onSelect: () => setActiveWorkspaceId(workspace.id)
      }))}
    />
  );
}

export function WorkspaceBadge() {
  const { activeWorkspaceId } = useShellStore();
  const activeWorkspace = WORKSPACES.find((workspace) => workspace.id === activeWorkspaceId) ?? WORKSPACES[0];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-button border border-subtle bg-muted-surface px-2.5 py-1 text-caption text-muted lg:hidden"
      )}
    >
      <span className="grid size-5 place-items-center rounded-input bg-accent/10 text-[9px] font-semibold text-accent">
        {activeWorkspace.initials}
      </span>
      {activeWorkspace.label}
    </span>
  );
}
