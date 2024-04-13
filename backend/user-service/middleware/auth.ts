import { Request, Response, NextFunction } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import HttpStatusCode from '../libs/enums/HttpStatusCode';
import db from "../models/user-model";

const verifyToken = async (req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>> => {
    const jwtSecretKey: Secret | undefined = process.env.JWT_SECRET_KEY;

    try {
        const token = await req.cookies.token;

        if (!jwtSecretKey) {
            return res.status(HttpStatusCode.FORBIDDEN.valueOf()).send({ error: "No defined JWT secret key" });
        }

        if (token) {
            const decoded: any = jwt.verify(token, jwtSecretKey);
            if (decoded) {
                const { uid, email } = decoded;
                if (!(uid && email)) {
                    console.log("Unauthorized, invalid token");
                    return res.status(HttpStatusCode.UNAUTHORIZED.valueOf()).json({
                        login: false,
                        message: "Unauthorized, invalid token."
                    });
                } else {
                    const user = await db.findUser(uid, email);
                    if (user) {
                        console.log("Verified");
                        return next();
                    } else {
                        console.log("Unauthorized, invalid token.");
                        return res.status(HttpStatusCode.UNAUTHORIZED.valueOf()).json({
                            login: false,
                            message: "Unauthorized, invalid token."
                        });
                    }
                }
            } else {
                console.log("Unauthorized, invalid token");
                return res.status(HttpStatusCode.UNAUTHORIZED.valueOf()).json({
                    login: false,
                    message: "Unauthorized, invalid token."
                });
            }
        } else {
            console.log("Unauthorized, no authentication token");
            return res.status(HttpStatusCode.UNAUTHORIZED.valueOf()).json({
                login: false,
                message: "Unauthorized, no authentication token"
            });
        }
    } catch (err) {
        return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR.valueOf()).json({
            login: false,
            message: "Internal server error validating authentication token"
        });
    }
};

export default verifyToken;
