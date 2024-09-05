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

export type MonthChartDateRange = {
  week: string;
  from: string;
  to: string;
};

export type MonthChartDBType = {
  week1: number;
  week2: number;
  week3: number;
  week4: number;
  week5: number;
  week6: number;
  week7: number;
  week8: number;
};

// Week Chart Data
export type WeekChartDateRange = {
  day: string;
  from: string;
  to: string;
};

export type WeekChartDBType = {
  day1: number;
  day2: number;
  day3: number;
  day4: number;
  day5: number;
  day6: number;
  day7: number;
  day8: number;
  day9: number;
  day10: number;
  day11: number;
  day12: number;
  day13: number;
  day14: number;
};

// Day Chart Data
export type DayChartDBType = {
  hours1: number;
  hours2: number;
  hours3: number;
  hours4: number;
  hours5: number;
  hours6: number;
  hours7: number;
  hours8: number;
};

export type DayChartDateRange = {
  hours: string;
  from: string;
  to: string;
};
