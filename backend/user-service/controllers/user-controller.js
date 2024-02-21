const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const db = require("../models/user-model.js");

async function registerUser(req, res) {
    let { username, email, password, role } = req.body;

    console.log("registering new user");

    try {
        const emailSearch = await db.getUsersByEmail(email);
            if (emailSearch.rows.length > 0) {
                console.log("Email already exists.");
                return res.json({
                    error: "Email already exists."
                });
        }

        const usernameSearch = await db.getUsersByUsername(username);
        if (usernameSearch.rows.length > 0) {
            console.log("Username already exists.");
            return res.json({
                error: "Username already exists."
            });
        } else if (password.length < 10) {
            console.log("Password not long enough.");
            return res.json({
                error: "Password not long enough."
            });
        }
        bcrypt.hash(password, 10)
        .then(async (hash) => {
            try {
                await db.createNewUser(username, email, hash, role);
                return res.json({ username, email });
            } catch (err) {
                return res.json({
                    error: "Failed to create user."
                });
            }
        })
        .catch(err => {
            console.log(err);
            return res.send({ message: "Error crypting password." });
        });
    } catch (err) {
        console.log(err);
        return res.json({
            error: "Undefined error creating users."
        })
    }

    console.log("Registeration success.")
}

async function loginUser (req, res) {
    let  { email, password } = req.body;

    const emailSearch = await db.getUsersByEmail(email);
    if (emailSearch.rows.length == 0) {
        console.log("User does not exist.");
        return res.json({
            error: "User does not exist."
        });
    } else if (emailSearch.rows.length > 0) {
        const user = emailSearch.rows[0];
        const hash = user.password;

        bcrypt.compare(password, hash)
        .then(result => {
            if (!result) {
                console.log("Incorrect password.");
                return res.json({
                    error: "Incorrect password."
                });
            } else {
                return res.json({body: "logging in successfully."});
            }
        })
        .catch(err => {
            console.log(err);
            return res.send({ message: "Error checking password." });
        })
    }
}

async function deleteUser (req, res) {
    let { email } = req.body;
    console.log(email);
    try {
        const result = await db.deleteUserByEmail(email);
        console.log(result);
        return res.send({message: "User deleted successfully."});
    } catch (err) {
        console.log(err);
        return res.send({ error: "Undefined error deleting account." });
    }
}

module.exports = {
    registerUser,
    loginUser,
    deleteUser
}