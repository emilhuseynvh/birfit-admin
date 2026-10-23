"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { XIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/shared/search-input";
import { EQUIPMENT, MUSCLE_GROUPS } from "@/lib/options";

const ALL = "all";

export function ExerciseFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === ALL) params.delete(key);
    else params.set(key, value);
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  const hasFilters = ["muscleGroup", "equipment", "published", "search"].some((key) =>
    searchParams.has(key)
  );

  return (
    <div className="flex flex-wrap items-center gap-2">
      <SearchInput placeholder="Search exercises..." />
      <Select
        value={searchParams.get("muscleGroup") ?? ALL}
        onValueChange={(v) => setParam("muscleGroup", v)}
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Muscle" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>All muscles</SelectItem>
          {MUSCLE_GROUPS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={searchParams.get("equipment") ?? ALL}
        onValueChange={(v) => setParam("equipment", v)}
      >
        <SelectTrigger className="w-44">
          <SelectValue placeholder="Equipment" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>All equipment</SelectItem>
          {EQUIPMENT.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={searchParams.get("published") ?? ALL}
        onValueChange={(v) => setParam("published", v)}
      >
        <SelectTrigger className="w-36">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>All statuses</SelectItem>
          <SelectItem value="true">Published</SelectItem>
          <SelectItem value="false">Draft</SelectItem>
        </SelectContent>
      </Select>
      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={() => router.push(pathname)}>
          <XIcon /> Clear
        </Button>
      )}
    </div>
  );
}
