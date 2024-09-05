import { ComponentType } from "react";

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

export type TotalChunkType = {
  title: string;
  count: number;
  percentage: number;
  timeInterval: string;
  icon: ComponentType<{
    className?: string;
  }>;
  description: string;
};

export type WeekChartDateRange = {
  day: string;
  from: string;
  to: string;
};

export type WeekChartDataType = {
  day1: number;
  day2: number;
  day3: number;
  day4: number;
  day5: number;
  day6: number;
  day7: number;
};

export type DayChartDataType = {
  hours1: number;
  hours2: number;
  hours3: number;
  hours4: number;
};

export type MonthChartDataType = {
  week1: number;
  week2: number;
  week3: number;
  week4: number;
};

export type DayChartDateRange = {
  hours: string;
  from: string;
  to: string;
};

export type MonthChartDateRange = {
  week: string;
  from: string;
  to: string;
};
