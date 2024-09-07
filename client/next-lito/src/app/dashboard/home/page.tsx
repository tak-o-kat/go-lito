import { getSession } from "@/lib/auth/session";
import StatusIndicators from "@/components/home/status-indicators";

import TimeIntervalSelect from "@/components/home/time-interval-select";
import DashboardHomeTotals from "@/components/home/home-totals";
import { checkAlgodIsRunning } from "@/lib/cmd/goal-commands";
import {
  generateLitoDateTimeFromInterval,
  isPreviousDay,
} from "@/lib/datetime";
import { getTotalsAndPercentageFromTimeInterval } from "@/lib/db/get-totals-data";
import { CurrentDataType, HomeTotals } from "@/lib/types";
import HomeCharts from "@/components/home/home-charts";
import { GOLITO_API, SOFT_VOTES, CERT_VOTES } from "@/lib/const";
import { DateTime } from "luxon";

async function getCurrentNodeLogData() {
  // Make a call to get the the current data from the node.log file
  const url = `${GOLITO_API}/api/logs/`;
  const response = await fetch(url, {
    next: {
      revalidate: 60,
    },
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to get log data");
  }

  const data = await response.json();
  return data;
}

function generateCurrentDataObject(currentData: any, interval: string) {
  // With the current data we need to parse the data and return an object that
  // further function calls can use to add their counts in totals and charts.
  const currentDataObj = {
    dateOverlaps: false,
    interval: interval,
    todaysTotals: {
      onChain: 0,
      proposals: 0,
      softVotes: 0,
      certVotes: 0,
    },
    yesterdayTotals: {
      onChain: 0,
      proposals: 0,
      softVotes: 0,
      certVotes: 0,
    },
  };

  // Check if the current day overlaps with the previous days data
  const currentDay = DateTime.now().toUTC().startOf("day");

  // Get the first date from the current data and check if it is the previous day
  const firstDate = currentData.Votes[0].time;
  currentDataObj.dateOverlaps = isPreviousDay(firstDate) ? true : false;

  const currentDayISO = currentDay.toISO();
  // Get the current days totals
  for (const proposed of currentData.Proposed) {
    if (proposed.time >= currentDayISO) {
      if (proposed.IsOnChain === true) {
        currentDataObj.todaysTotals.onChain++;
      } else {
        currentDataObj.todaysTotals.proposals++;
      }
    }
    if (proposed.time <= currentDayISO) {
      if (proposed.IsOnChain === true) {
        currentDataObj.yesterdayTotals.onChain++;
      } else {
        currentDataObj.yesterdayTotals.proposals++;
      }
    }
  }

  // Get the previous days totals
  for (const vote of currentData.Votes) {
    if (vote.time >= currentDayISO) {
      if (vote.ObjectStep === SOFT_VOTES) {
        currentDataObj.todaysTotals.softVotes++;
      } else if (vote.ObjectStep === CERT_VOTES) {
        currentDataObj.todaysTotals.certVotes++;
      }
    }
    if (vote.time <= currentDayISO) {
      if (vote.ObjectStep === SOFT_VOTES) {
        currentDataObj.yesterdayTotals.softVotes++;
      } else if (vote.ObjectStep === CERT_VOTES) {
        currentDataObj.yesterdayTotals.certVotes++;
      }
    }
  }

  return currentDataObj;
}

export default async function Home() {
  const session = await getSession();
  const isAlgodRunning = (await checkAlgodIsRunning()) as boolean;

  const currentData = await getCurrentNodeLogData();
  currentData.interval = session?.interval as string;

  // With the current data we need to parse the data and return an object that
  // further function calls can use to add their counts in totals and charts.
  const currentDataObj: CurrentDataType = generateCurrentDataObject(
    currentData,
    session?.interval as string
  );

  // console.log("currentDataObj", currentDataObj);

  const timeRange = generateLitoDateTimeFromInterval(
    (session?.interval as string) || "today"
  );

  // determine the time interval and query the data based on those ranges.
  // Get the previous time interval data to dertermin the percentage change.
  const totals: HomeTotals = await getTotalsAndPercentageFromTimeInterval(
    session?.interval as string,
    timeRange.from,
    timeRange.to,
    currentDataObj
  );

  // Make a call to get the the current data from the node.log file

  return (
    <main className="mx-auto max-w-6xl px-2 space-y-3 sm:space-y-4 my-3 sm:my-4">
      <div className="flex flex-col sm:flex-row sm:gap-2 w-full">
        <div className="flex w-full flex-row">
          <StatusIndicators />
        </div>
      </div>
      <div className="flex flex-row justify-end md:w-auto pt-3 sm:pt-0">
        <TimeIntervalSelect timeInterval={session?.interval as string} />
      </div>
      <DashboardHomeTotals
        totals={totals}
        interval={session?.interval as string}
        isAlgodRunning={isAlgodRunning}
      />
      <HomeCharts
        interval={session?.interval as string}
        timeRange={timeRange}
        currentData={currentData}
      />
    </main>
  );
}
