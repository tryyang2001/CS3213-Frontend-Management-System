import { Request, Response } from "express";
import jwt, { Secret } from "jsonwebtoken";
import bcrypt from "bcrypt";
import db from "../models/user-model";

async function registerUser(req: Request, res: Response) {
  const { email, password, name, major, course, role } = req.body;

  console.log("registering new user", req.body);
  try {
    const emailSearch = await db.getUserByEmail(email);

    if (emailSearch.rows.length > 0) {
      console.log("Email already exists.");
      return res.json({
        error: "Email already exists.",
      });
    } else if (password.length < 10) {
      console.log("Password not long enough.");
      return res.json({
        error: "Password not long enough.",
      });
    }
    bcrypt
      .hash(password, 10)
      .then(async (hash) => {
        console.log(hash);
        try {
          const uid = await db.createNewUser(
            name,
            major,
            course,
            email,
            hash,
            role
          );
          return res.json({ uid });
        } catch (err) {
          console.log(err);
          return res.json({
            error: "Failed to create user.",
          });
        }
      })
      .catch((err) => {
        console.log(err);
        return res.send({ message: "Error crypting password." });
      });
  } catch (err) {
    console.log(err);
    return res.json({
      error: "Undefined error creating users.",
    });
  }
}

async function loginUser(req: Request, res: Response) {
  const { email, password } = req.body;

  const emailSearch = await db.getUserByEmail(email);
  if (emailSearch.rows.length == 0) {
    console.log("User does not exist.");
    return res.json({
      error: "User does not exist.",
    });
  } else if (emailSearch.rows.length > 0) {
    const user = emailSearch.rows[0];
    const hash = user.password;

    bcrypt
      .compare(password, hash)
      .then((result) => {
        if (!result) {
          console.log("Incorrect password.");
          return res.status(201).json({
            error: "Incorrect password.",
          });
        } else {
          const jwtSecretKey: Secret | undefined = process.env.JWT_SECRET_KEY;
          if (!jwtSecretKey) {
            console.error("JWT secret key is not defined.");
            return res.status(500).json({
              error: "Internal server error.",
            });
          }

          const payload = {
            email: email,
            uid: user.uid,
          };

          const token = jwt.sign(payload, jwtSecretKey, { expiresIn: "5d" });
          res
            .cookie("token", token, {
              path: "/",
              httpOnly: true,
              maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days expiry
            })
            .json({ user });
        }
      })
      .catch((err) => {
        console.log(err);
        return res.send({ message: "Error checking password." });
      });
  }
}

async function getUserInfo(req: Request, res: Response) {
  const queryUidString = req.query.uid;
  console.log(queryUidString);
  if (typeof queryUidString !== 'string') {
    return res.status(400).json({ error: 'Invalid uid' });
}
  try {
    const uid = parseInt(queryUidString, 10);
    console.log(uid);
    const userIdSearch = await db.getUserByUserId(uid);
    if (userIdSearch.rows.length == 0) {
      console.log("User does not exist.");
      return res.json({
        error: "User does not exist.",
      });
    } else if (userIdSearch.rows.length > 0) {
      const user = userIdSearch.rows[0];
      return res.json(user);
    }
  } catch (err) {
    console.log(err);
    return res.send({
      message: "Error getting user by uid.",
    });
  }
}

async function getUserByEmail(req: Request, res: Response) {
  const { email } = req.body;
  try {
    const emailSearch = await db.getUserByEmail(email);
    if (emailSearch.rows.length == 0) {
      console.log("User does not exist.");
      return res.json({
        error: "User does not exist.",
      });
    } else if (emailSearch.rows.length > 0) {
      const user = emailSearch.rows[0];
      return res.json(user);
    }
  } catch (err) {
    console.log(err);
    return res.send({
      message: "Error getting user by email.",
    });
  }
}

async function getAllUsers(req: Request, res: Response) {
  try {
    const allUsers = await db.getAllUsers();
    return res.json(allUsers);
  } catch (err) {
    console.log(err);
    return res.send({ message: "Error getting all users." });
  }
}

async function updateUserPassword(req: Request, res: Response) {
  const { uid, old_password, new_password } = req.body;
  try {
    const userIdSearch = await db.getUserByUserId(uid);
    if (userIdSearch.rows.length == 0) {
      console.log("User does not exist.");
      return res.status(403).json({
        error: "User does not exist.",
      });
    } else if (userIdSearch.rows.length > 0) {
      const hash = userIdSearch.rows[0].password;
      console.log(hash);
      bcrypt
        .compare(old_password, hash)
        .then((result) => {
          if (!result) {
            console.log("Incorrect password.");
            return res.status(403).json({
              error: "Incorrect password.",
            });
          } else {
            bcrypt
              .hash(new_password, 10)
              .then(async (hash) => {
                try {
                  await db.updateUserPassword(uid, hash);
                  return res.json({
                    message: "Update password successfully.",
                  });
                } catch (err) {
                  return res.status(404).json({
                    error: "Failed to update user password.",
                  });
                }
              })
              .catch((err) => {
                console.log(err);
                return res.send({
                  message: "Error crypting password.",
                });
              });
          }
        })
        .catch((err) => {
          console.log(err);
          return res.send({
            message: "Error checking password.",
          });
        });
    }
  } catch (err) {
    console.log(err);
    return res.send({
      message: "Error getting user by uid.",
    });
  }
}

async function updateUserInfo(req: Request, res: Response) {
  const { uid, email, name, major, course, role } = req.body;
  try {
    await db.updateUserInfo(uid, email, name, major, course, role);
    return res.json({
      message: "User info updated.",
    });
  } catch (err) {
    return res.json({
      error: "Failed to update user info.",
    });
  }
}

async function deleteUser(req: Request, res: Response) {
  const { uid } = req.body;
  try {
    const result = await db.deleteUser(uid);
    console.log(result);
    res.clearCookie("token");
    return res.send({
      message: "User deleted successfully.",
    });
  } catch (err) {
    console.log(err);
    return res.send({
      error: "Undefined error deleting account.",
    });
  }
}

async function clearCookie(req: Request, res: Response) {
  res.clearCookie("token");
  return res.send({
    message: "Cleared user cookie",
  });
}

export default {
  registerUser,
  loginUser,
  getUserInfo,
  getUserByEmail,
  getAllUsers,
  updateUserPassword,
  updateUserInfo,
  deleteUser,
  clearCookie,
};
