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
