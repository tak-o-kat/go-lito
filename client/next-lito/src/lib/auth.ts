import { createTable, executeQuery, queryOne } from "@/lib/db";
import { hashPassword } from "@/lib/hashing";

export async function storeUser(username: string, password: string) {
  // Create users table if not exists
  console.log("Storing user in database");
  await createTable(
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT, 
      username TEXT, 
      password TEXT
    )`
  );

  // Hash password and store in DB
  const query = `INSERT INTO users (username, password) VALUES (?, ?)`;
  const hashedPassword = await hashPassword(password);
  try {
    await executeQuery(query, [username, hashedPassword]);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
