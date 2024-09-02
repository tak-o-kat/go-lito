"use server";

import { DateTime } from "luxon";
import DashboardChunk from "@/components/home/dashboard-chunk";
import { Grid2x2CheckIcon, Blocks, Vote, ShieldCheck } from "lucide-react";

import {
  CertDescription,
  OnChainDescription,
  ProposedDescription,
  SoftDescription,
} from "@/lib/const";
import { IronSession } from "iron-session";
import { SessionData } from "@/lib/auth/session";

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

import { executeQuery, queryMany, queryOne } from "@/lib/db/db";

const SOFT_VOTES = 1;
const CERT_VOTES = 2;
const PROPOSALS = 3;
const ON_CHAIN = 4;

// Server request to get db data
const getTotalsFromTimeInterval = async (interval: string) => {
  "use server";
  const query = `
    SELECT 
      (SELECT COUNT(*) FROM proposed WHERE typeid=${ON_CHAIN} AND timestamp BETWEEN ? AND ?) AS onChain,
      (SELECT COUNT(*) FROM proposed WHERE typeid=${PROPOSALS} AND timestamp BETWEEN ? AND ?) AS proposals,
      (SELECT COUNT(*) FROM votes WHERE typeid=${SOFT_VOTES} AND timestamp BETWEEN ? AND ?) AS softVotes,
      (SELECT COUNT(*) FROM votes WHERE typeid=${CERT_VOTES} AND timestamp BETWEEN ? AND ?) AS certVotes
    `;

  const from = "2024-07-28T07:22:42.577437Z";
  const to = "2024-08-28T07:22:42.577437Z";

  const range = [];
  for (let i = 0; i < 4; i++) {
    range.push([from, to] as [string, string]);
  }

  const date = new Date();
  const iso = date.toISOString();
  const dt = DateTime.fromISO(from);
  console.log(dt.toUTC().toISO());

  console.log(dt.minus({ days: 7 }).toUTC().toISO());

  const results = await queryOne(query, range.flat());
  return results;
};

export default async function DashboardHomeTotals({
  session,
  isAlgodRunning,
}: {
  session: IronSession<SessionData>;
  isAlgodRunning: boolean;
}) {
  // determine the time interval and query the data based on those ranges.
  // Get the previous time interval data to dertermin the percentage change.
  const data = await getTotalsFromTimeInterval(session?.interval || "7d");

  console.log(data);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
      <DashboardChunk {...data1} />
      <DashboardChunk {...data2} />
      <DashboardChunk {...data3} />
      <DashboardChunk {...data4} />
    </div>
  );
}
