import { createTable, doesTableExist, executeQuery, queryOne } from "@/lib/db";
import { hashPassword } from "@/lib/hashing";
import { FormValues } from "./session";

export async function storeUser(username: string, password: string) {
  // Create users table if not exists
  try {
    await createTable(
      `CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT, 
          username TEXT UNIQUE NOT NULL, 
          password TEXT NOT NULL
        )`
    );
  } catch (error) {
    throw error;
  }

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

export async function doesAtLeastOneUserExist() {
  // check if users table exists
  const tableExists = await doesTableExist("users");
  if (!tableExists) {
    return false;
  }

  const query = `SELECT * FROM users LIMIT 1`;
  const user = await queryOne(query, []);
  const userExists = user ? true : false;
  return userExists;
}
