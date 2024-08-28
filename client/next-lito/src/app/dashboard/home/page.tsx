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
import { describe } from "node:test";
import {
  CertDescription,
  OnChainDescription,
  ProposedDescription,
  SoftDescription,
} from "@/lib/const";

export default async function Home() {
  const session = await getSession();
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
    title: "Certification Votes",
    count: 854,
    percentage: 12.3,
    timeInterval: "7d",
    icon: ShieldCheck,
    description: CertDescription,
  };
  return (
    <main className="mx-auto max-w-6xl px-2">
      <div className="flex flex-col sm:flex-row sm:items-center  sm:justify-between">
        <StatusIndicators />
        <div className="flex justify-end py-4">
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

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <DashboardChunk {...data1} />
        <DashboardChunk {...data2} />
        <DashboardChunk {...data3} />
        <DashboardChunk {...data4} />
      </div>
    </main>
  );
}
