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

interface HomeChartsProps {
  // Add any props you need for your HomeCharts component
}

function getXAxis(interval: string) {
  let xAxis: string;
  switch (interval) {
    case "24h":
      xAxis = "hours";
      break;
    case "2d":
      xAxis = "hours";
      break;
    case "3d":
      xAxis = "hours";
      break;
    case "1w":
      xAxis = "day";
      break;
    case "2w":
      xAxis = "days";
      break;
    case "1m":
      xAxis = "week";
      break;
    case "3m":
      xAxis = "week";
      break;
  }
  return xAxis!;
}

async function getOnchainChartData(interval: string, from: string, to: string) {
  let dateRanges: any;
  let chartData: any;
  switch (interval) {
    case "24h":
      console.log("24h");
      dateRanges = getDayChartDateRanges(new Date());
      chartData = await getChartDataForDay(dateRanges);
      break;
    case "2d":
      console.log("2d");
      break;
    case "3d":
      console.log("3d");
      break;
    case "1w":
      console.log("1w");
      dateRanges = getWeekChartDateRanges(new Date());
      chartData = await getChartDataForWeek(dateRanges);
      break;
    case "2w":
      console.log("2w");
      break;
    case "1m":
      console.log("1m");
      dateRanges = getMonthChartDateRanges(new Date());
      chartData = await getChartDataForMonth(dateRanges);
      break;
    case "3m":
      console.log("3m");
      break;
    default:
      break;
  }

  return {
    ranges: dateRanges!,
    data: chartData,
  };
}

export default async function HomeCharts({
  interval,
  timeRange,
}: {
  interval: string;
  timeRange: { from: string; to: string };
}) {
  const chartConfig = {
    onChain: {
      label: "On Chain",
      color: "hsl(var(--chart-1))",
    },
  };

  // Get Bar data from interval and datetime range
  const onChain = await getOnchainChartData(
    interval,
    timeRange.from,
    timeRange.to
  );

  console.log(onChain);

  // Create a time range text for the charts
  const from = DateTime.fromISO(onChain.ranges[0].from)
    .toUTC()
    .toFormat("LLL dd, yyyy hh:mm a");
  const to = DateTime.fromISO(onChain.ranges[onChain.ranges.length - 1].to)
    .toUTC()
    .toFormat("LLL dd, yyyy hh:mm a");
  let timeRangeText = `${from} - ${to}`;

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="w-full md:w-1/2">
        <BarChartCard
          data={onChain.data}
          config={chartConfig}
          title="On Chain Blocks"
          description={timeRangeText}
          trendPercentage={12}
          footerText="Total Votes"
          xAxisKey={getXAxis(interval)}
        />
      </div>
      <div className="w-full md:w-1/2"></div>
    </div>
  );
}
