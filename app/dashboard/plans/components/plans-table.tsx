"use client";

import { useRouter } from "next/navigation";
import { format } from "date-fns";
import type { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/shared/data-table";
import type { Plan } from "@/lib/types";
import { generateAvatarFallback } from "@/lib/utils";

export function PlansTable({ data }: { data: Plan[] }) {
  const router = useRouter();

  const columns: ColumnDef<Plan, unknown>[] = [
    {
      id: "user",
      header: "Member",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>
              {generateAvatarFallback(row.original.user?.fullName ?? "Member")}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="truncate font-medium">{row.original.user?.fullName ?? "Member"}</div>
            <div className="text-muted-foreground truncate text-xs">{row.original.user?.email}</div>
          </div>
        </div>
      )
    },
    {
      id: "summary",
      header: "Summary",
      cell: ({ row }) => (
        <div className="text-muted-foreground line-clamp-2 max-w-md text-sm">
          {row.original.summary}
        </div>
      )
    },
    {
      id: "sessions",
      header: "Sessions",
      cell: ({ row }) => <Badge variant="outline">{row.original.workouts.length}</Badge>
    },
    {
      id: "kcal",
      header: "Daily kcal",
      cell: ({ row }) => row.original.nutrition.dailyKcal
    },
    {
      accessorKey: "model",
      header: "Model",
      cell: ({ row }) => <Badge variant="secondary">{row.original.model}</Badge>
    },
    {
      accessorKey: "createdAt",
      header: "Generated",
      cell: ({ row }) => format(new Date(row.original.createdAt), "d MMM yyyy, HH:mm")
    }
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      emptyMessage="No plans generated yet."
      onRowClick={(plan) => router.push(`/dashboard/users/${plan.userId}`)}
    />
  );
}
