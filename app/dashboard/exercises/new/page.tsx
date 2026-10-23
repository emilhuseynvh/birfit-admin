import { generateMeta } from "@/lib/utils";
import { PageHeader } from "@/components/shared/page-header";
import { ExerciseForm } from "../components/exercise-form";

export async function generateMetadata() {
  return generateMeta({
    title: "Add exercise",
    description: "Create a new exercise",
    canonical: "/dashboard/exercises/new"
  });
}

export default function Page() {
  return (
    <div className="space-y-4">
      <PageHeader
        title="Add exercise"
        description="New exercises start as drafts until you publish them."
      />
      <ExerciseForm />
    </div>
  );
}
