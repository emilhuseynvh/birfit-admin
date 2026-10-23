"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig
} from "@/components/ui/chart";

const config = {
  count: { label: "Sign-ups", color: "var(--chart-1)" }
} satisfies ChartConfig;

export function SignupsChart({ data }: { data: { date: string; count: number }[] }) {
  const rows = data.map((row) => ({ ...row, label: format(new Date(row.date), "d MMM") }));
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign-ups</CardTitle>
        <CardDescription>New members over the last 14 days</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-[260px] w-full">
          <BarChart data={rows} margin={{ left: 0, right: 0 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} interval={1} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="count" fill="var(--color-count)" radius={6} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
