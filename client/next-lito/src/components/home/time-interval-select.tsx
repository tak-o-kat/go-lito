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
          <SelectItem value="24h">Last 24 Hours</SelectItem>
          <SelectItem value="7d">Last 7 Days</SelectItem>
          <SelectItem value="1m">Last 1 Month</SelectItem>
          <SelectItem value="3m">Last 3 Months</SelectItem>
          <SelectItem value="6m">Last 6 Months</SelectItem>
          <SelectItem value="1y">Last Year</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
