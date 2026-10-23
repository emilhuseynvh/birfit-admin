"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export function Pagination({ page, limit, total }: { page: number; limit: number; total: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pages = Math.max(1, Math.ceil(total / limit));
  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(total, page * limit);

  const go = (next: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(next));
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center justify-end space-x-2 pt-4">
      <div className="text-muted-foreground flex-1 text-sm">
        {from}–{to} of {total}
      </div>
      <div className="space-x-2">
        <Button variant="outline" size="sm" onClick={() => go(page - 1)} disabled={page <= 1}>
          Previous
        </Button>
        <Button variant="outline" size="sm" onClick={() => go(page + 1)} disabled={page >= pages}>
          Next
        </Button>
      </div>
    </div>
  );
}
