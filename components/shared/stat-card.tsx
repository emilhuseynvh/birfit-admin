import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import CountAnimation from "@/components/ui/custom/count-animation";

export function StatCard({
  label,
  value,
  hint,
  href
}: {
  label: string;
  value: number;
  hint: string;
  href: string;
}) {
  return (
    <Card className="py-0">
      <CardContent className="space-y-4 p-6">
        <div className="flex items-start justify-between space-x-2">
          <span className="text-muted-foreground truncate text-sm">{label}</span>
          <span className="text-sm font-medium text-emerald-700 dark:text-emerald-500">{hint}</span>
        </div>
        <dd className="text-foreground mt-1 text-3xl font-semibold">
          <CountAnimation number={value} />
        </dd>
      </CardContent>
      <CardFooter className="border-border flex justify-end border-t p-0!">
        <Link
          href={href}
          className="text-primary hover:text-primary/90 flex items-center px-6 py-3 text-sm font-medium">
          View more <ArrowRightIcon className="ms-2 size-4" />
        </Link>
      </CardFooter>
    </Card>
  );
}
