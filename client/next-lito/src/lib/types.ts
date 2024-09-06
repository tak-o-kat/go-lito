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
  hours9: number;
  hours10: number;
  hours11: number;
  hours12: number;
  hours13: number;
  hours14: number;
  hours15: number;
  hours16: number;
};

export type DayChartDateRange = {
  hours: string;
  from: string;
  to: string;
};

// Week Chart Data types
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
  day15: number;
  day16: number;
  day17: number;
  day18: number;
  day19: number;
  day20: number;
  day21: number;
  day22: number;
  day23: number;
  day24: number;
  day25: number;
  day26: number;
  day27: number;
  day28: number;
};

export type WeekChartDateRange = {
  day: string;
  from: string;
  to: string;
};

// Month Chart Data Types
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
  week9: number;
  week10: number;
  week11: number;
  week12: number;
  week13: number;
  week14: number;
  week15: number;
  week16: number;
};
