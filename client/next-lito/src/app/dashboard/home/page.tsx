"use server";

import { getSession } from "@/lib/auth/session";
import StatusIndicators from "@/components/home/status-indicators";

import TimeIntervalSelect from "@/components/home/time-interval-select";
import DashboardHomeTotals from "@/components/home/home-totals";
import { pause } from "@/utils/helpers";
import { checkAlgodIsRunning } from "@/lib/cmd/goal-commands";
import { generateLitoDateTimeFromInterval } from "@/lib/datetime";
import { getTotalsAndPercentageFromTimeInterval } from "@/lib/db/get-totals-data";
import { HomeTotals } from "@/lib/types";
import HomeCharts from "@/components/home/home-charts";

export default async function Home() {
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
      <HomeCharts
        interval={session?.interval as string}
        timeRange={timeRange}
      />
    </main>
  );
}
