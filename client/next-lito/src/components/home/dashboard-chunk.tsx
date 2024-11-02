import { ComponentType, Suspense, use } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CircleHelp, Loader2Icon } from "lucide-react";
import { HomeTotals, TotalChunkType } from "@/lib/types";

function InternalTotalsData(props: { data: Promise<TotalChunkType> }) {
  const totals = use(props.data);
  const percentage =
    isNaN(totals.percentage) || !isFinite(totals.percentage)
      ? "0"
      : totals.percentage.toFixed(1);

  let percentWording = "";
  switch (totals.timeInterval) {
    case "today":
      percentWording = "from the previous day";
      break;
    case "yesterday":
      percentWording = "from the previous day";
      break;
    case "week":
      percentWording = "from the previous week";
      break;
    case "lastweek":
      percentWording = "from the previous week";
      break;
    case "month":
      percentWording = "from the previous month";
      break;
    case "lastmonth":
      percentWording = "from the previous month";
      break;
    default:
      break;
  }
  return (
    <>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex flex-row">
          {totals.title}
          <span>
            <Popover>
              <PopoverTrigger asChild className="cursor-help">
                <CircleHelp className="ml-1 h-3 w-3 text-muted-foreground" />
              </PopoverTrigger>
              <PopoverContent className="w-80 bg-primary">
                <p>{totals.title}</p>
                <p className="text-xs">{totals.description}</p>
              </PopoverContent>
            </Popover>
          </span>
        </CardTitle>
        <totals.icon className="h-6 w-6 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{totals.count}</div>
        <p className="text-[10px] sm:text-xs text-muted-foreground">
          {parseFloat(percentage) >= 0 ? "+" : "-"}
          {`${Math.abs(parseFloat(percentage))}% ${percentWording}`}
        </p>
      </CardContent>
    </>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex flex-row justify-center items-center min-h-32">
      <Loader2Icon className="h-12 w-12 animate-spin" />
    </div>
  );
}

// export default function DashboardChunk(props: {
//   data: Promise<TotalChunkType>;
// }) {
export default function DashboardChunk(props: TotalChunkType) {
  const percentage =
    isNaN(props.percentage) || !isFinite(props.percentage)
      ? "0"
      : props.percentage.toFixed(1);

  let percentWording = "";
  switch (props.timeInterval) {
    case "today":
      percentWording = "from the previous day";
      break;
    case "yesterday":
      percentWording = "from the previous day";
      break;
    case "week":
      percentWording = "from the previous week";
      break;
    case "lastweek":
      percentWording = "from the previous week";
      break;
    case "month":
      percentWording = "from the previous month";
      break;
    case "lastmonth":
      percentWording = "from the previous month";
      break;
    default:
      break;
  }

  return (
    <Card className="w-full sm:h-32 h-36" x-chunk="dashboard-01-chunk-0">
      {/* <Suspense fallback={<LoadingSpinner />}>
        <InternalTotalsData data={props.data} />
      </Suspense> */}
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex flex-row">
          {props.title}
          <span>
            <Popover>
              <PopoverTrigger asChild className="cursor-help">
                <CircleHelp className="ml-1 h-3 w-3 text-muted-foreground" />
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <p>{props.title}</p>
                <p className="text-xs">{props.description}</p>
              </PopoverContent>
            </Popover>
          </span>
        </CardTitle>
        <props.icon className="h-6 w-6 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="flex flex-row items-center justify-between">
          <div className="text-2xl font-bold">{props.count}</div>
          {props?.winRate !== undefined && props.winRate >= 0 ? (
            <div className="flex flex-col text-xs">
              <span className="flex justify-end">
                {props?.winRate?.toFixed(1) || 0}%
                <span>
                  <Popover>
                    <PopoverTrigger asChild className="cursor-help">
                      <CircleHelp className="ml-1 size-3 text-muted-foreground" />
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <p>Win Rate</p>
                      <p className="text-xs">
                        This is the percentange of VRF wins your node has won
                        compared to the total blocks proposed
                      </p>
                    </PopoverContent>
                  </Popover>
                </span>
              </span>
            </div>
          ) : null}
        </div>
        <p className="text-[10px] sm:text-xs text-muted-foreground">
          {parseFloat(percentage) >= 0 ? "+" : "-"}
          {`${Math.abs(parseFloat(percentage))}% ${percentWording}`}
        </p>
      </CardContent>
    </Card>
  );
}
