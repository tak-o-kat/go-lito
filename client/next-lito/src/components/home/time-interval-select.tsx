"use client";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
} from "@/components/ui/select";
import { useState } from "react";
import {
  updateTimeIntervalSession,
  updateUserTimeInterval,
} from "@/app/actions/update-actions";

export default function TimeIntervalSelect({
  timeInterval,
}: {
  timeInterval: string;
}) {
  const [state, setState] = useState(timeInterval);

  const handleTimeIntervalChange = async (timeChange: string) => {
    setState(timeChange);
    await updateTimeIntervalSession(timeChange);
  };

  return (
    <Select
      name="interval-session"
      value={state}
      onValueChange={handleTimeIntervalChange}
    >
      <SelectTrigger className="sm:w-44">
        <SelectValue placeholder={"Select an interval"} />
      </SelectTrigger>
      <SelectContent id="interval-session">
        <SelectGroup>
          <SelectLabel>Time Interval</SelectLabel>
          <SelectSeparator />
          <SelectItem value="today">Today</SelectItem>
          <SelectItem value="yesterday">Yesterday</SelectItem>
          <SelectItem value="week">This week</SelectItem>
          <SelectItem value="lastweek">Last week</SelectItem>
          <SelectItem value="month">This Month</SelectItem>
          <SelectItem value="lastmonth">Last Month</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
