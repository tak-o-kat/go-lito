import { Card } from "@/components/ui/card";
import {
  checkAlgodIsRunning,
  getNodeStatus,
  NodeStatus,
} from "@/lib/cmd/goal-commands";

export default async function StatusIndicators() {
  const isRunning = await checkAlgodIsRunning();
  const indicators: any | NodeStatus = isRunning && (await getNodeStatus());
  let status: string = "";
  let nodeStatusColor: string = "";

  if (isRunning === false) {
    status = "Down";
    nodeStatusColor = "text-rose-500";
  } else if (indicators?.Sync! !== "0.0s") {
    status = "Syncing";
    nodeStatusColor = "text-indigo-400 animate-pulse";
  } else if (indicators?.Sync! === "0.0s") {
    status = "Up";
    nodeStatusColor = "text-teal-400";
  }

  return (
    <div className="flex items-center justify-center sm:justify-start gap-2">
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        <Card className="p-2 text-xs md:text-sm">
          Node Status:{" "}
          <span className={`${nodeStatusColor} font-semibold`}>{status}</span>
        </Card>
        <Card className="p-2 text-xs md:text-sm">
          Last block:{" "}
          <span className={`${nodeStatusColor} font-semibold`}>
            {indicators?.Last || " --"}
          </span>
        </Card>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        <Card className="p-2 text-xs md:text-sm">
          Version:{" "}
          <span className={`${nodeStatusColor} font-semibold`}>
            {indicators?.Version || " --"}
          </span>
        </Card>
        <Card className="p-2 text-xs md:text-sm">
          Network:{" "}
          <span className={`${nodeStatusColor} font-semibold`}>
            {indicators?.Genesis || " --"}
          </span>
        </Card>
      </div>
    </div>
  );
}
