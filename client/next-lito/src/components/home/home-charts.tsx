import { DateTime } from "luxon";

import { BarChartCard } from "../charts/bar-chart-1";
import {
  getChartDataForDay,
  getChartDataForMonth,
  getChartDataForWeek,
} from "@/lib/db/get-chart-data";
import {
  getDayChartDateRanges,
  getMonthChartDateRanges,
  getWeekChartDateRanges,
} from "@/lib/datetime";
import {
  CurrentDataType,
  DayChartDateRange,
  MonthChartDateRange,
  WeekChartDateRange,
} from "@/lib/types";

interface HomeChartsProps {
  // Add any props you need for your HomeCharts component
}

async function getOnchainChartData(
  interval: string,
  from: string,
  currentData: any
) {
  let dateRanges:
    | DayChartDateRange[]
    | WeekChartDateRange[]
    | MonthChartDateRange[];
  let chartData: any;
  let xAxis: string;

  if (interval.includes("day")) {
    dateRanges = getDayChartDateRanges(new Date(from));
    chartData = await getChartDataForDay(dateRanges, currentData);
    xAxis = "hours";
  } else if (interval.includes("week")) {
    dateRanges = getWeekChartDateRanges(new Date(from));
    chartData = await getChartDataForWeek(dateRanges, currentData);
    xAxis = "day";
  } else if (interval.includes("month")) {
    dateRanges = getMonthChartDateRanges(new Date(from));
    chartData = await getChartDataForMonth(dateRanges, currentData);
    xAxis = "week";
  }

  return {
    ranges: dateRanges!,
    data: chartData,
    xAxis: xAxis!,
  };
}

export default async function HomeCharts({
  interval,
  timeRange,
  currentData,
}: {
  interval: string;
  timeRange: { from: string; to: string };
  currentData: CurrentDataType;
}) {
  const onChainConfig = {
    onChain: {
      label: "On Chain",
      color: "hsl(var(--chart-1))",
    },
  };

  const proposalsConfig = {
    proposals: {
      label: "Proposals",
      color: "hsl(var(--chart-2))",
    },
  };

  const softConfig = {
    softVotes: {
      label: "Soft Votes",
      color: "hsl(var(--chart-3))",
    },
  };

  const certConfig = {
    certVotes: {
      label: "Cert Votes",
      color: "hsl(var(--chart-4))",
    },
  };

  // Get Bar data from interval and datetime range
  const chartInfo = await getOnchainChartData(
    interval,
    timeRange.from,
    currentData
  );

  // console.log(chartInfo);

  // Create a time range text for the charts
  const from = DateTime.fromISO(chartInfo.ranges[0].from)
    .toUTC()
    .toFormat("LLL dd, yyyy hh:mm a");
  const to = DateTime.fromISO(chartInfo.ranges[chartInfo.ranges.length - 1].to)
    .toUTC()
    .toFormat("LLL dd, yyyy hh:mm a");
  let timeRangeText = `${from} - ${to}`;

  return (
    <>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/2">
          <BarChartCard
            data={chartInfo.data.onChain}
            config={onChainConfig}
            title="On Chain Blocks"
            description={timeRangeText}
            trendPercentage={12}
            footerText="Blocks On Chain"
            xAxisKey={chartInfo.xAxis}
          />
        </div>
        <div className="w-full md:w-1/2">
          <BarChartCard
            data={chartInfo.data.proposals}
            config={proposalsConfig}
            title="Block Proposals"
            description={timeRangeText}
            trendPercentage={12}
            footerText="Blocks Proposals"
            xAxisKey={chartInfo.xAxis}
          />
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/2">
          <BarChartCard
            data={chartInfo.data.softVotes}
            config={softConfig}
            title="Soft Votes"
            description={timeRangeText}
            trendPercentage={12}
            footerText="Soft Votes"
            xAxisKey={chartInfo.xAxis}
          />
        </div>
        <div className="w-full md:w-1/2">
          <BarChartCard
            data={chartInfo.data.certVotes}
            config={certConfig}
            title="Certified Votes"
            description={timeRangeText}
            trendPercentage={12}
            footerText="Cert Votes"
            xAxisKey={chartInfo.xAxis}
          />
        </div>
      </div>
    </>
  );
}
