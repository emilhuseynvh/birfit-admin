import { Suspense } from "react";
import { generateMeta } from "@/lib/utils";
import { serverFetch } from "@/lib/api.server";
import type { AppUser, Paginated } from "@/lib/types";
import { PageHeader } from "@/components/shared/page-header";
import { Pagination } from "@/components/shared/pagination";
import { SearchInput } from "@/components/shared/search-input";
import { UsersTable } from "./components/users-table";

export async function generateMetadata() {
  return generateMeta({
    title: "Users",
    description: "BirFit members",
    canonical: "/dashboard/users"
  });
}

type SearchParams = Record<string, string | string[] | undefined>;

export default async function Page({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const query = new URLSearchParams({ limit: "20" });
  if (typeof params.search === "string" && params.search) query.set("search", params.search);
  if (typeof params.page === "string") query.set("page", params.page);
  const result = await serverFetch<Paginated<AppUser>>(`/admin/users?${query.toString()}`);

  return (
    <div className="space-y-4">
      <PageHeader title="Users" description={`${result.total} members`} />
      <Suspense>
        <SearchInput placeholder="Search by name or email..." />
      </Suspense>
      <UsersTable data={result.items} />
      <Suspense>
        <Pagination page={result.page} limit={result.limit} total={result.total} />
      </Suspense>
    </div>
  );
}
