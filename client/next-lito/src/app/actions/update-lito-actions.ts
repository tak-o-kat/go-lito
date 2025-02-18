"use server";

import { getSession } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";

import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function updateLito(_prevState: any, formData: FormData) {
  const updateCommand = `sudo systemctl stop lito.service && cd $LITO_FOLDER && \ 
      curl -s https://api.github.com/repos/tak-o-kat/go-lito/releases/latest | grep "browser_download_url.*update" | cut -d : -f 2,3 | tr -d \\" | wget -qO- -i - | tar xjf - && \ 
      sudo systemctl start lito.service`;

  const session = await getSession();
  if (!session) {
    return {
      error: "No session found",
    };
  }
  try {
    const { stdout, stderr } = await execAsync(updateCommand);
    if (stderr) {
      throw new Error(stderr);
    }
    console.log({ success: true, output: stdout });
  } catch (error: any) {
    console.log({ success: false, error: error.message });
  }

  // save theme in session
  revalidatePath("/", "layout");
}
