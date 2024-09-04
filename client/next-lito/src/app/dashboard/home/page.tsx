"use server";

import { getSession } from "@/lib/auth/session";
import StatusIndicators from "@/components/home/status-indicators";

import { BarCharty } from "@/components/home/BarCharty";
import { BarChartCard } from "@/components/charts/bar-chart-1";
import TimeIntervalSelect from "@/components/home/time-interval-select";
import DashboardHomeTotals from "@/components/home/totals";
import { pause } from "@/utils/helpers";
import { DateTime } from "luxon";
import { checkAlgodIsRunning } from "@/lib/cmd/goal-commands";
import { generateLitoDateTimeFromInterval } from "@/lib/datetime";
import { time } from "console";
import { getTotalsAndPercentageFromTimeInterval } from "@/lib/db/get-totals-data";
import { HomeTotals } from "@/lib/types";

export default async function Home() {
  const months = [
    { month: "February", onChain: 44 },
    { month: "March", onChain: 23 },
    { month: "April", onChain: 56 },
    { month: "May", onChain: 34 },
    { month: "June", onChain: 39 },
    { month: "July", onChain: 67 },
    { month: "August", onChain: 48 },
  ];

  const chartConfig = {
    onChain: {
      label: "On Chain",
      color: "hsl(var(--chart-1))",
    },
  };

  const session = await getSession();
  const isAlgodRunning = (await checkAlgodIsRunning()) as boolean;

  const timeRange = generateLitoDateTimeFromInterval(
    (session?.interval as string) || "7d"
  );

  // determine the time interval and query the data based on those ranges.
  // Get the previous time interval data to dertermin the percentage change.
  const totals: HomeTotals = await getTotalsAndPercentageFromTimeInterval(
    session?.interval as string,
    timeRange.from,
    timeRange.to
  );

  return (
    <main className="mx-auto max-w-6xl px-2 space-y-3 sm:space-y-4 my-3 sm:my-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:gap-2">
        <div className="flex flex-col justify-center sm:flex-row">
          <StatusIndicators />
        </div>
        <div className="flex md:justify-end md:w-auto pt-3 sm:pt-0">
          <TimeIntervalSelect timeInterval={session?.interval as string} />
        </div>
      </div>
      <DashboardHomeTotals
        totals={totals}
        interval={session?.interval as string}
        isAlgodRunning={isAlgodRunning}
      />
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/2">
          <BarChartCard
            data={months}
            config={chartConfig}
            title="On Chain Blocks"
            description="Sun Aug 22, 2024 - Sun Aug 29, 2024"
            trendPercentage={12}
            footerText="Total Votes"
            xAxisKey="month"
          />
        </div>
        <div className="w-full md:w-1/2">
          <BarCharty />
        </div>
      </div>
    </main>
  );
}
