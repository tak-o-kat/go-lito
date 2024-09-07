// functions used to help generate datetimes and ranges

import { DateTime, Interval } from "luxon";
import {
  DayChartDateRange,
  MonthChartDateRange,
  WeekChartDateRange,
} from "./types";

// Generate a Lito datetime string from an interval string return UTC time
export function generateLitoDateTimeFromInterval(interval: string) {
  let dt = DateTime.fromJSDate(new Date()).toUTC().startOf("day");
  let from = dt.startOf("day").toUTC().toISO();
  let to = DateTime.fromJSDate(new Date()).toUTC().toISO();

  switch (interval) {
    case "today":
      from = dt.toUTC().toISO();
      break;
    case "yesterday":
      from = dt.minus({ day: 1 }).toUTC().toISO();
      to = dt.minus({ milliseconds: 1 }).toUTC().toISO();
      break;
    case "week":
      from = DateTime.fromJSDate(new Date()).toUTC().startOf("week").toISO();
      break;
    case "lastweek":
      const week = DateTime.fromJSDate(new Date()).toUTC().startOf("week");
      from = week.minus({ week: 1 }).toUTC().toISO();
      to = week.minus({ milliseconds: 1 }).toUTC().toISO();
      break;
    case "month":
      from = DateTime.fromJSDate(new Date()).toUTC().startOf("month").toISO();
      break;
    case "lastmonth":
      const month = DateTime.fromJSDate(new Date()).toUTC().startOf("month");
      from = month.minus({ month: 1 }).toUTC().toISO();
      to = month.minus({ milliseconds: 1 }).toUTC().toISO();
      break;
    default:
      break;
  }
  from = from as string;
  to = to as string;

  return { from, to };
}

// This will generate the previous datetime from the current datetime
// e.g. if the current datetime is 2021-09-01T00:00:00.000Z then the previous datetime will be 2021-08-31T00:00:00.000Z
export function generatePrevLitoDateTimeFromInterval(
  interval: string,
  currentFrom: string
) {
  let dt, from, to;

  if (interval.includes("day")) {
    dt = DateTime.fromISO(currentFrom).toUTC().startOf("day");
    from = dt.minus({ day: 1 }).toUTC().toISO() as string;
    to = dt.minus({ milliseconds: 1 }).toUTC().toISO() as string;
  } else if (interval.includes("week")) {
    dt = DateTime.fromISO(currentFrom).toUTC();
    from = dt.minus({ week: 1 }).toUTC().toISO() as string;
    to = dt.minus({ milliseconds: 1 }).toUTC().toISO() as string;
  } else if (interval.includes("month")) {
    dt = DateTime.fromISO(currentFrom).toUTC();
    from = dt.minus({ month: 1 }).toUTC().toISO() as string;
    to = dt.minus({ milliseconds: 1 }).toUTC().toISO() as string;
  }
  from = from as string;
  to = to as string;
  return { from, to };
}

// There will be a total of 4 queries done to ge the totals, but another 4 queries for the previous totals
// This means we need a total of 8 queries to get the data for the dashboard tototals
export function generateArrayForSelectCount(
  from: string,
  to: string,
  prevFrom: string,
  prevTo: string
) {
  // create 2 small loops and then merge the loops
  const range = [];
  for (let i = 0; i < 4; i++) {
    range.push([from, to] as [string, string]);
  }

  const prevRange = [];
  for (let i = 0; i < 4; i++) {
    prevRange.push([prevFrom, prevTo] as [string, string]);
  }

  return range.concat(prevRange);
}

/* The Following functions are used to generate the date ranges for a day chart */
function divideDayIntoHours(startDate: string) {
  // Ensure the start date is the beginning of a day
  const dt = DateTime.fromISO(startDate).toUTC();
  const dayStart = dt.startOf("day");

  // Create an array to store the 24 hour intervals
  const hours = [];

  // Loop through an interval of 6 hours in a day
  for (let i = 0; i < 4; i++) {
    const hourStart = dayStart.plus({ hours: i * 6 });
    const hourEnd = hourStart.plus({ hours: 6 }).minus({ milliseconds: 1 });

    hours.push({
      hours: hourStart.hour,
      interval: Interval.fromDateTimes(hourStart, hourEnd),
    });
  }
  return hours;
}

export function getDayChartDateRanges(date: Date): DayChartDateRange[] {
  const startDay = DateTime.fromISO(date.toISOString())
    .toUTC()
    .toISO() as string;
  const dayHours = divideDayIntoHours(startDay);

  const ranges: DayChartDateRange[] = dayHours.map((hour) => {
    return {
      hours: hour.hours!.toString(),
      from: hour.interval.start?.toISO()!,
      to: hour.interval.end?.toISO()!,
    };
  });

  return ranges;
}

/* The Following functions are used to generate the date ranges for the week chart */
function divideWeekIntoDays(startDate: string) {
  // Ensure the start date is the beginning of a week (Monday)
  const dt = DateTime.fromISO(startDate).toUTC();
  const weekStart = dt.startOf("week");

  // Create an array to store the 7 day intervals
  const weekDays = [];

  // Loop through 7 days
  for (let i = 0; i < 7; i++) {
    const dayStart = weekStart.plus({ days: i }).startOf("day");
    const dayEnd = dayStart.endOf("day");

    weekDays.push({
      dayOfWeek: dayStart.weekdayLong,
      interval: Interval.fromDateTimes(dayStart, dayEnd),
    });
  }

  return weekDays;
}

export function getWeekChartDateRanges(date: Date): WeekChartDateRange[] {
  const startWeek = DateTime.fromISO(date.toISOString())
    .toUTC()
    .toISO() as string;
  const weekDays = divideWeekIntoDays(startWeek);

  const ranges = weekDays.map((day) => {
    return {
      day: day.dayOfWeek!,
      from: day.interval.start?.toISO()!,
      to: day.interval.end?.toISO()!,
    };
  });

  return ranges;
}

/* The Following functions are used to generate the date ranges for the month chart */
function divideMonthIntoWeeks(startDate: string) {
  // Ensure the start date is the beginning of a month
  const dt = DateTime.fromISO(startDate).toUTC();
  const monthStart = dt.startOf("month");

  // Create an array to store the 4 week intervals
  const weeks = [];

  // Loop through 4 weeks
  for (let i = 0; i < 4; i++) {
    const weekStart = monthStart.plus({ weeks: i });
    let weekEnd;
    if (i !== 3) {
      weekEnd = weekStart.plus({ weeks: 1 }).minus({ milliseconds: 1 });
    } else {
      weekEnd = monthStart.endOf("month");
    }

    weeks.push({
      week: weekStart.weekNumber,
      interval: Interval.fromDateTimes(weekStart, weekEnd),
    });
  }

  return weeks;
}

export function getMonthChartDateRanges(date: Date): MonthChartDateRange[] {
  const startMonth = DateTime.fromISO(date.toISOString())
    .toUTC()
    .toISO() as string;
  const monthWeeks = divideMonthIntoWeeks(startMonth);

  const ranges = monthWeeks.map((week) => {
    return {
      week: `week ${week.week!.toString()}`,
      from: week.interval.start?.toISO()!,
      to: week.interval.end?.toISO()!,
    };
  });

  return ranges;
}

export function convertToTime(hour: number) {
  // Handle 24 as a special case
  if (hour === 24) {
    hour = 0;
  }

  // Create a DateTime object for today at the specified hour
  const time = DateTime.local().set({
    hour: hour,
    minute: 0,
    second: 0,
    millisecond: 0,
  });

  // Format the time as HH:mm
  return time.toFormat("HH:mm");
}
