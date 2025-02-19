"use server";

import { getSession } from "@/lib/auth/session";

import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function updateLito(_prevState: any, formData: FormData) {
  const updateCommand = `sudo systemctl stop lito.service && sudo systemctl stop next-lito.service && cd $LITO_FOLDER && \ 
      curl -s https://api.github.com/repos/tak-o-kat/go-lito/releases/latest | grep "browser_download_url.*update" | cut -d : -f 2,3 | tr -d \\" | wget -qO- -i - | tar xjf - && \ 
      sudo systemctl start lito.service && sudo systemctl start next-lito.service`;

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
