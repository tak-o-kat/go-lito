// All constants are exported here

export const SALT_ROUNDS = 10;
export const ALGORAND_DATA = process.env.ALGORAND_DATA;
export const DB_PATH = `${ALGORAND_DATA}/lito/golito.db`;
export const OnChainDescription =
  "These are the blocks that you proposed and also won the VRF! These blocks are on the chain!";

export const ProposedDescription =
  "These are the blocks that you proposed, but did not win the VRF! These block are not on the chain!";

export const SoftDescription =
  "These votes are the initial committee agreement when a block is proposed. Once a certain threshhold is reached, consensus move on to the next phase.";

export const CertDescription =
  "These votes are the final committee agreement when a block is proposed. Each selected committee member checks the validity of the block and it's transactions. Once a certain threshhold is reached, the block is considered final!";
