"use client";

import { useRouter } from "next/navigation";
import { format } from "date-fns";
import type { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/shared/data-table";
import { GOALS, PLACES, LEVELS } from "@/lib/profile-options";
import { labelOf } from "@/lib/options";
import type { AppUser } from "@/lib/types";
import { generateAvatarFallback } from "@/lib/utils";

export function UsersTable({ data }: { data: AppUser[] }) {
  const router = useRouter();

  const columns: ColumnDef<AppUser, unknown>[] = [
    {
      accessorKey: "fullName",
      header: "Member",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>{generateAvatarFallback(row.original.fullName)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="truncate font-medium">{row.original.fullName}</div>
            <div className="text-muted-foreground truncate text-xs">{row.original.email}</div>
          </div>
        </div>
      )
    },
    {
      accessorKey: "goal",
      header: "Goal",
      cell: ({ row }) => <Badge variant="secondary">{labelOf(GOALS, row.original.goal)}</Badge>
    },
    {
      accessorKey: "trainingPlace",
      header: "Trains at",
      cell: ({ row }) => labelOf(PLACES, row.original.trainingPlace)
    },
    {
      accessorKey: "experienceLevel",
      header: "Level",
      cell: ({ row }) => labelOf(LEVELS, row.original.experienceLevel)
    },
    {
      accessorKey: "trainingDaysPerWeek",
      header: "Days / week",
      cell: ({ row }) => row.original.trainingDaysPerWeek ?? "—"
    },
    {
      id: "body",
      header: "Body",
      cell: ({ row }) =>
        row.original.heightCm && row.original.weightKg
          ? `${row.original.heightCm} cm · ${Number(row.original.weightKg).toFixed(1)} kg`
          : "—"
    },
    {
      accessorKey: "createdAt",
      header: "Joined",
      cell: ({ row }) => format(new Date(row.original.createdAt), "d MMM yyyy")
    }
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      emptyMessage="No members found."
      onRowClick={(user) => router.push(`/dashboard/users/${user.id}`)}
    />
  );
}
