import { QueryResult } from 'pg';
import pool from '../psql';

async function getAllUsers(): Promise<any[]> {
    try {
        const result: QueryResult = await pool.query('SELECT * FROM users');
        return result.rows;
    } catch (error) {
        throw error;
    }
}

async function getUserByUserId(user_id: number): Promise<QueryResult> {
    try {
        const result: QueryResult = await pool.query('SELECT * FROM users WHERE user_id = $1', [user_id]);
        return result;
    } catch (error) {
        throw error;
    }
}

async function getUserByEmail(email: string): Promise<QueryResult> {
    try {
        const result: QueryResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        return result;
    } catch (error) {
        throw error;
    }
}

async function updateUser(user_id: number, name: string, major: string, course: string, email: string, hash: string, role: string): Promise<void> {
    try {
        await pool.query(`UPDATE users SET name = $2, major = $3, course = $4, email = $5, password = $6, role = $7
            WHERE user_id = $1`, [user_id, name, major, course, email, hash, role]);
    } catch (error) {
        throw error;
    }
}

async function createNewUser(name: string, major: string, course: string, email: string, hash: string, role: string): Promise<number> {
    try {
        const result: QueryResult = await pool.query(`INSERT INTO users (name, major, course, email, password, role)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING user_id;`, [name, major, course, email, hash, role]);
        const user_id: number = result.rows[0].user_id;
        console.log(user_id);
        return user_id;
    } catch (error) {
        throw error;
    }
}

async function updateUserPassword(user_id: number, hash: string): Promise<void> {
    try {
        await pool.query(`UPDATE users SET password = $2
            WHERE user_id = $1`, [user_id, hash]);
    } catch (error) {
        throw error;
    }
}

async function updateUserInfo(user_id: number, email: string, name: string, major: string, course: string, role: string): Promise<void> {
    try {
        await pool.query(`UPDATE users SET email = $2, name = $3, major = $4, course = $5, role = $6
            WHERE user_id = $1`, [user_id, email, name, major, course, role]);
    } catch (error) {
        throw error;
    }
}

async function deleteUser(user_id: number): Promise<QueryResult> {
    try {
        const result: QueryResult = await pool.query(`DELETE FROM users WHERE user_id = $1`, [user_id]);
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
