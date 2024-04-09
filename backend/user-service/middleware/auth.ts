import { Request, Response, NextFunction } from 'express';
import jwt, { Secret } from 'jsonwebtoken';

const verifyToken = async (req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>> => {
    const jwtSecretKey: Secret | undefined = process.env.JWT_SECRET_KEY;

    try {
        const token = await req.cookies.token;

        if (!jwtSecretKey) {
            return res.status(403).send({ error: "No defined JWT secret key" });
        }

        if (token) {
            const decoded: any = jwt.verify(token, jwtSecretKey);
            if (decoded) {
                console.log("verified");
                // You can perform further validation or processing here if needed
                return next();
            } else {
                console.log("Unauthorized, invalid token");
                return res.status(401).json({
                    login: false,
                    data: token
                });
            }
        } else {
            console.log("Unauthorized, no authentication token");
            return res.status(401).json({
                login: false,
                data: "Unauthorized, no authentication token"
            });
        }
    } catch (err) {
        console.log("Error verifying token");
        const token = req.cookies.token;
        return res.status(402).send({ error: token });
    }
};

export default verifyToken;
