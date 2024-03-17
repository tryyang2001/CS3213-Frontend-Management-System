import { QueryResult } from 'pg';
import pool from '../psql';

async function getAllUsers(): Promise<any[]> {
    try {
        const result: QueryResult = await pool.query('SELECT * FROM users.users');
        return result.rows;
    } catch (error) {
        throw error;
    }
}

async function getUserByUserId(uid: number): Promise<QueryResult> {
    try {
        const result: QueryResult = await pool.query('SELECT * FROM users.users WHERE uid = $1', [uid]);
        return result;
    } catch (error) {
        throw error;
    }
}

async function getUserByEmail(email: string): Promise<QueryResult> {
    try {
        const result: QueryResult = await pool.query('SELECT * FROM users.users WHERE email = $1', [email]);
        return result;
    } catch (error) {
        throw error;
    }
}

async function updateUser(uid: number, name: string, major: string, course: string, email: string, hash: string, role: string): Promise<void> {
    try {
        await pool.query(`UPDATE users.users SET name = $2, major = $3, course = $4, email = $5, password = $6, role = $7
            WHERE uid = $1`, [uid, name, major, course, email, hash, role]);
    } catch (error) {
        throw error;
    }
}

async function createNewUser(name: string, major: string, course: string, email: string, hash: string, role: string): Promise<number> {
    try {
        const result: QueryResult = await pool.query(`INSERT INTO users.users (name, major, course, email, password, role)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING uid;`, [name, major, course, email, hash, role]);
        const uid: number = result.rows[0].uid;
        console.log(uid);
        return uid;
    } catch (error) {
        throw error;
    }
}

async function updateUserPassword(uid: number, hash: string): Promise<void> {
    try {
        await pool.query(`UPDATE users.users SET password = $2
            WHERE uid = $1`, [uid, hash]);
    } catch (error) {
        throw error;
    }
}

async function updateUserInfo(uid: number, email: string, name: string, major: string, course: string, role: string): Promise<void> {
    try {
        await pool.query(`UPDATE users.users SET email = $2, name = $3, major = $4, course = $5, role = $6
            WHERE uid = $1`, [uid, email, name, major, course, role]);
    } catch (error) {
        throw error;
    }
}

async function deleteUser(uid: number): Promise<QueryResult> {
    try {
        const result: QueryResult = await pool.query(`DELETE FROM users.users WHERE uid = $1`, [uid]);
        return result;
    } catch (error) {
        throw error;
    }
}

const db =  {
    getAllUsers,
    getUserByUserId,
    getUserByEmail,
    updateUser,
    createNewUser,
    updateUserPassword,
    updateUserInfo,
    deleteUser,
};

export default db;
