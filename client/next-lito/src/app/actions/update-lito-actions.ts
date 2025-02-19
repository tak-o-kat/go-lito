"use server";

import { getSession } from "@/lib/auth/session";

import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function updateLito(_prevState: any, formData: FormData) {
  const updateCommand = `sudo systemctl stop next-lito.service && sudo systemctl start next-lito.service`;

  const session = await getSession();
  if (!session) {
    return {
      error: "No session found",
    };
  }
  try {
    execAsync(updateCommand);
    return { success: true, message: "Update command sent successfully" };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
