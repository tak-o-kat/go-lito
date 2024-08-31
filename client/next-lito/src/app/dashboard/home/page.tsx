import { Grid2x2CheckIcon, Blocks, Vote, ShieldCheck } from "lucide-react";
import { getSession } from "@/lib/auth/session";
import DashboardChunk from "@/components/home/chunks";
import StatusIndicators from "@/components/home/status-indicators";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  SelectSeparator,
} from "@/components/ui/select";
import {
  CertDescription,
  OnChainDescription,
  ProposedDescription,
  SoftDescription,
} from "@/lib/const";
import { BarCharty } from "@/components/home/BarCharty";
import { BarChartCard } from "@/components/charts/bar-chart-1";

export default async function Home() {
  const data1 = {
    title: "On Chain",
    count: 47,
    percentage: 4.3,
    timeInterval: "7d",
    icon: Grid2x2CheckIcon,
    description: OnChainDescription,
  };
  const data2 = {
    title: "Proposals",
    count: 534,
    percentage: 8.1,
    timeInterval: "7d",
    icon: Blocks,
    description: ProposedDescription,
  };
  const data3 = {
    title: "Soft Votes",
    count: 1345,
    percentage: 18.4,
    timeInterval: "7d",
    icon: Vote,
    description: SoftDescription,
  };
  const data4 = {
    title: "Cert Votes",
    count: 854,
    percentage: 12.3,
    timeInterval: "7d",
    icon: ShieldCheck,
    description: CertDescription,
  };

  const data = [
    { day: "Sunday", onChain: 4 },
    { day: "Monday", onChain: 3 },
    { day: "Tuesday", onChain: 5 },
    { day: "Wednesday", onChain: 3 },
    { day: "Thursday", onChain: 5 },
    { day: "Friday", onChain: 3 },
    { day: "Saturday", onChain: 2 },
  ];

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
  return (
    <main className="mx-auto max-w-6xl px-2">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:gap-2">
        <div className="flex flex-col justify-center sm:flex-row">
          <StatusIndicators />
        </div>
        <div className="flex md:justify-end md:w-auto py-3 sm:py-4">
          <Select name="interval" defaultValue="24h">
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder={"Select an interval"} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Time Interval</SelectLabel>
                <SelectSeparator />
                <SelectItem value="24h">Last 24 Hours</SelectItem>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="1m">Last 1 Month</SelectItem>
                <SelectItem value="3m">Last 3 Months</SelectItem>
                <SelectItem value="6m">Last 6 Months</SelectItem>
                <SelectItem value="1y">Last Year</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-2 md:gap-4 lg:grid-cols-4">
        <DashboardChunk {...data1} />
        <DashboardChunk {...data2} />
        <DashboardChunk {...data3} />
        <DashboardChunk {...data4} />
      </div>
      <div className="flex flex-col md:flex-row py-4 gap-4">
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
