"use client";

import type { ReactNode } from "react";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState
} from "@tanstack/react-table";
import { useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { cn } from "@/shared/lib";
import { EmptyState } from "../Common";
import { LoadingSkeleton } from "../Common";
import { TablePagination } from "./TablePagination";
import { TableToolbar } from "./TableToolbar";

export type DataTableProps<TData> = {
  columns: ColumnDef<TData, unknown>[];
  data: TData[];
  loading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  toolbar?: ReactNode;
  enableSelection?: boolean;
  density?: "comfortable" | "compact";
  className?: string;
  page?: number;
  pageSize?: number;
  total?: number;
  onPageChange?: (page: number) => void;
};

export function DataTable<TData>({
  columns,
  data,
  loading,
  emptyTitle = "No records found",
  emptyDescription,
  toolbar,
  density = "comfortable",
  className,
  page = 1,
  pageSize = 10,
  total,
  onPageChange
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel()
  });

  const cellPadding = density === "compact" ? "px-3 py-2" : "px-4 py-3";

  return (
    <div className={cn("overflow-hidden rounded-card border border-subtle bg-surface shadow-soft", className)}>
      {toolbar ? <TableToolbar>{toolbar}</TableToolbar> : null}

      <div className="overflow-x-auto">
        <table className="w-full min-w-full text-left text-sm">
          <thead className="sticky top-0 z-10 border-b border-subtle bg-muted-surface/80 backdrop-blur">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const sorted = header.column.getIsSorted();

                  return (
                    <th key={header.id} className={cn(cellPadding, "text-label text-muted")}>
                      {header.isPlaceholder ? null : (
                        <button
                          type="button"
                          className={cn(
                            "inline-flex items-center gap-1",
                            header.column.getCanSort() && "cursor-pointer select-none hover:text-primary"
                          )}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {header.column.getCanSort() ? (
                            sorted === "asc" ? (
                              <ArrowUp className="h-3.5 w-3.5" />
                            ) : sorted === "desc" ? (
                              <ArrowDown className="h-3.5 w-3.5" />
                            ) : (
                              <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />
                            )
                          ) : null}
                        </button>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index} className="border-b border-subtle/70">
                    {columns.map((_, colIndex) => (
                      <td key={colIndex} className={cellPadding}>
                        <LoadingSkeleton className="h-4 w-full" />
                      </td>
                    ))}
                  </tr>
                ))
              : table.getRowModel().rows.length === 0
                ? (
                    <tr>
                      <td colSpan={columns.length} className="p-6">
                        <EmptyState title={emptyTitle} description={emptyDescription} />
                      </td>
                    </tr>
                  )
                : table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      className="border-b border-subtle/70 transition-colors duration-150 hover:bg-muted-surface/60"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className={cn(cellPadding, "text-body-md text-secondary")}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
          </tbody>
        </table>
      </div>

      {onPageChange && total !== undefined ? (
        <TablePagination page={page} pageSize={pageSize} total={total} onPageChange={onPageChange} />
      ) : null}
    </div>
  );
}

type TableWrapperProps = {
  children?: ReactNode;
  className?: string;
};

export function TableWrapper({ children, className }: TableWrapperProps) {
  return (
    <div className={cn("overflow-hidden rounded-card border border-subtle bg-surface shadow-soft", className)}>
      {children}
    </div>
  );
}
