import {
  generateArrayForSelectCount,
  generatePrevLitoDateTimeFromInterval,
} from "../datetime";
import { queryOne } from "./db";

const SOFT_VOTES = 1;
const CERT_VOTES = 2;
const PROPOSALS = 3;
const ON_CHAIN = 4;

// Server request to get db data
export const getTotalsAndPercentageFromTimeInterval = async (
  interval: string,
  from: string,
  to: string
) => {
  const query = `
    SELECT 
      (SELECT COUNT(*) FROM proposed WHERE typeid=${ON_CHAIN} AND timestamp BETWEEN ? AND ?) AS onChain,
      (SELECT COUNT(*) FROM proposed WHERE typeid=${PROPOSALS} AND timestamp BETWEEN ? AND ?) AS proposals,
      (SELECT COUNT(*) FROM votes WHERE typeid=${SOFT_VOTES} AND timestamp BETWEEN ? AND ?) AS softVotes,
      (SELECT COUNT(*) FROM votes WHERE typeid=${CERT_VOTES} AND timestamp BETWEEN ? AND ?) AS certVotes,
      (SELECT COUNT(*) FROM proposed WHERE typeid=${ON_CHAIN} AND timestamp BETWEEN ? AND ?) AS prevOnChain,
      (SELECT COUNT(*) FROM proposed WHERE typeid=${PROPOSALS} AND timestamp BETWEEN ? AND ?) AS prevProposals,
      (SELECT COUNT(*) FROM votes WHERE typeid=${SOFT_VOTES} AND timestamp BETWEEN ? AND ?) AS prevSoftVotes,
      (SELECT COUNT(*) FROM votes WHERE typeid=${CERT_VOTES} AND timestamp BETWEEN ? AND ?) AS prevCertVotes
    `;

  // generate the previous from and to in order to get percentage changes over the same interval
  const prevTimeRange = generatePrevLitoDateTimeFromInterval(interval, from);

  // console.log(`from: ${from}, to: ${to}`);
  // console.log(`from: ${prevTimeRange.from}, to: ${prevTimeRange.to}`);

  // generate the ranges for the query
  const ranges = generateArrayForSelectCount(
    from,
    to,
    prevTimeRange.from,
    prevTimeRange.to
  );
  // execute the query and flatten out the array
  const counts: any = await queryOne(query, ranges.flat());

  // We now need to calculate the percentage change for each of the counts
  const onChainPercentage =
    ((counts.onChain - counts.prevOnChain) / counts.prevOnChain) * 100;
  const proposalsPercentage =
    ((counts.proposals - counts.prevProposals) / counts.prevProposals) * 100;
  const softVotesPercentage =
    ((counts.softVotes - counts.prevSoftVotes) / counts.prevSoftVotes) * 100;
  const certVotesPercentage =
    ((counts.certVotes - counts.prevCertVotes) / counts.prevCertVotes) * 100;

  return {
    onChain: {
      count: counts.onChain,
      percentage: onChainPercentage,
    },
    proposals: {
      count: counts.proposals,
      percentage: proposalsPercentage,
    },
    softVotes: {
      count: counts.softVotes,
      percentage: softVotesPercentage,
    },
    certVotes: {
      count: counts.certVotes,
      percentage: certVotesPercentage,
    },
  };
};
