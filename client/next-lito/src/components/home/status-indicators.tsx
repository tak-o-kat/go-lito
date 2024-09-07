import { GalleryHorizontalEnd, Cuboid, Network } from "lucide-react";
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
  let serverColor: string = "";

  if (isRunning === false) {
    status = "Down";
    nodeStatusColor = "text-rose-500";
    serverColor = "bg-rose-500";
  } else if (indicators?.Sync! !== "0.0s") {
    status = "Syncing";
    nodeStatusColor = "text-indigo-400 animate-pulse";
    serverColor = "bg-indogo-400";
  } else if (indicators?.Sync! === "0.0s") {
    status = "Up";
    nodeStatusColor = "text-teal-400";
    serverColor = "bg-teal-400";
  }

  return (
    <div className="flex items-center justify-center sm:justify-start gap-2 w-full">
      <div className="flex flex-row justify-center gap-2 w-full text-xs">
        <div className="flex justify-center md:justify-start items-center gap-4 w-full">
          <div className="font-medium flex flex-col sm:flex-row gap-1">
            <div className={`${serverColor} rounded-full w-3 h-3`} />
            <div className="font-medium flex flex-col sm:flex-row gap-1">
              <span className="hidden sm:block">{`Node Status: `}</span>
              <span
                className={` font-semibold text-[10px] sm:text-xs`}
              >{`${status}`}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-center md:justify-start items-center gap-4 w-full">
          <div className="font-medium flex flex-col sm:flex-row gap-1">
            <div className="flex justify-center">
              <GalleryHorizontalEnd className="h-4 w-4" />
            </div>
            <span className="hidden sm:block">{`Version: `}</span>
            <span className={` font-semibold text-[10px] sm:text-xs`}>{`${
              indicators.Version || " --"
            }`}</span>
          </div>
        </div>

        <div className="flex justify-center md:justify-start items-center gap-4 w-full">
          <div className="font-medium flex flex-col sm:flex-row gap-1">
            <div className="flex justify-center">
              <Network className="h-4 w-4" />
            </div>

            <span className="hidden sm:block">{`Network: `}</span>
            <span className={` font-semibold text-[10px] sm:text-xs`}>{`${
              indicators.Genesis || " --"
            }`}</span>
          </div>
        </div>

        <div className="flex justify-center md:justify-start items-center gap-4 w-full">
          <div className="font-medium flex flex-col sm:flex-row gap-1">
            <div className="flex justify-center">
              <Cuboid className="h-4 w-4" />
            </div>
            <span className="hidden sm:block">{`Last Block: `}</span>
            <span className={` font-semibold text-[10px] sm:text-xs`}>{`${
              indicators.Last || " --"
            }`}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
