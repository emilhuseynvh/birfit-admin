import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { ArrowLeftIcon, FilmIcon } from "lucide-react";
import { generateMeta } from "@/lib/utils";
import { serverFetch } from "@/lib/api.server";
import { ApiError } from "@/lib/api-error";
import type { AppUser, Plan } from "@/lib/types";
import { labelOf, humanize, EQUIPMENT, MUSCLE_GROUPS } from "@/lib/options";
import { DIETS, GENDERS, GOALS, LEVELS, PLACES } from "@/lib/profile-options";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/shared/page-header";
import { generateAvatarFallback } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return generateMeta({
    title: "Member",
    description: "Member profile",
    canonical: `/dashboard/users/${id}`
  });
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-muted-foreground text-xs">{label}</div>
      <div className="text-sm font-medium">{value}</div>
    </div>
  );
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let detail: { user: AppUser; plan: Plan | null };
  try {
    detail = await serverFetch(`/admin/users/${id}`);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }
  const { user, plan } = detail;

  return (
    <div className="space-y-4">
      <PageHeader title={user.fullName} description={user.email}>
        <Button variant="outline" asChild>
          <Link href="/dashboard/users">
            <ArrowLeftIcon /> All users
          </Link>
        </Button>
      </PageHeader>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="size-14">
              <AvatarFallback className="text-lg">
                {generateAvatarFallback(user.fullName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{user.fullName}</CardTitle>
              <CardDescription>
                Joined {format(new Date(user.createdAt), "d MMM yyyy")}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <Field label="Gender" value={labelOf(GENDERS, user.gender)} />
            <Field label="Age" value={user.age ? `${user.age} years` : "—"} />
            <Field label="Height" value={user.heightCm ? `${user.heightCm} cm` : "—"} />
            <Field
              label="Weight"
              value={user.weightKg ? `${Number(user.weightKg).toFixed(1)} kg` : "—"}
            />
            <Field label="Goal" value={labelOf(GOALS, user.goal)} />
            <Field label="Experience" value={labelOf(LEVELS, user.experienceLevel)} />
            <Field label="Trains at" value={labelOf(PLACES, user.trainingPlace)} />
            <Field label="Days per week" value={user.trainingDaysPerWeek?.toString() ?? "—"} />
            <Field label="Diet" value={labelOf(DIETS, user.dietPreference)} />
            <div>
              <div className="text-muted-foreground text-xs">Equipment</div>
              <div className="mt-1 flex flex-wrap gap-1">
                {user.equipment.length === 0 && (
                  <span className="text-sm font-medium">Bodyweight</span>
                )}
                {user.equipment.map((item) => (
                  <Badge key={item} variant="secondary">
                    {labelOf(EQUIPMENT, item)}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          {!plan ? (
            <Card>
              <CardHeader>
                <CardTitle>No plan yet</CardTitle>
                <CardDescription>This member has not generated a plan.</CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <CardTitle>Current plan</CardTitle>
                    <CardDescription>
                      Generated {format(new Date(plan.createdAt), "d MMM yyyy, HH:mm")} with{" "}
                      {plan.model}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="secondary">{plan.nutrition.dailyKcal} kcal</Badge>
                    <Badge variant="outline">P {plan.nutrition.proteinG}g</Badge>
                    <Badge variant="outline">C {plan.nutrition.carbsG}g</Badge>
                    <Badge variant="outline">F {plan.nutrition.fatG}g</Badge>
                  </div>
                </div>
                <p className="text-muted-foreground pt-2 text-sm">{plan.summary}</p>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="workouts">
                  <TabsList>
                    <TabsTrigger value="workouts">Workouts ({plan.workouts.length})</TabsTrigger>
                    <TabsTrigger value="meals">Meals ({plan.meals.length})</TabsTrigger>
                  </TabsList>
                  <TabsContent value="workouts" className="space-y-4 pt-4">
                    {plan.workouts.map((workout, index) => (
                      <div key={index} className="rounded-md border">
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b px-4 py-3">
                          <div>
                            <div className="font-medium">{workout.title}</div>
                            <div className="text-muted-foreground text-xs">{workout.focus}</div>
                          </div>
                          <div className="flex gap-2">
                            <Badge>{humanize(workout.category)}</Badge>
                            <Badge variant="outline">{workout.durationMinutes} min</Badge>
                            <Badge variant="outline">{workout.kcal} kcal</Badge>
                          </div>
                        </div>
                        <ul className="divide-y">
                          {workout.exercises.map((exercise) => (
                            <li
                              key={exercise.slug}
                              className="flex items-center gap-3 px-4 py-2 text-sm"
                            >
                              <Link
                                href={`/dashboard/exercises/${exercise.exerciseId}`}
                                className="font-medium hover:underline"
                              >
                                {exercise.name}
                              </Link>
                              <span className="text-muted-foreground">
                                {labelOf(MUSCLE_GROUPS, exercise.muscleGroup)}
                              </span>
                              <span className="text-muted-foreground ml-auto whitespace-nowrap">
                                {exercise.sets} × {exercise.reps} · {exercise.restSeconds}s rest
                              </span>
                              {exercise.videoUrl && (
                                <FilmIcon className="size-4 text-emerald-600" />
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </TabsContent>
                  <TabsContent value="meals" className="grid gap-4 pt-4 md:grid-cols-2">
                    {plan.meals.map((meal, index) => (
                      <div key={index} className="rounded-md border p-4">
                        <div className="flex items-center justify-between">
                          <div className="font-medium">{meal.name}</div>
                          <div className="text-muted-foreground text-xs">{meal.time}</div>
                        </div>
                        <div className="text-muted-foreground mt-1 text-xs">
                          {meal.kcal} kcal · P {meal.proteinG}g · C {meal.carbsG}g · F {meal.fatG}g
                        </div>
                        <ul className="mt-3 list-disc space-y-1 pl-4 text-sm">
                          {meal.items.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
