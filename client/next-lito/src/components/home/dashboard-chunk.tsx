import { ComponentType } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CircleHelp } from "lucide-react";
import { defaultMaxListeners } from "events";

type ChunkType = {
  title: string;
  count: number;
  percentage: number;
  timeInterval: string;
  icon: ComponentType<{
    className?: string;
  }>;
  description: string;
};

export default function DashboardChunk(props: ChunkType) {
  const percentage =
    isNaN(props.percentage) || !isFinite(props.percentage)
      ? "0"
      : props.percentage.toFixed(2);

  let percentWording = "";
  switch (props.timeInterval) {
    case "24h":
      percentWording = "from yesterday";
      break;
    case "2d":
      percentWording = "from 2 days ago";
      break;
    case "3d":
      percentWording = "from 3 days ago";
      break;
    case "1w":
      percentWording = "from last week";
      break;
    case "2w":
      percentWording = "from 2 weeks ago";
      break;
    case "1m":
      percentWording = "from last month";
      break;
    case "3m":
      percentWording = "from 3 months ago";
      break;
    default:
      break;
  }

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
              <PopoverContent className="w-80 bg-primary">
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
        <p className="text-[10px] sm:text-xs text-muted-foreground">
          {parseFloat(percentage) >= 0 ? "+" : "-"}
          {`${Math.abs(parseFloat(percentage))}% ${percentWording}`}
        </p>
      </CardContent>
    </Card>
  );
}
