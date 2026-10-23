"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2Icon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Badge } from "@/components/ui/badge";
import { apiFetch } from "@/lib/api.client";
import { DIFFICULTIES, EQUIPMENT, MEASURES, MUSCLE_GROUPS } from "@/lib/options";
import type { Exercise } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ExerciseMediaCard, type PendingMedia } from "./exercise-media-card";
import { ExercisePromptsCard } from "./exercise-prompts-card";
import { DeleteExerciseDialog } from "./delete-exercise-dialog";

const muscleValues = MUSCLE_GROUPS.map((m) => m.value) as [string, ...string[]];
const equipmentValues = EQUIPMENT.map((e) => e.value) as [string, ...string[]];

const schema = z.object({
  name: z.string().trim().min(2, "Name is too short").max(80),
  muscleGroup: z.enum(muscleValues),
  secondaryMuscles: z.array(z.enum(muscleValues)).max(4),
  equipment: z.array(z.enum(equipmentValues)),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  measure: z.enum(["reps", "time"]),
  instructions: z.string().trim().max(2000),
  mistakes: z.string().max(1200),
  published: z.boolean()
});

type FormValues = z.infer<typeof schema>;

function toFormValues(exercise?: Exercise): FormValues {
  return {
    name: exercise?.name ?? "",
    muscleGroup: exercise?.muscleGroup ?? "chest",
    secondaryMuscles: exercise?.secondaryMuscles ?? [],
    equipment: exercise?.equipment ?? [],
    difficulty: exercise?.difficulty ?? "beginner",
    measure: exercise?.measure ?? "reps",
    instructions: exercise?.instructions ?? "",
    mistakes: exercise?.mistakes.join("\n") ?? "",
    published: exercise?.published ?? false
  };
}

export function ExerciseForm({ exercise }: { exercise?: Exercise }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<Exercise | null>(null);
  const [media, setMedia] = useState<PendingMedia>({});

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: toFormValues(exercise),
    mode: "onChange"
  });

  async function onSubmit(values: FormValues) {
    setSaving(true);
    const payload = {
      ...values,
      mistakes: values.mistakes
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
    };
    try {
      const saved = exercise
        ? await apiFetch<Exercise>(`/admin/exercises/${exercise.id}`, {
            method: "PATCH",
            body: JSON.stringify(payload)
          })
        : await apiFetch<Exercise>("/admin/exercises", {
            method: "POST",
            body: JSON.stringify(payload)
          });

      if (media.cover || media.video) {
        const body = new FormData();
        if (media.cover) body.append("cover", media.cover);
        if (media.video) body.append("video", media.video);
        await apiFetch(`/admin/exercises/${saved.id}/media`, { method: "POST", body });
      }

      toast.success(exercise ? "Exercise updated" : "Exercise created");
      if (exercise) {
        router.refresh();
        setMedia({});
      } else {
        router.replace(`/dashboard/exercises/${saved.id}`);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save exercise");
    } finally {
      setSaving(false);
    }
  }

  const primary = form.watch("muscleGroup");
  const promptSource = {
    name: form.watch("name"),
    muscleGroup: form.watch("muscleGroup") as Exercise["muscleGroup"],
    secondaryMuscles: form.watch("secondaryMuscles") as Exercise["secondaryMuscles"],
    equipment: form.watch("equipment") as Exercise["equipment"],
    measure: form.watch("measure"),
    instructions: form.watch("instructions")
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Basics</CardTitle>
              <CardDescription>
                How the exercise appears to members and to the AI coach.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Dumbbell Shoulder Press" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="muscleGroup"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Main muscle group</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {MUSCLE_GROUPS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="measure"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Measured in</FormLabel>
                      <FormControl>
                        <ToggleGroup
                          type="single"
                          value={field.value}
                          onValueChange={(value) => value && field.onChange(value)}
                          className="*:border-input w-full gap-3 *:rounded-md *:border"
                        >
                          {MEASURES.map((option) => (
                            <ToggleGroupItem
                              key={option.value}
                              value={option.value}
                              variant="outline"
                              className="flex-1"
                            >
                              {option.label}
                            </ToggleGroupItem>
                          ))}
                        </ToggleGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="secondaryMuscles"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Secondary muscles</FormLabel>
                    <FormDescription>Up to four muscle groups that also work.</FormDescription>
                    <div className="flex flex-wrap gap-2">
                      {MUSCLE_GROUPS.filter((option) => option.value !== primary).map((option) => {
                        const selected = field.value.includes(option.value);
                        return (
                          <Badge
                            key={option.value}
                            variant={selected ? "default" : "outline"}
                            className={cn("cursor-pointer px-3 py-1 select-none")}
                            onClick={() =>
                              field.onChange(
                                selected
                                  ? field.value.filter((v) => v !== option.value)
                                  : field.value.length < 4
                                    ? [...field.value, option.value]
                                    : field.value
                              )
                            }
                          >
                            {option.label}
                          </Badge>
                        );
                      })}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="difficulty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Difficulty</FormLabel>
                    <FormControl>
                      <ToggleGroup
                        type="single"
                        value={field.value}
                        onValueChange={(value) => value && field.onChange(value)}
                        className="*:border-input w-full gap-3 *:rounded-md *:border"
                      >
                        {DIFFICULTIES.map((option) => (
                          <ToggleGroupItem
                            key={option.value}
                            value={option.value}
                            variant="outline"
                            className="flex-1"
                          >
                            {option.label}
                          </ToggleGroupItem>
                        ))}
                      </ToggleGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Equipment</CardTitle>
              <CardDescription>
                Leave everything unchecked for a bodyweight exercise.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="equipment"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {EQUIPMENT.map((option) => {
                        const checked = field.value.includes(option.value);
                        return (
                          <label
                            key={option.value}
                            className={cn(
                              "border-input hover:bg-muted/60 flex cursor-pointer items-center gap-3 rounded-md border px-3 py-2.5 text-sm",
                              checked && "border-primary bg-primary/5"
                            )}
                          >
                            <Checkbox
                              checked={checked}
                              onCheckedChange={(value) =>
                                field.onChange(
                                  value
                                    ? [...field.value, option.value]
                                    : field.value.filter((v) => v !== option.value)
                                )
                              }
                            />
                            {option.label}
                          </label>
                        );
                      })}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Coaching</CardTitle>
              <CardDescription>Shown to members during the workout.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="instructions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instructions</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={4}
                        placeholder="Set up, execution and breathing cues."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="mistakes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Common mistakes</FormLabel>
                    <FormDescription>One per line.</FormDescription>
                    <FormControl>
                      <Textarea
                        rows={3}
                        placeholder={"Flaring the elbows\nArching the lower back"}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <ExerciseMediaCard exercise={exercise} pending={media} onChange={setMedia} />

          <ExercisePromptsCard source={promptSource} />

          <Card>
            <CardHeader>
              <CardTitle>Visibility</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="published"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-md border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Published</FormLabel>
                      <FormDescription>Only published exercises are used in plans.</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="flex flex-col gap-2">
                <Button type="submit" disabled={saving}>
                  {saving && <Loader2Icon className="animate-spin" />}
                  {exercise ? "Save changes" : "Create exercise"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/dashboard/exercises")}
                >
                  Back to list
                </Button>
                {exercise && (
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-destructive"
                    onClick={() => setDeleting(exercise)}
                  >
                    <Trash2Icon /> Delete exercise
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
      <DeleteExerciseDialog
        exercise={deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        onDeleted={() => router.replace("/dashboard/exercises")}
      />
    </Form>
  );
}
