export type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
};

export type MuscleGroup =
  | "shoulders"
  | "chest"
  | "back"
  | "biceps"
  | "triceps"
  | "core"
  | "quads"
  | "hamstrings"
  | "glutes"
  | "calves"
  | "full_body"
  | "cardio";

export type Equipment =
  "dumbbells" | "barbell" | "kettlebell" | "resistance_bands" | "pull_up_bar" | "bench";

export type Difficulty = "beginner" | "intermediate" | "advanced";
export type ExerciseMeasure = "reps" | "time";

export type Exercise = {
  id: string;
  name: string;
  slug: string;
  muscleGroup: MuscleGroup;
  secondaryMuscles: MuscleGroup[];
  equipment: Equipment[];
  difficulty: Difficulty;
  measure: ExerciseMeasure;
  instructions: string;
  mistakes: string[];
  coverUrl: string | null;
  videoUrl: string | null;
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AppUser = {
  id: string;
  email: string;
  fullName: string;
  role: "user" | "admin";
  gender: "male" | "female" | null;
  age: number | null;
  heightCm: number | null;
  weightKg: string | number | null;
  goal: string | null;
  trainingPlace: string | null;
  equipment: Equipment[];
  experienceLevel: string | null;
  trainingDaysPerWeek: number | null;
  dietPreference: string | null;
  createdAt: string;
};

export type PlanExercise = {
  exerciseId: string;
  slug: string;
  name: string;
  muscleGroup: MuscleGroup;
  measure: ExerciseMeasure;
  coverUrl: string | null;
  videoUrl: string | null;
  sets: number;
  reps: string;
  restSeconds: number;
  notes: string;
};

export type Workout = {
  title: string;
  focus: string;
  category: string;
  durationMinutes: number;
  kcal: number;
  targetMuscles: string[];
  exercises: PlanExercise[];
};

export type Meal = {
  name: string;
  time: string;
  kcal: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  items: string[];
};

export type Plan = {
  id: string;
  userId: string;
  user?: AppUser;
  summary: string;
  nutrition: { dailyKcal: number; proteinG: number; carbsG: number; fatG: number };
  workouts: Workout[];
  meals: Meal[];
  model: string;
  createdAt: string;
};

export type AdminStats = {
  users: { total: number; lastWeek: number };
  plans: { total: number; lastWeek: number };
  exercises: { total: number; published: number };
  signups: { date: string; count: number }[];
};
