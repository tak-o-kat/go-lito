// functions used to help generate datetimes and ranges

import { DateTime } from "luxon";

// Generate a Lito datetime string from an interval string return UTC time
export function generateLitoDateTimeFromInterval(interval: string) {
  const dt = DateTime.fromJSDate(new Date());
  let from = dt.toUTC().toISO() as string;
  let to = dt.toUTC().toISO() as string;

  switch (interval) {
    case "24h":
      from = dt.minus({ hours: 24 }).toUTC().toISO() as string;
      break;
    case "2d":
      from = dt.minus({ days: 2 }).toUTC().toISO() as string;
      break;
    case "3d":
      from = dt.minus({ days: 3 }).toUTC().toISO() as string;
      break;
    case "1w":
      from = dt.minus({ week: 1 }).toUTC().toISO() as string;
      break;
    case "2w":
      from = dt.minus({ weeks: 2 }).toUTC().toISO() as string;
      break;
    case "1m":
      from = dt.minus({ month: 1 }).toUTC().toISO() as string;
      break;
    case "3m":
      from = dt.minus({ months: 3 }).toUTC().toISO() as string;
      break;
    default:
      break;
  }
  return { from, to };
}

export function generatePrevLitoDateTimeFromInterval(
  interval: string,
  currentFrom: string
) {
  const dt = DateTime.fromISO(currentFrom).toUTC();
  let from = dt.toUTC().toISO() as string;
  let to = dt.toUTC().toISO() as string;

  switch (interval) {
    case "24h":
      from = dt.minus({ hours: 24 }).toUTC().toISO() as string;
      to = dt.minus({ milliseconds: 1 }).toUTC().toISO() as string;
      break;
    case "2d":
      from = dt.minus({ days: 2 }).toUTC().toISO() as string;
      to = dt.minus({ milliseconds: 1 }).toUTC().toISO() as string;
      break;
    case "3d":
      from = dt.minus({ days: 3 }).toUTC().toISO() as string;
      to = dt.minus({ milliseconds: 1 }).toUTC().toISO() as string;
      break;
    case "1w":
      from = dt.minus({ week: 1 }).toUTC().toISO() as string;
      to = dt.minus({ milliseconds: 1 }).toUTC().toISO() as string;
      break;
    case "2w":
      from = dt.minus({ weeks: 2 }).toUTC().toISO() as string;
      to = dt.minus({ milliseconds: 1 }).toUTC().toISO() as string;
      break;
    case "1m":
      from = dt.minus({ months: 1 }).toUTC().toISO() as string;
      to = dt.minus({ milliseconds: 1 }).toUTC().toISO() as string;
      break;
    case "3m":
      from = dt.minus({ months: 6 }).toUTC().toISO() as string;
      to = dt.minus({ milliseconds: 1 }).toUTC().toISO() as string;
      break;
    default:
      break;
  }

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
