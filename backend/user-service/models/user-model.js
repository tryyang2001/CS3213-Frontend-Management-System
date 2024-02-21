const pool = require("../psql.js");

async function getUsersByEmail(email) {
    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        return result;
    } catch (error) {
        throw error;
    }
}

async function getUsersByUsername(username) {
    try {
        const result = await pool.query(`SELECT * FROM users
        WHERE username = $1`, [username]);
        return result;
    } catch (error) {
        throw error;
    }
}

async function createNewUser(username, email, hash, role) {
    try {
        const result = await pool.query(`INSERT INTO users (username, email, password, role)
            values ($1, $2, $3, $4)`, [username, email, hash, role]);
        return result;
    } catch (error) {
        throw error;
    }
}

async function deleteUserByEmail(email) {
    try {
        const result = await pool.query(`DELETE FROM users WHERE email = $1`, [email]);
        return result;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getUsersByEmail,
    getUsersByUsername,
    createNewUser,
    deleteUserByEmail,
}