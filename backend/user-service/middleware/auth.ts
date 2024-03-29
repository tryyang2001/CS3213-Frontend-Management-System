import { Request, Response, NextFunction } from 'express';
import jwt, { Secret } from 'jsonwebtoken';

const verifyToken = (req: Request, res: Response, next: NextFunction): void | Response<any, Record<string, any>> => {
    const jwtSecretKey: Secret | undefined = process.env.JWT_SECRET_KEY;

    try {
        const token = req.cookies.token;

        if (!jwtSecretKey) {
            throw new Error('JWT secret key is not defined');
        }

        if (token) {
            const decode: any = jwt.verify(token, jwtSecretKey);
            if (decode) {
                console.log("verified");
                next();
            }
        } else {
            console.log("Access Denied");
            return res.json({
                login: false,
                data: 'error'
            });
        }
    } catch (err) {
        console.log("Invalid token");
        return res.send({ err: 'Invalid token' });
    }
};

export default verifyToken;
