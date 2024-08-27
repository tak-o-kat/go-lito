"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { executeQuery } from "@/lib/db";
import { FormValues, getSession } from "@/lib/session";
import { hashPassword } from "@/lib/hashing";
import { revalidatePath } from "next/cache";

export async function updateUserTheme(_prevState: any, formData: FormData) {
  console.log("Theme here");
  const session = await getSession();
  if (!session) {
    return {
      error: "No session found",
    };
  }
  const userName = session?.username as string;
  const theme = formData.get("theme") as string;
  const query = `UPDATE users SET theme = ? WHERE username = ?`;
  try {
    await executeQuery(query, [theme, userName]);
  } catch (error) {
    console.log(error);
    throw error;
  }
  // save theme in session
  session.theme = theme;
  session.save();
  revalidatePath("/", "layout");
}

export async function updateUserPassword(
  username: string,
  formValues: FormValues
) {
  const query = `UPDATE users SET password = ? WHERE username = ?`;
  const hashedPassword = await hashPassword(formValues.password);
  try {
    await executeQuery(query, [hashedPassword, username]);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
