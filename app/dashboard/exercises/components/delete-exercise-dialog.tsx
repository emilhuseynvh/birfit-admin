"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { apiFetch } from "@/lib/api.client";
import type { Exercise } from "@/lib/types";

export function DeleteExerciseDialog({
  exercise,
  onOpenChange,
  onDeleted
}: {
  exercise: Exercise | null;
  onOpenChange: (open: boolean) => void;
  onDeleted: () => void;
}) {
  const [busy, setBusy] = useState(false);

  const confirm = async () => {
    if (!exercise) return;
    setBusy(true);
    try {
      await apiFetch(`/admin/exercises/${exercise.id}`, { method: "DELETE" });
      toast.success(`${exercise.name} deleted`);
      onOpenChange(false);
      onDeleted();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Delete failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AlertDialog open={exercise !== null} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {exercise?.name}?</AlertDialogTitle>
          <AlertDialogDescription>
            The exercise, its cover and video will be removed. Existing plans keep their copy of the
            exercise, but new plans will no longer use it.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={busy}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={confirm} disabled={busy}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
