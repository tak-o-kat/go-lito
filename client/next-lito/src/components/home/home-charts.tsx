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
    case "today":
      xAxis = "hours";
      break;
    case "yesterday":
      xAxis = "hours";
      break;
    case "week":
      xAxis = "day";
      break;
    case "lastweek":
      xAxis = "day";
      break;
    case "month":
      xAxis = "week";
      break;
    case "lastmonth":
      xAxis = "week";
      break;
  }
  return xAxis!;
}

async function getOnchainChartData(interval: string, from: string, to: string) {
  let dateRanges: any;
  let chartData: any;
  switch (interval) {
    case "today":
      dateRanges = getDayChartDateRanges(new Date());
      chartData = await getChartDataForDay(dateRanges);
      break;
    case "yesterday":
      const yesterday = DateTime.local().minus({ days: 1 }).toUTC();
      dateRanges = getDayChartDateRanges(yesterday.toJSDate());
      chartData = await getChartDataForDay(dateRanges);
      break;
    case "week":
      dateRanges = getWeekChartDateRanges(new Date());
      chartData = await getChartDataForWeek(dateRanges);
      break;
    case "lastweek":
      const week = DateTime.fromJSDate(new Date()).toUTC().startOf("week");
      const lastWeek = week.minus({ week: 1 }).toUTC().toJSDate();
      dateRanges = getWeekChartDateRanges(lastWeek);
      chartData = await getChartDataForWeek(dateRanges);
      break;
    case "month":
      dateRanges = getMonthChartDateRanges(new Date());
      chartData = await getChartDataForMonth(dateRanges);
      break;
    case "lastmonth":
      const lastMonth = DateTime.local().minus({ month: 1 }).toUTC();
      dateRanges = getMonthChartDateRanges(lastMonth.toJSDate());
      chartData = await getChartDataForMonth(dateRanges);
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
    timeRange.to
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
            footerText="Total Votes"
            xAxisKey={getXAxis(interval)}
          />
        </div>
        <div className="w-full md:w-1/2">
          <BarChartCard
            data={chartInfo.data.proposals}
            config={proposalsConfig}
            title="Block Proposals"
            description={timeRangeText}
            trendPercentage={12}
            footerText="Total Votes"
            xAxisKey={getXAxis(interval)}
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
            xAxisKey={getXAxis(interval)}
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
            xAxisKey={getXAxis(interval)}
          />
        </div>
      </div>
    </>
  );
}
