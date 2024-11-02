import DashboardChunk from "@/components/home/dashboard-chunk";
import { Grid2x2CheckIcon, Blocks, Vote, ShieldCheck } from "lucide-react";

import {
  CertDescription,
  OnChainDescription,
  ProposedDescription,
  SoftDescription,
} from "@/lib/const";
import { HomeTotals, TotalChunkType } from "@/lib/types";
import { pause } from "@/utils/helpers";

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

async function getOnchainTotals(
  totals: HomeTotals,
  interval: string
): Promise<TotalChunkType> {
  await pause(2000);
  return {
    title: "On Chain",
    count: totals.onChain.count,
    percentage: totals.onChain.percentage,
    timeInterval: interval,
    icon: Grid2x2CheckIcon,
    description: OnChainDescription,
  };
}

export default async function DashboardHomeTotals({
  totals,
  interval,
}: {
  totals: HomeTotals;
  interval: string;
}) {
  const totalsObj = generateDashboardHomeTotalChunkData(totals, interval);
  const winRate = totalsObj.onChain.count / totalsObj.proposals.count;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
      {/* <DashboardChunk data={getOnchainTotals(totals, interval)} /> */}
      <DashboardChunk {...totalsObj.onChain} winRate={winRate} />
      <DashboardChunk {...totalsObj.proposals} />
      <DashboardChunk {...totalsObj.softVotes} />
      <DashboardChunk {...totalsObj.certVotes} />
    </div>
  );
}
