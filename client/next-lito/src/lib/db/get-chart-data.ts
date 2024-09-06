import { CERT_VOTES, ON_CHAIN, PROPOSALS, SOFT_VOTES } from "../const";
import { convertToTime } from "../datetime";
import {
  DayChartDBType,
  DayChartDateRange,
  MonthChartDBType,
  MonthChartDateRange,
  WeekChartDBType,
  WeekChartDateRange,
} from "../types";
import { queryOne } from "./db";

export const getChartDataForDay = async (rangeObj: DayChartDateRange[]) => {
  const query = `
    SELECT 
    (SELECT COUNT(*) FROM proposed WHERE typeid=${ON_CHAIN} AND timestamp BETWEEN ? AND ?) AS hours1,
    (SELECT COUNT(*) FROM proposed WHERE typeid=${ON_CHAIN} AND timestamp BETWEEN ? AND ?) AS hours2,
    (SELECT COUNT(*) FROM proposed WHERE typeid=${ON_CHAIN} AND timestamp BETWEEN ? AND ?) AS hours3,
    (SELECT COUNT(*) FROM proposed WHERE typeid=${ON_CHAIN} AND timestamp BETWEEN ? AND ?) AS hours4,
    (SELECT COUNT(*) FROM proposed WHERE typeid=${PROPOSALS} AND timestamp BETWEEN ? AND ?) AS hours5,
    (SELECT COUNT(*) FROM proposed WHERE typeid=${PROPOSALS} AND timestamp BETWEEN ? AND ?) AS hours6,
    (SELECT COUNT(*) FROM proposed WHERE typeid=${PROPOSALS} AND timestamp BETWEEN ? AND ?) AS hours7,
    (SELECT COUNT(*) FROM proposed WHERE typeid=${PROPOSALS} AND timestamp BETWEEN ? AND ?) AS hours8,
    (SELECT COUNT(*) FROM votes WHERE typeid=${SOFT_VOTES} AND timestamp BETWEEN ? AND ?) AS hours9,
    (SELECT COUNT(*) FROM votes WHERE typeid=${SOFT_VOTES} AND timestamp BETWEEN ? AND ?) AS hours10,
    (SELECT COUNT(*) FROM votes WHERE typeid=${SOFT_VOTES} AND timestamp BETWEEN ? AND ?) AS hours11,
    (SELECT COUNT(*) FROM votes WHERE typeid=${SOFT_VOTES} AND timestamp BETWEEN ? AND ?) AS hours12,
    (SELECT COUNT(*) FROM votes WHERE typeid=${CERT_VOTES} AND timestamp BETWEEN ? AND ?) AS hours13,
    (SELECT COUNT(*) FROM votes WHERE typeid=${CERT_VOTES} AND timestamp BETWEEN ? AND ?) AS hours14,
    (SELECT COUNT(*) FROM votes WHERE typeid=${CERT_VOTES} AND timestamp BETWEEN ? AND ?) AS hours15,
    (SELECT COUNT(*) FROM votes WHERE typeid=${CERT_VOTES} AND timestamp BETWEEN ? AND ?) AS hours16
    `;

  const rangeDates = rangeObj.flatMap((range) => [range.from, range.to]);
  const extendedRangeDates = [
    ...rangeDates,
    ...rangeDates,
    ...rangeDates,
    ...rangeDates,
  ];
  const dbData = (await queryOne(query, extendedRangeDates)) as DayChartDBType;

  return {
    onChain: [
      {
        hours: convertToTime(parseInt(rangeObj[0].hours)),
        onChain: dbData.hours1,
      },
      {
        hours: convertToTime(parseInt(rangeObj[1].hours)),
        onChain: dbData.hours2,
      },
      {
        hours: convertToTime(parseInt(rangeObj[2].hours)),
        onChain: dbData.hours3,
      },
      {
        hours: convertToTime(parseInt(rangeObj[3].hours)),
        onChain: dbData.hours4,
      },
    ],
    proposals: [
      {
        hours: convertToTime(parseInt(rangeObj[0].hours)),
        proposals: dbData.hours5,
      },
      {
        hours: convertToTime(parseInt(rangeObj[1].hours)),
        proposals: dbData.hours6,
      },
      {
        hours: convertToTime(parseInt(rangeObj[2].hours)),
        proposals: dbData.hours7,
      },
      {
        hours: convertToTime(parseInt(rangeObj[3].hours)),
        proposals: dbData.hours8,
      },
    ],
    softVotes: [
      {
        hours: convertToTime(parseInt(rangeObj[0].hours)),
        softVotes: dbData.hours9,
      },
      {
        hours: convertToTime(parseInt(rangeObj[1].hours)),
        softVotes: dbData.hours10,
      },
      {
        hours: convertToTime(parseInt(rangeObj[2].hours)),
        softVotes: dbData.hours11,
      },
      {
        hours: convertToTime(parseInt(rangeObj[3].hours)),
        softVotes: dbData.hours12,
      },
    ],
    certVotes: [
      {
        hours: convertToTime(parseInt(rangeObj[0].hours)),
        certVotes: dbData.hours13,
      },
      {
        hours: convertToTime(parseInt(rangeObj[1].hours)),
        certVotes: dbData.hours14,
      },
      {
        hours: convertToTime(parseInt(rangeObj[2].hours)),
        certVotes: dbData.hours15,
      },
      {
        hours: convertToTime(parseInt(rangeObj[3].hours)),
        certVotes: dbData.hours16,
      },
    ],
  };
};

export const getChartDataForWeek = async (rangeObj: WeekChartDateRange[]) => {
  const query = `
  SELECT 
    (SELECT COUNT(*) FROM proposed WHERE typeid=${ON_CHAIN} AND timestamp BETWEEN ? AND ?) AS day1,
    (SELECT COUNT(*) FROM proposed WHERE typeid=${ON_CHAIN} AND timestamp BETWEEN ? AND ?) AS day2,
    (SELECT COUNT(*) FROM proposed WHERE typeid=${ON_CHAIN} AND timestamp BETWEEN ? AND ?) AS day3,
    (SELECT COUNT(*) FROM proposed WHERE typeid=${ON_CHAIN} AND timestamp BETWEEN ? AND ?) AS day4,
    (SELECT COUNT(*) FROM proposed WHERE typeid=${ON_CHAIN} AND timestamp BETWEEN ? AND ?) AS day5,
    (SELECT COUNT(*) FROM proposed WHERE typeid=${ON_CHAIN} AND timestamp BETWEEN ? AND ?) AS day6,
    (SELECT COUNT(*) FROM proposed WHERE typeid=${ON_CHAIN} AND timestamp BETWEEN ? AND ?) AS day7,
    (SELECT COUNT(*) FROM proposed WHERE typeid=${PROPOSALS} AND timestamp BETWEEN ? AND ?) AS day8,
    (SELECT COUNT(*) FROM proposed WHERE typeid=${PROPOSALS} AND timestamp BETWEEN ? AND ?) AS day9,
    (SELECT COUNT(*) FROM proposed WHERE typeid=${PROPOSALS} AND timestamp BETWEEN ? AND ?) AS day10,
    (SELECT COUNT(*) FROM proposed WHERE typeid=${PROPOSALS} AND timestamp BETWEEN ? AND ?) AS day11,
    (SELECT COUNT(*) FROM proposed WHERE typeid=${PROPOSALS} AND timestamp BETWEEN ? AND ?) AS day12,
    (SELECT COUNT(*) FROM proposed WHERE typeid=${PROPOSALS} AND timestamp BETWEEN ? AND ?) AS day13,
    (SELECT COUNT(*) FROM proposed WHERE typeid=${PROPOSALS} AND timestamp BETWEEN ? AND ?) AS day14,
    (SELECT COUNT(*) FROM votes WHERE typeid=${SOFT_VOTES} AND timestamp BETWEEN ? AND ?) AS day15,
    (SELECT COUNT(*) FROM votes WHERE typeid=${SOFT_VOTES} AND timestamp BETWEEN ? AND ?) AS day16,
    (SELECT COUNT(*) FROM votes WHERE typeid=${SOFT_VOTES} AND timestamp BETWEEN ? AND ?) AS day17,
    (SELECT COUNT(*) FROM votes WHERE typeid=${SOFT_VOTES} AND timestamp BETWEEN ? AND ?) AS day18,
    (SELECT COUNT(*) FROM votes WHERE typeid=${SOFT_VOTES} AND timestamp BETWEEN ? AND ?) AS day19,
    (SELECT COUNT(*) FROM votes WHERE typeid=${SOFT_VOTES} AND timestamp BETWEEN ? AND ?) AS day20,
    (SELECT COUNT(*) FROM votes WHERE typeid=${SOFT_VOTES} AND timestamp BETWEEN ? AND ?) AS day21,
    (SELECT COUNT(*) FROM votes WHERE typeid=${CERT_VOTES} AND timestamp BETWEEN ? AND ?) AS day22,
    (SELECT COUNT(*) FROM votes WHERE typeid=${CERT_VOTES} AND timestamp BETWEEN ? AND ?) AS day23,
    (SELECT COUNT(*) FROM votes WHERE typeid=${CERT_VOTES} AND timestamp BETWEEN ? AND ?) AS day24,
    (SELECT COUNT(*) FROM votes WHERE typeid=${CERT_VOTES} AND timestamp BETWEEN ? AND ?) AS day25,
    (SELECT COUNT(*) FROM votes WHERE typeid=${CERT_VOTES} AND timestamp BETWEEN ? AND ?) AS day26,
    (SELECT COUNT(*) FROM votes WHERE typeid=${CERT_VOTES} AND timestamp BETWEEN ? AND ?) AS day27,
    (SELECT COUNT(*) FROM votes WHERE typeid=${CERT_VOTES} AND timestamp BETWEEN ? AND ?) AS day28

  `;
  const rangeDates = rangeObj.flatMap((range) => [range.from, range.to]);
  const extendedRangeDates = [
    ...rangeDates,
    ...rangeDates,
    ...rangeDates,
    ...rangeDates,
  ];
  const dbData = (await queryOne(query, extendedRangeDates)) as WeekChartDBType;

  return {
    onChain: [
      {
        day: rangeObj[0].day,
        onChain: dbData.day1,
      },
      {
        day: rangeObj[1].day,
        onChain: dbData.day2,
      },
      {
        day: rangeObj[2].day,
        onChain: dbData.day3,
      },
      {
        day: rangeObj[3].day,
        onChain: dbData.day4,
      },
      {
        day: rangeObj[4].day,
        onChain: dbData.day5,
      },
      {
        day: rangeObj[5].day,
        onChain: dbData.day6,
      },
      {
        day: rangeObj[6].day,
        onChain: dbData.day7,
      },
    ],
    proposals: [
      {
        day: rangeObj[0].day,
        proposals: dbData.day8,
      },
      {
        day: rangeObj[1].day,
        proposals: dbData.day9,
      },
      {
        day: rangeObj[2].day,
        proposals: dbData.day10,
      },
      {
        day: rangeObj[3].day,
        proposals: dbData.day11,
      },
      {
        day: rangeObj[4].day,
        proposals: dbData.day12,
      },
      {
        day: rangeObj[5].day,
        proposals: dbData.day13,
      },
      {
        day: rangeObj[6].day,
        proposals: dbData.day14,
      },
    ],
    softVotes: [
      {
        day: rangeObj[0].day,
        softVotes: dbData.day15,
      },
      {
        day: rangeObj[1].day,
        softVotes: dbData.day16,
      },
      {
        day: rangeObj[2].day,
        softVotes: dbData.day17,
      },
      {
        day: rangeObj[3].day,
        softVotes: dbData.day18,
      },
      {
        day: rangeObj[4].day,
        softVotes: dbData.day19,
      },
      {
        day: rangeObj[5].day,
        softVotes: dbData.day20,
      },
      {
        day: rangeObj[6].day,
        softVotes: dbData.day21,
      },
    ],
    certVotes: [
      {
        day: rangeObj[0].day,
        certVotes: dbData.day22,
      },
      {
        day: rangeObj[1].day,
        certVotes: dbData.day23,
      },
      {
        day: rangeObj[2].day,
        certVotes: dbData.day24,
      },
      {
        day: rangeObj[3].day,
        certVotes: dbData.day25,
      },
      {
        day: rangeObj[4].day,
        certVotes: dbData.day26,
      },
      {
        day: rangeObj[5].day,
        certVotes: dbData.day27,
      },
      {
        day: rangeObj[6].day,
        certVotes: dbData.day28,
      },
    ],
  };
};

export const getChartDataForMonth = async (rangeObj: MonthChartDateRange[]) => {
  const query = `
    SELECT 
    (SELECT COUNT(*) FROM proposed WHERE typeid=${ON_CHAIN} AND timestamp BETWEEN ? AND ?) AS week1,
    (SELECT COUNT(*) FROM proposed WHERE typeid=${ON_CHAIN} AND timestamp BETWEEN ? AND ?) AS week2,
    (SELECT COUNT(*) FROM proposed WHERE typeid=${ON_CHAIN} AND timestamp BETWEEN ? AND ?) AS week3,
    (SELECT COUNT(*) FROM proposed WHERE typeid=${ON_CHAIN} AND timestamp BETWEEN ? AND ?) AS week4,
    (SELECT COUNT(*) FROM proposed WHERE typeid=${PROPOSALS} AND timestamp BETWEEN ? AND ?) AS week5,
    (SELECT COUNT(*) FROM proposed WHERE typeid=${PROPOSALS} AND timestamp BETWEEN ? AND ?) AS week6,
    (SELECT COUNT(*) FROM proposed WHERE typeid=${PROPOSALS} AND timestamp BETWEEN ? AND ?) AS week7,
    (SELECT COUNT(*) FROM proposed WHERE typeid=${PROPOSALS} AND timestamp BETWEEN ? AND ?) AS week8,
    (SELECT COUNT(*) FROM votes WHERE typeid=${SOFT_VOTES} AND timestamp BETWEEN ? AND ?) AS week9,
    (SELECT COUNT(*) FROM votes WHERE typeid=${SOFT_VOTES} AND timestamp BETWEEN ? AND ?) AS week10,
    (SELECT COUNT(*) FROM votes WHERE typeid=${SOFT_VOTES} AND timestamp BETWEEN ? AND ?) AS week11,
    (SELECT COUNT(*) FROM votes WHERE typeid=${SOFT_VOTES} AND timestamp BETWEEN ? AND ?) AS week12,
    (SELECT COUNT(*) FROM votes WHERE typeid=${CERT_VOTES} AND timestamp BETWEEN ? AND ?) AS week13,
    (SELECT COUNT(*) FROM votes WHERE typeid=${CERT_VOTES} AND timestamp BETWEEN ? AND ?) AS week14,
    (SELECT COUNT(*) FROM votes WHERE typeid=${CERT_VOTES} AND timestamp BETWEEN ? AND ?) AS week15,
    (SELECT COUNT(*) FROM votes WHERE typeid=${CERT_VOTES} AND timestamp BETWEEN ? AND ?) AS week16
    `;
  const rangeDates = rangeObj.flatMap((range) => [range.from, range.to]);
  const extendedRangeDates = [
    ...rangeDates,
    ...rangeDates,
    ...rangeDates,
    ...rangeDates,
  ];
  const dbData = (await queryOne(
    query,
    extendedRangeDates
  )) as MonthChartDBType;

  return {
    onChain: [
      {
        week: rangeObj[0].week,
        onChain: dbData.week1,
      },
      {
        week: rangeObj[1].week,
        onChain: dbData.week2,
      },
      {
        week: rangeObj[2].week,
        onChain: dbData.week3,
      },
      {
        week: rangeObj[3].week,
        onChain: dbData.week4,
      },
    ],
    proposals: [
      {
        week: rangeObj[0].week,
        proposals: dbData.week5,
      },
      {
        week: rangeObj[1].week,
        proposals: dbData.week6,
      },
      {
        week: rangeObj[2].week,
        proposals: dbData.week7,
      },
      {
        week: rangeObj[3].week,
        proposals: dbData.week8,
      },
    ],
    softVotes: [
      {
        week: rangeObj[0].week,
        softVotes: dbData.week9,
      },
      {
        week: rangeObj[1].week,
        softVotes: dbData.week10,
      },
      {
        week: rangeObj[2].week,
        softVotes: dbData.week11,
      },
      {
        week: rangeObj[3].week,
        softVotes: dbData.week12,
      },
    ],
    certVotes: [
      {
        week: rangeObj[0].week,
        certVotes: dbData.week13,
      },
      {
        week: rangeObj[1].week,
        certVotes: dbData.week14,
      },
      {
        week: rangeObj[2].week,
        certVotes: dbData.week15,
      },
      {
        week: rangeObj[3].week,
        certVotes: dbData.week16,
      },
    ],
  };
};
