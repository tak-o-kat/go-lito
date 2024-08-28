import { ComponentType } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CircleHelp } from "lucide-react";

type PropTypes = {
  title: string;
  count: number;
  percentage: number;
  timeInterval: string;
  icon: ComponentType<{
    className?: string;
  }>;
  description: string;
};

export default function DashboardChunk(props: PropTypes) {
  return (
    <Card className="w-full" x-chunk="dashboard-01-chunk-0">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex flex-row">
          {props.title}
          <span>
            <Popover>
              <PopoverTrigger asChild className="cursor-help">
                <CircleHelp className="ml-1 h-3 w-3 text-muted-foreground" />
              </PopoverTrigger>
              <PopoverContent className="w-96">
                <p>{props.title}</p>
                <p className="text-xs">{props.description}</p>
              </PopoverContent>
            </Popover>
          </span>
        </CardTitle>
        <props.icon className="h-6 w-6 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{props.count}</div>
        <p className="text-xs text-muted-foreground">
          {props.percentage > 0 ? "+" : "-"}
          {props.percentage}% from last {props.timeInterval}
        </p>
      </CardContent>
    </Card>
  );
}
