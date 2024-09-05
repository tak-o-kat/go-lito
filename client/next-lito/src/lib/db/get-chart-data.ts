import { convertToTime } from "../datetime";
import {
  DayChartDataType,
  DayChartDateRange,
  MonthChartDataType,
  MonthChartDateRange,
  WeekChartDataType,
  WeekChartDateRange,
} from "../types";
import { queryOne } from "./db";

export const getChartDataForDay = async (rangeObj: DayChartDateRange[]) => {
  const query = `
    SELECT 
    (SELECT COUNT(*) FROM proposed WHERE typeid=4 AND timestamp BETWEEN ? AND ?) AS hours1,
    (SELECT COUNT(*) FROM proposed WHERE typeid=4 AND timestamp BETWEEN ? AND ?) AS hours2,
    (SELECT COUNT(*) FROM proposed WHERE typeid=4 AND timestamp BETWEEN ? AND ?) AS hours3,
    (SELECT COUNT(*) FROM proposed WHERE typeid=4 AND timestamp BETWEEN ? AND ?) AS hours4
    `;
  const rangeDates = rangeObj.flatMap((range) => [range.from, range.to]);
  const chartData = (await queryOne(query, rangeDates)) as DayChartDataType;

  console.log();

  return [
    {
      hours: convertToTime(parseInt(rangeObj[0].hours)),
      onChain: chartData.hours1,
    },
    {
      hours: convertToTime(parseInt(rangeObj[1].hours)),
      onChain: chartData.hours2,
    },
    {
      hours: convertToTime(parseInt(rangeObj[2].hours)),
      onChain: chartData.hours3,
    },
    {
      hours: convertToTime(parseInt(rangeObj[3].hours)),
      onChain: chartData.hours4,
    },
  ];
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
    (SELECT COUNT(*) FROM proposed WHERE typeid=4 AND timestamp BETWEEN ? AND ?) AS day7
  `;
  const rangeDates = rangeObj.flatMap((range) => [range.from, range.to]);
  const chartData = (await queryOne(query, rangeDates)) as WeekChartDataType;
  return [
    {
      day: rangeObj[0].day,
      onChain: chartData.day1,
    },
    {
      day: rangeObj[1].day,
      onChain: chartData.day2,
    },
    {
      day: rangeObj[2].day,
      onChain: chartData.day3,
    },
    {
      day: rangeObj[3].day,
      onChain: chartData.day4,
    },
    {
      day: rangeObj[4].day,
      onChain: chartData.day5,
    },
    {
      day: rangeObj[5].day,
      onChain: chartData.day6,
    },
    {
      day: rangeObj[6].day,
      onChain: chartData.day7,
    },
  ];
};

export const getChartDataForMonth = async (rangeObj: MonthChartDateRange[]) => {
  const monthQuery = `
    SELECT 
    (SELECT COUNT(*) FROM proposed WHERE typeid=4 AND timestamp BETWEEN ? AND ?) AS week1,
    (SELECT COUNT(*) FROM proposed WHERE typeid=4 AND timestamp BETWEEN ? AND ?) AS week2,
    (SELECT COUNT(*) FROM proposed WHERE typeid=4 AND timestamp BETWEEN ? AND ?) AS week3,
    (SELECT COUNT(*) FROM proposed WHERE typeid=4 AND timestamp BETWEEN ? AND ?) AS week4
    `;
  const rangeDates = rangeObj.flatMap((range) => [range.from, range.to]);
  const chartData = (await queryOne(
    monthQuery,
    rangeDates
  )) as MonthChartDataType;

  return [
    {
      week: rangeObj[0].week,
      onChain: chartData.week1,
    },
    {
      week: rangeObj[1].week,
      onChain: chartData.week2,
    },
    {
      week: rangeObj[2].week,
      onChain: chartData.week3,
    },
    {
      week: rangeObj[3].week,
      onChain: chartData.week4,
    },
  ];
};
