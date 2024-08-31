"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
const chartData = [
  { month: "Sunday", desktop: 27, mobile: 2 },
  { month: "Monday", desktop: 34, mobile: 1 },
  { month: "Tueday", desktop: 29, mobile: 1 },
  { month: "Wednesday", desktop: 33, mobile: 3 },
  { month: "Thursday", desktop: 41, mobile: 2 },
  { month: "Friday", desktop: 28, mobile: 2 },
  { month: "Saturday", desktop: 37, mobile: 3 },
];

const chartConfig = {
  desktop: {
    label: "Proposals",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "On Chain",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function BarCharty() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Block Proposals</CardTitle>
        <CardDescription>Aug 26 - Sept 01 | 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
            <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}
