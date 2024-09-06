"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Define the type for a single data point
type DataPoint = {
  [key: string]: number | string;
};

type ChartConfigType = {
  [key: string]: {
    label: string;
    color: string;
  };
};

interface BarChartProps {
  data: DataPoint[];
  config: ChartConfigType;
  title: string;
  description: string;
  trendPercentage: number;
  footerText: string;
  xAxisKey?: string;
}

export const BarChartCard: React.FC<BarChartProps> = ({
  data,
  config,
  title,
  description,
  trendPercentage,
  footerText,
  xAxisKey,
}) => {
  const sliceValue = xAxisKey === "day" ? 3 : 10;
  const dataKeys = Object.keys(data[0]).filter((key) => key !== xAxisKey);
  const error = console.error;
  console.error = (...args: any) => {
    if (/defaultProps/.test(args[0])) return;
    error(...args);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config}>
          <BarChart
            accessibilityLayer
            data={data}
            margin={{
              top: 10,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={xAxisKey}
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, sliceValue)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey={dataKeys[0]}
              fill={`var(--color-${dataKeys[0]})`}
              radius={4}
            >
              <LabelList
                offset={12}
                className="fill-current text-white"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">{footerText}</div>
      </CardFooter>
    </Card>
  );
};
