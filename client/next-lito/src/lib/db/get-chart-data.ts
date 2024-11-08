import { CERT_VOTES, ON_CHAIN, PROPOSALS, SOFT_VOTES } from "../const";
import { convertToTime } from "../datetime";
import {
  CurrentDataType,
  DayChartDBType,
  DayChartDateRange,
  MonthChartDBType,
  MonthChartDateRange,
  WeekChartDBType,
  WeekChartDateRange,
} from "../types";
import { queryOne } from "./db";

function addCurrentDataToDayChartData(
  currData: any,
  dbData: DayChartDBType,
  rangeObj: DayChartDateRange[]
) {
  // Loop through the proposed data searching for onchain and proposals in date ranges
  for (const proposed of currData.Proposed) {
    if (proposed.time >= rangeObj[0].from && proposed.time <= rangeObj[0].to) {
      if (proposed.IsOnChain === true) {
        dbData.hours1++;
      } else {
        dbData.hours5++;
      }
    } else if (
      proposed.time >= rangeObj[1].from &&
      proposed.time <= rangeObj[1].to
    ) {
      if (proposed.IsOnChain === true) {
        dbData.hours2++;
      } else {
        dbData.hours6++;
      }
    } else if (
      proposed.time >= rangeObj[2].from &&
      proposed.time <= rangeObj[2].to
    ) {
      if (proposed.IsOnChain === true) {
        dbData.hours3++;
      } else {
        dbData.hours7++;
      }
    } else if (
      proposed.time >= rangeObj[3].from &&
      proposed.time <= rangeObj[3].to
    ) {
      if (proposed.IsOnChain === true) {
        dbData.hours4++;
      } else {
        dbData.hours8++;
      }
    }
  }

  // Loop through the votes data searching for soft and cert votes in date ranges
  for (const vote of currData.Votes) {
    if (vote.time >= rangeObj[0].from && vote.time <= rangeObj[0].to) {
      if (vote.ObjectStep === SOFT_VOTES) {
        dbData.hours9++;
      } else if (vote.ObjectStep === CERT_VOTES) {
        dbData.hours13++;
      }
    } else if (vote.time >= rangeObj[1].from && vote.time <= rangeObj[1].to) {
      if (vote.ObjectStep === SOFT_VOTES) {
        dbData.hours10++;
      } else if (vote.ObjectStep === CERT_VOTES) {
        dbData.hours14++;
      }
    } else if (vote.time >= rangeObj[2].from && vote.time <= rangeObj[2].to) {
      if (vote.ObjectStep === SOFT_VOTES) {
        dbData.hours11++;
      } else if (vote.ObjectStep === CERT_VOTES) {
        dbData.hours15++;
      }
    } else if (vote.time >= rangeObj[3].from && vote.time <= rangeObj[3].to) {
      if (vote.ObjectStep === SOFT_VOTES) {
        dbData.hours12++;
      } else if (vote.ObjectStep === CERT_VOTES) {
        dbData.hours16++;
      }
    }
  }

  return dbData;
}

export const getChartDataForDay = async (
  rangeObj: DayChartDateRange[],
  currentData: any
) => {
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
  let dbData = (await queryOne(query, extendedRangeDates)) as DayChartDBType;
  if (
    currentData.interval === "today" ||
    currentData.interval === "yesterday"
  ) {
    dbData = addCurrentDataToDayChartData(currentData, dbData, rangeObj);
  }

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

function addCurrentDataToWeekChartData(
  currData: any,
  dbData: WeekChartDBType,
  rangeObj: WeekChartDateRange[]
) {
  // Loop through the proposed data searching for onchain and proposals in date ranges
  for (const proposed of currData.Proposed) {
    if (proposed.time >= rangeObj[0].from && proposed.time <= rangeObj[0].to) {
      if (proposed.IsOnChain === true) {
        dbData.day1++;
      } else {
        dbData.day8++;
      }
    } else if (
      proposed.time >= rangeObj[1].from &&
      proposed.time <= rangeObj[1].to
    ) {
      if (proposed.IsOnChain === true) {
        dbData.day2++;
      } else {
        dbData.day9++;
      }
    } else if (
      proposed.time >= rangeObj[2].from &&
      proposed.time <= rangeObj[2].to
    ) {
      if (proposed.IsOnChain === true) {
        dbData.day3++;
      } else {
        dbData.day10++;
      }
    } else if (
      proposed.time >= rangeObj[3].from &&
      proposed.time <= rangeObj[3].to
    ) {
      if (proposed.IsOnChain === true) {
        dbData.day4++;
      } else {
        dbData.day11++;
      }
    } else if (
      proposed.time >= rangeObj[4].from &&
      proposed.time <= rangeObj[4].to
    ) {
      if (proposed.IsOnChain === true) {
        dbData.day5++;
      } else {
        dbData.day12++;
      }
    } else if (
      proposed.time >= rangeObj[5].from &&
      proposed.time <= rangeObj[5].to
    ) {
      if (proposed.IsOnChain === true) {
        dbData.day6++;
      } else {
        dbData.day13++;
      }
    } else if (
      proposed.time >= rangeObj[6].from &&
      proposed.time <= rangeObj[6].to
    ) {
      if (proposed.IsOnChain === true) {
        dbData.day7++;
      } else {
        dbData.day14++;
      }
    }
  }

  // Loop through the votes data searching for soft and cert votes in date ranges
  for (const vote of currData.Votes) {
    if (vote.time >= rangeObj[0].from && vote.time <= rangeObj[0].to) {
      if (vote.ObjectStep === SOFT_VOTES) {
        dbData.day15++;
      } else if (vote.ObjectStep === CERT_VOTES) {
        dbData.day22++;
      }
    } else if (vote.time >= rangeObj[1].from && vote.time <= rangeObj[1].to) {
      if (vote.ObjectStep === SOFT_VOTES) {
        dbData.day16++;
      } else if (vote.ObjectStep === CERT_VOTES) {
        dbData.day23++;
      }
    } else if (vote.time >= rangeObj[2].from && vote.time <= rangeObj[2].to) {
      if (vote.ObjectStep === SOFT_VOTES) {
        dbData.day17++;
      } else if (vote.ObjectStep === CERT_VOTES) {
        dbData.day24++;
      }
    } else if (vote.time >= rangeObj[3].from && vote.time <= rangeObj[3].to) {
      if (vote.ObjectStep === SOFT_VOTES) {
        dbData.day18++;
      } else if (vote.ObjectStep === CERT_VOTES) {
        dbData.day25++;
      }
    } else if (vote.time >= rangeObj[4].from && vote.time <= rangeObj[4].to) {
      if (vote.ObjectStep === SOFT_VOTES) {
        dbData.day19++;
      } else if (vote.ObjectStep === CERT_VOTES) {
        dbData.day26++;
      }
    } else if (vote.time >= rangeObj[5].from && vote.time <= rangeObj[5].to) {
      if (vote.ObjectStep === SOFT_VOTES) {
        dbData.day20++;
      } else if (vote.ObjectStep === CERT_VOTES) {
        dbData.day27++;
      }
    } else if (vote.time >= rangeObj[6].from && vote.time <= rangeObj[6].to) {
      if (vote.ObjectStep === SOFT_VOTES) {
        dbData.day21++;
      } else if (vote.ObjectStep === CERT_VOTES) {
        dbData.day28++;
      }
    }
  }
  return dbData;
}

export const getChartDataForWeek = async (
  rangeObj: WeekChartDateRange[],
  currentData: any
) => {
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
  let dbData = (await queryOne(query, extendedRangeDates)) as WeekChartDBType;
  if (currentData.interval === "week") {
    dbData = addCurrentDataToWeekChartData(currentData, dbData, rangeObj);
  }

  return {
    onChain: [
      {
        day: `${rangeObj[0].day}, ${rangeObj[0].from.split("T")[0]}`,
        onChain: dbData.day1,
      },
      {
        day: `${rangeObj[1].day}, ${rangeObj[1].from.split("T")[0]}`,
        onChain: dbData.day2,
      },
      {
        day: `${rangeObj[2].day}, ${rangeObj[2].from.split("T")[0]}`,
        onChain: dbData.day3,
      },
      {
        day: `${rangeObj[3].day}, ${rangeObj[3].from.split("T")[0]}`,
        onChain: dbData.day4,
      },
      {
        day: `${rangeObj[4].day}, ${rangeObj[4].from.split("T")[0]}`,
        onChain: dbData.day5,
      },
      {
        day: `${rangeObj[5].day}, ${rangeObj[5].from.split("T")[0]}`,
        onChain: dbData.day6,
      },
      {
        day: `${rangeObj[6].day}, ${rangeObj[6].from.split("T")[0]}`,
        onChain: dbData.day7,
      },
    ],
    proposals: [
      {
        day: `${rangeObj[0].day}, ${rangeObj[0].from.split("T")[0]}`,
        proposals: dbData.day8,
      },
      {
        day: `${rangeObj[1].day}, ${rangeObj[1].from.split("T")[0]}`,
        proposals: dbData.day9,
      },
      {
        day: `${rangeObj[2].day}, ${rangeObj[2].from.split("T")[0]}`,
        proposals: dbData.day10,
      },
      {
        day: `${rangeObj[3].day}, ${rangeObj[3].from.split("T")[0]}`,
        proposals: dbData.day11,
      },
      {
        day: `${rangeObj[4].day}, ${rangeObj[4].from.split("T")[0]}`,
        proposals: dbData.day12,
      },
      {
        day: `${rangeObj[5].day}, ${rangeObj[5].from.split("T")[0]}`,
        proposals: dbData.day13,
      },
      {
        day: `${rangeObj[6].day}, ${rangeObj[6].from.split("T")[0]}`,
        proposals: dbData.day14,
      },
    ],
    softVotes: [
      {
        day: `${rangeObj[0].day}, ${rangeObj[0].from.split("T")[0]}`,
        softVotes: dbData.day15,
      },
      {
        day: `${rangeObj[1].day}, ${rangeObj[1].from.split("T")[0]}`,
        softVotes: dbData.day16,
      },
      {
        day: `${rangeObj[2].day}, ${rangeObj[2].from.split("T")[0]}`,
        softVotes: dbData.day17,
      },
      {
        day: `${rangeObj[3].day}, ${rangeObj[3].from.split("T")[0]}`,
        softVotes: dbData.day18,
      },
      {
        day: `${rangeObj[4].day}, ${rangeObj[4].from.split("T")[0]}`,
        softVotes: dbData.day19,
      },
      {
        day: `${rangeObj[5].day}, ${rangeObj[5].from.split("T")[0]}`,
        softVotes: dbData.day20,
      },
      {
        day: `${rangeObj[6].day}, ${rangeObj[6].from.split("T")[0]}`,
        softVotes: dbData.day21,
      },
    ],
    certVotes: [
      {
        day: `${rangeObj[0].day}, ${rangeObj[0].from.split("T")[0]}`,
        certVotes: dbData.day22,
      },
      {
        day: `${rangeObj[1].day}, ${rangeObj[1].from.split("T")[0]}`,
        certVotes: dbData.day23,
      },
      {
        day: `${rangeObj[2].day}, ${rangeObj[2].from.split("T")[0]}`,
        certVotes: dbData.day24,
      },
      {
        day: `${rangeObj[3].day}, ${rangeObj[3].from.split("T")[0]}`,
        certVotes: dbData.day25,
      },
      {
        day: `${rangeObj[4].day}, ${rangeObj[4].from.split("T")[0]}`,
        certVotes: dbData.day26,
      },
      {
        day: `${rangeObj[5].day}, ${rangeObj[5].from.split("T")[0]}`,
        certVotes: dbData.day27,
      },
      {
        day: `${rangeObj[6].day}, ${rangeObj[6].from.split("T")[0]}`,
        certVotes: dbData.day28,
      },
    ],
  };
};

function addCurrentDataToMonthChartData(
  currData: any,
  dbData: MonthChartDBType,
  rangeObj: MonthChartDateRange[]
) {
  // Loop through the proposed data searching for onchain and proposals in date ranges
  for (const proposed of currData.Proposed) {
    if (proposed.time >= rangeObj[0].from && proposed.time <= rangeObj[0].to) {
      if (proposed.IsOnChain === true) {
        dbData.week1++;
      } else {
        dbData.week5++;
      }
    } else if (
      proposed.time >= rangeObj[1].from &&
      proposed.time <= rangeObj[1].to
    ) {
      if (proposed.IsOnChain === true) {
        dbData.week2++;
      } else {
        dbData.week6++;
      }
    } else if (
      proposed.time >= rangeObj[2].from &&
      proposed.time <= rangeObj[2].to
    ) {
      if (proposed.IsOnChain === true) {
        dbData.week3++;
      } else {
        dbData.week7++;
      }
    } else if (
      proposed.time >= rangeObj[3].from &&
      proposed.time <= rangeObj[3].to
    ) {
      if (proposed.IsOnChain === true) {
        dbData.week4++;
      } else {
        dbData.week8++;
      }
    }
  }

  // Loop through the votes data searching for soft and cert votes in date ranges
  for (const vote of currData.Votes) {
    if (vote.time >= rangeObj[0].from && vote.time <= rangeObj[0].to) {
      if (vote.ObjectStep === SOFT_VOTES) {
        dbData.week9++;
      } else if (vote.ObjectStep === CERT_VOTES) {
        dbData.week13++;
      }
    } else if (vote.time >= rangeObj[1].from && vote.time <= rangeObj[1].to) {
      if (vote.ObjectStep === SOFT_VOTES) {
        dbData.week10++;
      } else if (vote.ObjectStep === CERT_VOTES) {
        dbData.week14++;
      }
    } else if (vote.time >= rangeObj[2].from && vote.time <= rangeObj[2].to) {
      if (vote.ObjectStep === SOFT_VOTES) {
        dbData.week11++;
      } else if (vote.ObjectStep === CERT_VOTES) {
        dbData.week15++;
      }
    } else if (vote.time >= rangeObj[3].from && vote.time <= rangeObj[3].to) {
      if (vote.ObjectStep === SOFT_VOTES) {
        dbData.week12++;
      } else if (vote.ObjectStep === CERT_VOTES) {
        dbData.week16++;
      }
    }
  }
  return dbData;
}

export const getChartDataForMonth = async (
  rangeObj: MonthChartDateRange[],
  currentData: any
) => {
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
  let dbData = (await queryOne(query, extendedRangeDates)) as MonthChartDBType;

  if (currentData.interval === "month") {
    dbData = addCurrentDataToMonthChartData(currentData, dbData, rangeObj);
  }

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
