export type user = {
  id: number;
  username: string;
  password: string;
  theme: string;
  interval: string;
};

export type HomeTotals = {
  onChain: {
    count: number;
    percentage: number;
  };
  proposals: {
    count: number;
    percentage: number;
  };
  softVotes: {
    count: number;
    percentage: number;
  };
  certVotes: {
    count: number;
    percentage: number;
  };
};
