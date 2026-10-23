"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import type { ColumnDef } from "@tanstack/react-table";
import { Edit3Icon, FilmIcon, ImageIcon, MoreHorizontal, Trash2Icon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { DataTable } from "@/components/shared/data-table";
import { DeleteExerciseDialog } from "./delete-exercise-dialog";
import { apiFetch } from "@/lib/api.client";
import { mediaUrl } from "@/lib/config";
import { DIFFICULTIES, EQUIPMENT, MUSCLE_GROUPS, labelOf } from "@/lib/options";
import type { Exercise } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ExercisesTable({ data }: { data: Exercise[] }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<Exercise | null>(null);

  const togglePublished = async (exercise: Exercise, published: boolean) => {
    try {
      await apiFetch(`/admin/exercises/${exercise.id}`, {
        method: "PATCH",
        body: JSON.stringify({ published })
      });
      toast.success(published ? `${exercise.name} published` : `${exercise.name} moved to drafts`);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Update failed");
    }
  };

  const columns: ColumnDef<Exercise, unknown>[] = [
    {
      accessorKey: "name",
      header: "Exercise",
      cell: ({ row }) => {
        const cover = mediaUrl(row.original.coverUrl);
        return (
          <Link
            href={`/dashboard/exercises/${row.original.id}`}
            className="flex items-center gap-3"
          >
            <div className="bg-muted flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-md border">
              {cover ? (
                <img src={cover} alt="" className="size-full object-cover" />
              ) : (
                <ImageIcon className="text-muted-foreground size-4" />
              )}
            </div>
            <div className="min-w-0">
              <div className="truncate font-medium">{row.original.name}</div>
              <div className="text-muted-foreground truncate text-xs">{row.original.slug}</div>
            </div>
          </Link>
        );
      }
    },
    {
      accessorKey: "muscleGroup",
      header: "Muscle",
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          <Badge>{labelOf(MUSCLE_GROUPS, row.original.muscleGroup)}</Badge>
          {row.original.secondaryMuscles.map((muscle) => (
            <Badge key={muscle} variant="outline">
              {labelOf(MUSCLE_GROUPS, muscle)}
            </Badge>
          ))}
        </div>
      )
    },
    {
      accessorKey: "equipment",
      header: "Equipment",
      cell: ({ row }) =>
        row.original.equipment.length === 0 ? (
          <span className="text-muted-foreground text-sm">Bodyweight</span>
        ) : (
          <div className="flex flex-wrap gap-1">
            {row.original.equipment.map((item) => (
              <Badge key={item} variant="secondary">
                {labelOf(EQUIPMENT, item)}
              </Badge>
            ))}
          </div>
        )
    },
    {
      accessorKey: "difficulty",
      header: "Level",
      cell: ({ row }) => labelOf(DIFFICULTIES, row.original.difficulty)
    },
    {
      id: "media",
      header: "Media",
      cell: ({ row }) => (
        <div className="text-muted-foreground flex items-center gap-2">
          <ImageIcon className={cn("size-4", row.original.coverUrl && "text-emerald-600")} />
          <FilmIcon className={cn("size-4", row.original.videoUrl && "text-emerald-600")} />
        </div>
      )
    },
    {
      accessorKey: "published",
      header: "Published",
      cell: ({ row }) => (
        <Switch
          checked={row.original.published}
          onCheckedChange={(value) => togglePublished(row.original, value)}
          aria-label="Toggle published"
        />
      )
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/exercises/${row.original.id}`}>
                <Edit3Icon /> Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onSelect={() => setDeleting(row.original)}>
              <Trash2Icon /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  ];

  return (
    <>
      <DataTable columns={columns} data={data} emptyMessage="No exercises match these filters." />
      <DeleteExerciseDialog
        exercise={deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        onDeleted={() => router.refresh()}
      />
    </>
  );
}
