import { QueryResult } from "pg";
import pool from "../psql";
import { UpdateFields } from "../types/request-body";

async function getAllStudents(): Promise<any[]> {
  try {
    const result: QueryResult = await pool.query('SELECT * FROM users."User" WHERE role = $1', ['student']);
    return result.rows;
  } catch (error) {
    throw error;
  }
};

async function checkDatabase(): Promise<QueryResult> {
  const result: QueryResult = await pool.query('SELECT * FROM users."User"');
  return result;
}

async function getUserByUserId(uid: number): Promise<QueryResult> {
  const result: QueryResult = await pool.query(
    'SELECT * FROM users."User" WHERE uid = $1',
    [uid]
  );
  return result;
}

async function getUserByEmail(email: string): Promise<QueryResult> {
  const result: QueryResult = await pool.query(
    'SELECT * FROM users."User" WHERE email = $1',
    [email]
  );
  return result;
}

async function findUser(uid: number, email: string): Promise<QueryResult> {
  const result: QueryResult = await pool.query(
    'SELECT * FROM users."User" WHERE uid = $1 AND email = $2',
    [uid, email]
  );
  return result;
}

async function createNewUser(
  name: string,
  major: string,
  email: string,
  hash: string,
  role: string
): Promise<number> {
  const result: QueryResult = await pool.query(
    `INSERT INTO users."User" (name, major, email, password, bio, "avatarUrl", role)
          VALUES ($1, $2, $3, $4, '', '', $5)
          RETURNING uid;`,
    [name, major, email, hash, role]
  );
  const uid: number = result.rows[0].uid;
  console.log(uid);
  return uid;
}

async function updateUserPassword(uid: number, hash: string): Promise<void> {
  await pool.query(
    `UPDATE users."User" SET password = $2
          WHERE uid = $1`,
    [uid, hash]
  );
}

async function updateUserInfo(
  uid: number,
  updateFields: UpdateFields
): Promise<void> {
  const fieldsToUpdate = Object.keys(updateFields)
    .map((key, index) => `${key} = $${index + 2}`)
    .join(", ");

  const query = {
    text: `UPDATE users."User" SET ${fieldsToUpdate} WHERE uid = $1`,
    values: [uid, ...Object.values(updateFields)],
  };

  await pool.query(query);
}

async function deleteUser(uid: number): Promise<QueryResult> {
  const result: QueryResult = await pool.query(
    `DELETE FROM users."User" WHERE uid = $1`,
    [uid]
  );
  return result;
}

const db = {
  getAllStudents,
  checkDatabase,
  getUserByUserId,
  getUserByEmail,
  createNewUser,
  findUser,
  updateUserPassword,
  updateUserInfo,
  deleteUser,
};

export default db;
