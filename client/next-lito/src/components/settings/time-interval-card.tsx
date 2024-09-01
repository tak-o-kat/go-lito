"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { useFormState } from "react-dom";
import {
  updateUserTheme,
  updateUserTimeInterval,
} from "@/app/actions/update-actions";
import { Button } from "../ui/button";
import { useState } from "react";

export default function TimeIntervalCard({
  timeInterval,
}: {
  timeInterval: string;
}) {
  const [state, formAction] = useFormState<any, FormData>(
    updateUserTimeInterval,
    undefined
  );
  const [selectValue, setSelectValue] = useState(timeInterval);

  const handleTimeIntervalDBChange = async (timeChange: string) => {
    setSelectValue(timeChange);
  };

  return (
    <form action={formAction}>
      <Card x-chunk="dashboard-04-chunk-1">
        <CardHeader>
          <CardTitle>Default Time Interval</CardTitle>
          <CardDescription>
            Used to change the time interval of your node data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select
            name="interval-db"
            value={selectValue}
            onValueChange={handleTimeIntervalDBChange}
          >
            <SelectTrigger className="sm:w-44">
              <SelectValue placeholder={"Select an interval"} />
            </SelectTrigger>
            <SelectContent id="interval-db">
              <SelectGroup>
                <SelectLabel>Default Time Interval</SelectLabel>
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
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button>Save Interval</Button>
        </CardFooter>
      </Card>
    </form>
  );
}
