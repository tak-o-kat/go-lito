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
    (SELECT COUNT(*) FROM proposed WHERE typeid=4 AND timestamp BETWEEN ? AND ?) AS hours1,
    (SELECT COUNT(*) FROM proposed WHERE typeid=4 AND timestamp BETWEEN ? AND ?) AS hours2,
    (SELECT COUNT(*) FROM proposed WHERE typeid=4 AND timestamp BETWEEN ? AND ?) AS hours3,
    (SELECT COUNT(*) FROM proposed WHERE typeid=4 AND timestamp BETWEEN ? AND ?) AS hours4,
    (SELECT COUNT(*) FROM proposed WHERE typeid=3 AND timestamp BETWEEN ? AND ?) AS hours5,
    (SELECT COUNT(*) FROM proposed WHERE typeid=3 AND timestamp BETWEEN ? AND ?) AS hours6,
    (SELECT COUNT(*) FROM proposed WHERE typeid=3 AND timestamp BETWEEN ? AND ?) AS hours7,
    (SELECT COUNT(*) FROM proposed WHERE typeid=3 AND timestamp BETWEEN ? AND ?) AS hours8
    `;

  const rangeDates = rangeObj.flatMap((range) => [range.from, range.to]);
  const extendedRangeDates = [...rangeDates, ...rangeDates];
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
  };
};

export const getChartDataForWeek = async (rangeObj: WeekChartDateRange[]) => {
  const query = `
  SELECT 
    (SELECT COUNT(*) FROM proposed WHERE typeid=4 AND timestamp BETWEEN ? AND ?) AS day1,
    (SELECT COUNT(*) FROM proposed WHERE typeid=4 AND timestamp BETWEEN ? AND ?) AS day2,
    (SELECT COUNT(*) FROM proposed WHERE typeid=4 AND timestamp BETWEEN ? AND ?) AS day3,
    (SELECT COUNT(*) FROM proposed WHERE typeid=4 AND timestamp BETWEEN ? AND ?) AS day4,
    (SELECT COUNT(*) FROM proposed WHERE typeid=4 AND timestamp BETWEEN ? AND ?) AS day5,
    (SELECT COUNT(*) FROM proposed WHERE typeid=4 AND timestamp BETWEEN ? AND ?) AS day6,
    (SELECT COUNT(*) FROM proposed WHERE typeid=4 AND timestamp BETWEEN ? AND ?) AS day7,
    (SELECT COUNT(*) FROM proposed WHERE typeid=3 AND timestamp BETWEEN ? AND ?) AS day8,
    (SELECT COUNT(*) FROM proposed WHERE typeid=3 AND timestamp BETWEEN ? AND ?) AS day9,
    (SELECT COUNT(*) FROM proposed WHERE typeid=3 AND timestamp BETWEEN ? AND ?) AS day10,
    (SELECT COUNT(*) FROM proposed WHERE typeid=3 AND timestamp BETWEEN ? AND ?) AS day11,
    (SELECT COUNT(*) FROM proposed WHERE typeid=3 AND timestamp BETWEEN ? AND ?) AS day12,
    (SELECT COUNT(*) FROM proposed WHERE typeid=3 AND timestamp BETWEEN ? AND ?) AS day13,
    (SELECT COUNT(*) FROM proposed WHERE typeid=3 AND timestamp BETWEEN ? AND ?) AS day14
  `;
  const rangeDates = rangeObj.flatMap((range) => [range.from, range.to]);
  const extendedRangeDates = [...rangeDates, ...rangeDates];
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
  };
};

export const getChartDataForMonth = async (rangeObj: MonthChartDateRange[]) => {
  const query = `
    SELECT 
    (SELECT COUNT(*) FROM proposed WHERE typeid=4 AND timestamp BETWEEN ? AND ?) AS week1,
    (SELECT COUNT(*) FROM proposed WHERE typeid=4 AND timestamp BETWEEN ? AND ?) AS week2,
    (SELECT COUNT(*) FROM proposed WHERE typeid=4 AND timestamp BETWEEN ? AND ?) AS week3,
    (SELECT COUNT(*) FROM proposed WHERE typeid=4 AND timestamp BETWEEN ? AND ?) AS week4,
    (SELECT COUNT(*) FROM proposed WHERE typeid=3 AND timestamp BETWEEN ? AND ?) AS week5,
    (SELECT COUNT(*) FROM proposed WHERE typeid=3 AND timestamp BETWEEN ? AND ?) AS week6,
    (SELECT COUNT(*) FROM proposed WHERE typeid=3 AND timestamp BETWEEN ? AND ?) AS week7,
    (SELECT COUNT(*) FROM proposed WHERE typeid=3 AND timestamp BETWEEN ? AND ?) AS week8
    `;
  const rangeDates = rangeObj.flatMap((range) => [range.from, range.to]);
  const extendedRangeDates = [...rangeDates, ...rangeDates];
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
  };
};
