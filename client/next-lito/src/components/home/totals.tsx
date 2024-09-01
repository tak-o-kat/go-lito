"use server";

import DashboardChunk from "@/components/home/dashboard-chunk";
import { Grid2x2CheckIcon, Blocks, Vote, ShieldCheck } from "lucide-react";

import {
  CertDescription,
  OnChainDescription,
  ProposedDescription,
  SoftDescription,
} from "@/lib/const";

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

export default async function DashboardHomeTotals() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
      <DashboardChunk {...data1} />
      <DashboardChunk {...data2} />
      <DashboardChunk {...data3} />
      <DashboardChunk {...data4} />
    </div>
  );
}
