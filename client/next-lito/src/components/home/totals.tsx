import DashboardChunk from "@/components/home/dashboard-chunk";
import { Grid2x2CheckIcon, Blocks, Vote, ShieldCheck } from "lucide-react";

import {
  CertDescription,
  OnChainDescription,
  ProposedDescription,
  SoftDescription,
} from "@/lib/const";
import { HomeTotals } from "@/lib/types";
import { on } from "events";

const data1 = {
  title: "On Chain",
  count: 47,
  percentage: 4.3,
  timeInterval: "7d",
  icon: Grid2x2CheckIcon,
  description: OnChainDescription,
};

function generateDashboardHomeTotalChunkData(
  data: HomeTotals,
  interval: string
) {
  return {
    onChain: {
      title: "On Chain",
      count: data.onChain.count,
      percentage: data.onChain.percentage,
      timeInterval: interval,
      icon: Grid2x2CheckIcon,
      description: OnChainDescription,
    },
    proposals: {
      title: "Proposals",
      count: data.proposals.count,
      percentage: data.proposals.percentage,
      timeInterval: interval,
      icon: Blocks,
      description: ProposedDescription,
    },
    softVotes: {
      title: "Soft Votes",
      count: data.softVotes.count,
      percentage: data.softVotes.percentage,
      timeInterval: interval,
      icon: Vote,
      description: SoftDescription,
    },
    certVotes: {
      title: "Cert Votes",
      count: data.certVotes.count,
      percentage: data.certVotes.percentage,
      timeInterval: interval,
      icon: ShieldCheck,
      description: CertDescription,
    },
  };
}

export default async function DashboardHomeTotals({
  totals,
  interval,
  isAlgodRunning,
}: {
  totals: HomeTotals;
  interval: string;
  isAlgodRunning: boolean;
}) {
  const totalsObj = generateDashboardHomeTotalChunkData(totals, interval);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
      <DashboardChunk {...totalsObj.onChain} />
      <DashboardChunk {...totalsObj.proposals} />
      <DashboardChunk {...totalsObj.softVotes} />
      <DashboardChunk {...totalsObj.certVotes} />
    </div>
  );
}
