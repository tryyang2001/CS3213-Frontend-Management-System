import { Request, Response } from "express";
import jwt, { Secret } from "jsonwebtoken";
import bcrypt from "bcrypt";
import db from "../models/user-model";
import HttpStatusCode from "../libs/enums/HttpStatusCode";

async function health(req: Request, res: Response) {
  try {
    await db.checkDatabase();
    return res.json({ 
      message: "User microservice is working." 
    });
  } catch (err) {
    console.log(err);
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR.valueOf()).json({
      message: "Internal User microservice internal error."
    });
  }
}

async function registerUser(req: Request, res: Response) {
  const { email, password, name, major, role } = req.body;

  console.log("registering new user", req.body);
  try {
    const emailSearch = await db.getUserByEmail(email);

    if (emailSearch.rows.length > 0) {
      console.log("Email already exists.");
      return res.status(HttpStatusCode.BAD_REQUEST.valueOf()).json({
        message: "Email already exists.",
      });
    } else if (password.length < 10) {
      console.log("Password not long enough.");
      return res.status(HttpStatusCode.BAD_REQUEST.valueOf()).json({
        message: "Password not long enough.",
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
            email,
            hash,
            role
          );
          return res.json({
            uid: uid,
            message: "User registered successfully."
          });
        } catch (err) {
          console.log(err);
          return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR.valueOf()).json({
            message: "Failed to create user.",
          });
        }
      })
      .catch((err) => {
        console.log(err);
        return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR.valueOf()).json({ message: "Error crypting password." });
      });
  } catch (err) {
    console.log(err);
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR.valueOf()).json({
      message: "Internal server error creating users.",
    });
  }
}

async function loginUser(req: Request, res: Response) {
  const { email, password } = req.body;
  const emailSearch = await db.getUserByEmail(email);
  if (emailSearch.rows.length == 0) {
    console.log("User does not exist.");
    return res.status(HttpStatusCode.BAD_REQUEST.valueOf()).json({
      message: "User does not exist.",
    });
  } else if (emailSearch.rows.length > 0) {
    const user = emailSearch.rows[0];
    const hash = user.password;

    bcrypt
      .compare(password, hash)
      .then((result) => {
        if (!result) {
          console.log("Incorrect password.");
          return res.status(HttpStatusCode.FORBIDDEN.valueOf()).json({
            message: "Incorrect password.",
          });
        } else {
          const jwtSecretKey: Secret | undefined = process.env.JWT_SECRET_KEY;
          if (!jwtSecretKey) {
            console.error("JWT secret key is not defined.");
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR.valueOf()).json({
              message: "Internal server error cannot authenticate user logging in",
            });
          }

          const payload = {
            email: email,
            uid: user.uid,
          };

          const token = jwt.sign(payload, jwtSecretKey, { expiresIn: "5d" });
          const responseData = {
            uid: user.uid,
            role: user.role,
          }
          res
            .cookie("token", token, {
              path: "/",
              httpOnly: true,
              maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days expiry
            })
            .json(responseData);
        }
      })
      .catch((err) => {
        console.log(err);
        return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR.valueOf()).send({ message: "Internal server error checking password." });
      });
  }
}

async function getUserInfo(req: Request, res: Response) {
  const queryUidString = req.query.uid;
  console.log(queryUidString);
  if (typeof queryUidString !== 'string') {
    return res.status(HttpStatusCode.BAD_REQUEST.valueOf()).json({ message: "Invalid uid." });
  }

  try {
    const uid = parseInt(queryUidString, 10);
    console.log(uid);
    const userIdSearch = await db.getUserByUserId(uid);
    if (userIdSearch.rows.length == 0) {
      console.log("User does not exist.");
      return res.status(HttpStatusCode.NOT_FOUND.valueOf()).json({
        message: "User does not exist.",
      });
    } else if (userIdSearch.rows.length > 0) {
      const userRow = userIdSearch.rows[0];
      const user = {
        uid: userRow.uid,
        name: userRow.name,
        email: userRow.email,
        major: userRow.major,
        avatarUrl: userRow.avatarUrl,
        role: userRow.role,
        bio: userRow.bio,
      }
      return res.json(user);
    }
  } catch (err) {
    console.log(err);
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR.valueOf()).json({
      message: "Internal server error getting user by uid.",
    });
  }
}

async function updateUserPassword(req: Request, res: Response) {
  const { uid, old_password, new_password } = req.body;

  try {
    const userIdSearch = await db.getUserByUserId(uid);
    if (userIdSearch.rows.length == 0) {
      console.log("User does not exist.");
      return res.status(HttpStatusCode.NOT_FOUND.valueOf()).json({
        message: "User does not exist.",
      });
    } else if (userIdSearch.rows.length > 0) {
      const hash = userIdSearch.rows[0].password;
      console.log(hash);
      bcrypt
        .compare(old_password, hash)
        .then((result) => {
          if (!result) {
            console.log("Incorrect password.");
            return res.status(HttpStatusCode.BAD_REQUEST.valueOf()).json({
              message: "Incorrect password.",
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
                  return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR.valueOf()).json({
                    message: "Internal server error updating user password.",
                  });
                }
              })
              .catch((err) => {
                console.log(err);
                return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR.valueOf()).send({
                  message: "Internal server error updating user password.",
                });
              });
          }
        })
        .catch((err) => {
          console.log(err);
          return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR.valueOf()).send({
            message: "Internal server error updating user password.",
          });
        });
    }
  } catch (err) {
    console.log(err);
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR.valueOf()).send({
      message: "Internal server error updating user password.",
    });
  }
}

async function updateUserInfo(req: Request, res: Response) {
  const queryUidString = req.query.uid;
  if (typeof queryUidString !== 'string') {
    return res.status(HttpStatusCode.BAD_REQUEST.valueOf()).json({ message: "Invalid uid." });
  }
  const uid = parseInt(queryUidString);
  const updateFields = req.body;

  try {
    if (Object.keys(updateFields).length === 0) {
      return res.status(HttpStatusCode.BAD_REQUEST.valueOf()).json({ message: "No fields provided for update." });
    }

    await db.updateUserInfo(uid, updateFields);

    return res.json({
      message: "User information updated.",
    });
  } catch (err) {
    console.error("Error updating user info:", err);
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR.valueOf()).json({ message: "Internal server error updating user info." });
  }
}

async function deleteUser(req: Request, res: Response) {
  const queryUidString = req.query.uid;
  if (typeof queryUidString !== 'string') {
    return res.status(HttpStatusCode.BAD_REQUEST.valueOf()).json({ message: "Invalid uid." });
  }
  const uid = parseInt(queryUidString);
  try {
    const result = await db.deleteUser(uid);
    console.log(result);
    res.clearCookie("token");
    return res.send({
      message: "User deleted successfully.",
    });
  } catch (err) {
    console.log(err);
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR.valueOf()).send({
      message: "Internal server error deleting account.",
    });
  }
}

export default {
  health,
  registerUser,
  loginUser,
  getUserInfo,
  updateUserPassword,
  updateUserInfo,
  deleteUser,
};
