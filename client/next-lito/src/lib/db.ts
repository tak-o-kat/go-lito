"use server";

import Database from "better-sqlite3";

const algoPath = process.env.ALGORAND_DATA;
const DB_PATH = `${algoPath}/lito/golito.db`;

let db: Database.Database | null = null;

async function getDb() {
  if (!db) {
    db = new Database(DB_PATH);
  }
  return db;
}

export async function executeQuery(query: string, params: string[] = []) {
  const db = await getDb();
  const statement = db.prepare(query);
  return statement.run(params);
}

export async function queryOne(query: string, params: string[] = []) {
  const db = await getDb();
  const statement = db.prepare(query);
  return statement.get(params);
}

export async function createTable(query: string) {
  const db = await getDb();
  db.exec(query);
}

export async function doesTableExist(tableName: string) {
  const db = await getDb();
  const query = `SELECT name FROM sqlite_master WHERE type='table' AND name = '${tableName}'`;
  const stmt = db.prepare(query);
  const rows = stmt.get();

  // if no rows are returned, then the table doesn't exist
  return rows ? true : false;
}
