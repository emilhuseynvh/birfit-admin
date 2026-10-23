import type { Difficulty, Equipment, ExerciseMeasure, MuscleGroup } from "./types";

export const MUSCLE_GROUPS: { value: MuscleGroup; label: string }[] = [
  { value: "shoulders", label: "Shoulders" },
  { value: "chest", label: "Chest" },
  { value: "back", label: "Back" },
  { value: "biceps", label: "Biceps" },
  { value: "triceps", label: "Triceps" },
  { value: "core", label: "Core" },
  { value: "quads", label: "Quads" },
  { value: "hamstrings", label: "Hamstrings" },
  { value: "glutes", label: "Glutes" },
  { value: "calves", label: "Calves" },
  { value: "full_body", label: "Full body" },
  { value: "cardio", label: "Cardio" }
];

export const EQUIPMENT: { value: Equipment; label: string }[] = [
  { value: "dumbbells", label: "Dumbbells" },
  { value: "barbell", label: "Barbell" },
  { value: "kettlebell", label: "Kettlebell" },
  { value: "resistance_bands", label: "Resistance bands" },
  { value: "pull_up_bar", label: "Pull-up bar" },
  { value: "bench", label: "Bench" }
];

export const DIFFICULTIES: { value: Difficulty; label: string }[] = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" }
];

export const MEASURES: { value: ExerciseMeasure; label: string }[] = [
  { value: "reps", label: "Repetitions" },
  { value: "time", label: "Time" }
];

export function labelOf<T extends string>(
  options: { value: T; label: string }[],
  value: T | string | null | undefined
): string {
  return options.find((option) => option.value === value)?.label ?? humanize(value);
}

export function humanize(value: string | null | undefined): string {
  if (!value) return "—";
  return value.replaceAll("_", " ").replace(/^\w/, (c) => c.toUpperCase());
}
