import { exec } from "child_process";

function parseGoalNodeStatus(text: string) {
  // Split the text into lines
  const lines = text.split("\n");

  // key words to look for in the lines
  const keys = [
    "Last committed block",
    "Time since last block",
    "Sync Time",
    "Genesis ID",
  ];
  // Create an object to store the grouped lines
  const groupedLines: { [key: string]: string } = {
    Last: "",
    Time: "",
    Sync: "",
    Genesis: "",
  };

  lines.forEach((line) => {
    // Trim the line and split it into words
    const key = line.trim().split(":");

    // Check if the first split is in the keys
    if (keys.includes(key[0])) {
      const firstWord = key[0].split(" ")[0];
      groupedLines[`${firstWord}`] = key[1].trim();
    }
  });

  return groupedLines;
}

function executeCommand(
  command: string
): Promise<{ success: boolean; output: string }> {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject({ success: false, error: error.message });
        return;
      }
      if (stderr) {
        reject({ success: false, error: stderr });
        return;
      }
      resolve({ success: true, output: stdout });
    });
  });
}

export const checkAlgodIsRunning = async () => {
  try {
    const cmdResp = await executeCommand("ps aux | grep algod | grep -v grep");
    if (cmdResp.success) {
      return cmdResp.output.includes("algod");
    }
  } catch (error) {
    return false;
  }
};

export type NodeStatus = {
  Last: string;
  Time: string;
  Sync: string;
  Genesis: string;
  Version: string;
};

export const getNodeStatus = async () => {
  let parsedStatus: NodeStatus = {
    Last: "",
    Time: "",
    Sync: "",
    Genesis: "",
    Version: "",
  };

  try {
    const statusResp = await executeCommand("goal node status");
    const parsed = parseGoalNodeStatus(statusResp.output);
    Object.assign(parsedStatus, parsed);
  } catch (error) {
    console.log(error);
  }

  try {
    const versionResp = await executeCommand(
      "goal -v | sed -n '2p' | awk '{print $1}'"
    );
    parsedStatus.Version = versionResp.output.trim();
  } catch (error) {
    console.log(error);
    return error;
  }
  return parsedStatus;
};
