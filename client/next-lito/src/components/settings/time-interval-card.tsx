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
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="week">This week</SelectItem>
                <SelectItem value="lastweek">Last week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="lastmonth">last Month</SelectItem>
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
