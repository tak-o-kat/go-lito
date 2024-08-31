"use client";

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

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
  { day: "Sunday", soft: 174, cert: 71 },
  { day: "Monday", soft: 186, cert: 80 },
  { day: "Tuesday", soft: 305, cert: 200 },
  { day: "Wednesday", soft: 237, cert: 120 },
  { day: "Thursday", soft: 73, cert: 190 },
  { day: "Friday", soft: 209, cert: 130 },
  { day: "Saturday", soft: 214, cert: 140 },
];

const chartConfig = {
  soft: {
    label: "Soft Votes",
    color: "hsl(var(--chart-1))",
  },
  cert: {
    label: "Cert Votes",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function AreaChartCard() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Soft vs Certified Votes</CardTitle>
        <CardDescription>
          Showing soft and certified votes for the last 7 days
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              filterNull={true}
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="cert"
              type="natural"
              fill="var(--color-cert)"
              fillOpacity={0.5}
              stroke="var(--color-cert)"
              stackId="a"
            />
            <Area
              dataKey="soft"
              type="natural"
              fill="var(--color-soft)"
              fillOpacity={0.5}
              stroke="var(--color-soft)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by 5.2% this week <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Aug 26 - Sept 01 | 2024
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
