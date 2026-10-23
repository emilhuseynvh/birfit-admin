import Link from "next/link";
import { Suspense } from "react";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { generateMeta } from "@/lib/utils";
import { serverFetch } from "@/lib/api.server";
import type { Exercise, Paginated } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { Pagination } from "@/components/shared/pagination";
import { ExerciseFilters } from "./components/exercise-filters";
import { ExercisesTable } from "./components/exercises-table";

export async function generateMetadata() {
  return generateMeta({
    title: "Exercises",
    description: "Exercise catalog",
    canonical: "/dashboard/exercises"
  });
}

type SearchParams = Record<string, string | string[] | undefined>;

export default async function Page({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const query = new URLSearchParams();
  for (const key of ["search", "muscleGroup", "equipment", "published", "page"]) {
    const value = params[key];
    if (typeof value === "string" && value) query.set(key, value);
  }
  query.set("limit", "20");
  const result = await serverFetch<Paginated<Exercise>>(`/admin/exercises?${query.toString()}`);

  return (
    <div className="space-y-4">
      <PageHeader title="Exercises" description={`${result.total} exercises in the catalog`}>
        <Button asChild>
          <Link href="/dashboard/exercises/new">
            <PlusCircledIcon /> Add exercise
          </Link>
        </Button>
      </PageHeader>
      <Suspense>
        <ExerciseFilters />
      </Suspense>
      <ExercisesTable data={result.items} />
      <Suspense>
        <Pagination page={result.page} limit={result.limit} total={result.total} />
      </Suspense>
    </div>
  );
}
