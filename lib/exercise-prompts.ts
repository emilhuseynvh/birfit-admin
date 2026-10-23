import type { Equipment, Exercise, ExerciseMeasure, MuscleGroup } from "./types";

type PromptSource = Pick<
  Exercise,
  "name" | "muscleGroup" | "secondaryMuscles" | "equipment" | "measure" | "instructions"
>;

const MUSCLE_NAMES: Record<MuscleGroup, string> = {
  shoulders: "deltoids",
  chest: "pectorals",
  back: "lats and upper back",
  biceps: "biceps",
  triceps: "triceps",
  core: "abdominals and core",
  quads: "quadriceps",
  hamstrings: "hamstrings",
  glutes: "glutes",
  calves: "calves",
  full_body: "the whole body",
  cardio: "legs and heart"
};

const COVER_EQUIPMENT: Record<Equipment, string> = {
  dumbbells: "dark metal dumbbells",
  barbell: "a dark metal barbell",
  kettlebell: "a dark kettlebell",
  resistance_bands: "a dark resistance band",
  pull_up_bar: "a dark pull-up bar",
  bench: "a dark flat bench"
};

const VIDEO_EQUIPMENT: Record<Equipment, string> = {
  dumbbells: "black rubber dumbbells",
  barbell: "a black barbell with black plates",
  kettlebell: "a black kettlebell",
  resistance_bands: "a black resistance band",
  pull_up_bar: "a plain black wall-mounted pull-up bar",
  bench: "a black flat bench"
};

const FRONT_GROUPS: MuscleGroup[] = ["chest", "shoulders", "biceps", "triceps"];

function cameraAngle(source: PromptSource): string {
  const name = source.name.toLowerCase();
  if (source.muscleGroup === "back" || /row|pull-up|chin-up|rear delt/.test(name)) {
    return "rear three-quarter";
  }
  if (source.equipment.length > 0 && FRONT_GROUPS.includes(source.muscleGroup)) {
    return "front three-quarter";
  }
  if (/boxing|twist|raise|clean/.test(name)) return "front three-quarter";
  return "side";
}

function joinList(items: string[]): string {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} and ${items.at(-1)}`;
}

function workingMuscles(source: PromptSource): string {
  const groups = [source.muscleGroup, ...source.secondaryMuscles];
  return [...new Set(groups.map((group) => MUSCLE_NAMES[group]))].join(", ");
}

function equipmentPhrase(
  equipment: Equipment[],
  names: Record<Equipment, string>,
  fallback: string
): string {
  if (equipment.length === 0) return fallback;
  return `using ${joinList(equipment.map((item) => names[item]))}`;
}

function movementStyle(measure: ExerciseMeasure, name: string): string {
  if (measure === "reps") {
    return "performs exactly two slow controlled repetitions with a clear pause at the top and bottom of each rep";
  }
  if (/hold|plank|wall sit|bridge hold|superman/.test(name)) {
    return "holds the position perfectly still with steady breathing for the whole clip";
  }
  return "performs the movement continuously at a steady controlled rhythm for the whole clip";
}

function cue(instructions: string): string {
  const text = instructions.trim().replace(/\.$/, "");
  return text.length > 0 ? `: ${text}.` : ".";
}

export function coverPrompt(source: PromptSource): string {
  const name = source.name.toLowerCase();
  return [
    `3D render of a translucent dark grey anatomical human figure in the mid-position of ${name}, perfect technique.`,
    `X-ray style body with visible muscle fibres; the working muscles (${workingMuscles(source)}) glow bright orange and red, everything else stays dark grey.`,
    `Full body in frame, ${cameraAngle(source)} view, pure black background, soft cinematic orange rim light, ${equipmentPhrase(source.equipment, COVER_EQUIPMENT, "bodyweight only")}.`,
    "Still image, 16:9, high detail. No text, no watermark, no real skin, no clothing."
  ].join(" ");
}

export function videoPrompt(source: PromptSource): string {
  const name = source.name.toLowerCase();
  return [
    `Realistic 8-second silent fitness demonstration video of an athletic male trainer who ${movementStyle(source.measure, name)} of ${name} with perfect textbook technique${cue(source.instructions)}`,
    "Dark charcoal studio, single soft key light from the side with a subtle warm orange rim light, matte black floor.",
    "The trainer wears fitted black training clothes, does not speak, mouth closed, calm neutral face, looks straight ahead.",
    `Full body always in frame, ${cameraAngle(source)} angle at chest height, static camera, no camera movement, ${equipmentPhrase(source.equipment, VIDEO_EQUIPMENT, "bodyweight only, no equipment")}.`,
    "Clean professional look like a premium fitness app tutorial. No text, no captions, no watermark, no talking, no voice, no other people, no mirrors."
  ].join(" ");
}
