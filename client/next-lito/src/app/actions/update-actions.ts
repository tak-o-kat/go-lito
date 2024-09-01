"use server";

import { executeQuery } from "@/lib/db/db";
import { FormValues, getSession } from "@/lib/auth/session";
import { hashPassword } from "@/lib/auth/hashing";
import { revalidatePath } from "next/cache";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { queryOne } from "@/lib/db/db";
import { user } from "@/lib/types";
import { SessionData, sessionOptions } from "@/lib/auth/session";

export async function updateUserTheme(_prevState: any, formData: FormData) {
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
  await session.save();
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

export async function updateUserTimeInterval(
  _prevState: any,
  formData: FormData
) {
  const session = await getSession();
  const username = session?.username as string;
  const interval = formData.get("interval-db") as string;

  if (session.isLoggedIn) {
    const query = `UPDATE users SET interval = ? WHERE username = ?`;
    try {
      await executeQuery(query, [interval, username]);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  session.interval = interval;
  await session.save();
  revalidatePath("/", "layout");
}

export async function syncSession() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

  // Sync session data with the database
  if (session.isLoggedIn) {
    const query = `SELECT * FROM users WHERE id = ? LIMIT 1`;
    const id = session?.id?.toString() as string;
    const user = (await queryOne(query, [id])) as user;

    if (user) {
      Object.assign(session, user);
      await session.save();
    }
  }
}

export async function updateTimeIntervalSession(timeInterval: string) {
  const session = await getSession();
  if (!session.isLoggedIn) {
    return {
      error: "No session found",
    };
  }

  session.interval = timeInterval;
  session.save();
  revalidatePath("/", "layout");
}
