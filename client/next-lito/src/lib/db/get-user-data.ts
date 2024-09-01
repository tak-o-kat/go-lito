import { getSession } from "../auth/session";
import { queryOne } from "./db";
import { user } from "../types";

export async function getUserTimeInterval() {
  const session = await getSession();
  const query = `SELECT interval FROM users WHERE id = ? LIMIT 1`;
  const id = session?.id?.toString() as string;

  try {
    const user = (await queryOne(query, [id])) as user;
    return user.interval;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
