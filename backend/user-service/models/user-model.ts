import { QueryResult } from "pg";
import pool from "../psql";

async function getAllUsers(): Promise<any[]> {
  try {
    const result: QueryResult = await pool.query('SELECT * FROM users."User"');
    return result.rows;
  } catch (error) {
    throw error;
  }
}

async function getUserByUserId(uid: number): Promise<QueryResult> {
  try {
    const result: QueryResult = await pool.query(
      'SELECT * FROM users."User" WHERE uid = $1',
      [uid]
    );
    return result;
  } catch (error) {
    throw error;
  }
}

async function getUserByEmail(email: string): Promise<QueryResult> {
  try {
    const result: QueryResult = await pool.query(
      'SELECT * FROM users."User" WHERE email = $1',
      [email]
    );
    return result;
  } catch (error) {
    throw error;
  }
}

async function createNewUser(
  name: string,
  major: string,
  email: string,
  hash: string,
  role: string
): Promise<number> {
  try {
    const result: QueryResult = await pool.query(
      `INSERT INTO users."User" (name, major, email, password, bio, "avatarUrl", role)
            VALUES ($1, $2, $3, $4, '', '', $5)
            RETURNING uid;`,
      [name, major, email, hash, role]
    );
    const uid: number = result.rows[0].uid;
    console.log(uid);
    return uid;
  } catch (error) {
    throw error;
  }
}

async function updateUserPassword(uid: number, hash: string): Promise<void> {
  try {
    await pool.query(
      `UPDATE users."User" SET password = $2
            WHERE uid = $1`,
      [uid, hash]
    );
  } catch (error) {
    throw error;
  }
}

async function updateUserInfo(uid: number, updateFields: any): Promise<void> {
  const fieldsToUpdate = Object.keys(updateFields).map((key, index) => `${key} = $${index + 2}`).join(', ');

  const query = {
    text: `UPDATE users."User" SET ${fieldsToUpdate} WHERE uid = $1`,
    values: [uid, ...Object.values(updateFields)],
  };

  try {
    await pool.query(query);
  } catch (error) {
    throw error;
  }
}

async function deleteUser(uid: number): Promise<QueryResult> {
  try {
    const result: QueryResult = await pool.query(
      `DELETE FROM users."User" WHERE uid = $1`,
      [uid]
    );
    return result;
  } catch (error) {
    throw error;
  }
}

const db = {
  getAllUsers,
  getUserByUserId,
  getUserByEmail,
  createNewUser,
  updateUserPassword,
  updateUserInfo,
  deleteUser,
};

export default db;
