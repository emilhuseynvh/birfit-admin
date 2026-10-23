import { notFound } from "next/navigation";
import { generateMeta } from "@/lib/utils";
import { serverFetch } from "@/lib/api.server";
import { ApiError } from "@/lib/api-error";
import type { Exercise } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/page-header";
import { ExerciseForm } from "../components/exercise-form";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return generateMeta({
    title: "Edit exercise",
    description: "Edit exercise",
    canonical: `/dashboard/exercises/${id}`
  });
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let exercise: Exercise;
  try {
    exercise = await serverFetch<Exercise>(`/admin/exercises/${id}`);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }

  return (
    <div className="space-y-4">
      <PageHeader title={exercise.name} description={exercise.slug}>
        <Badge variant={exercise.published ? "default" : "outline"}>
          {exercise.published ? "Published" : "Draft"}
        </Badge>
      </PageHeader>
      <ExerciseForm key={exercise.updatedAt} exercise={exercise} />
    </div>
  );
}
