import jwt, { Secret } from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { Request, Response, NextFunction } from "express";
import { jwtToken } from "../common/jwtToken";

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
    const authHeader: string | undefined = req.headers['authorization'];
    if (authHeader === undefined) {
        return res.status(401).json({ error: "No Authorization header provided." });
    }

    const token = authHeader && authHeader.split(' ')[1];
    const JWT_SECRET_KEY: Secret = fs.readFileSync(path.resolve(__dirname, "../../jwtSecretKey.pem"));

    try {
        const decodedToken: jwtToken = jwt.verify(token, JWT_SECRET_KEY, { algorithms: ['RS256'] }) as jwtToken;
        const userId: string = decodedToken.userId;
        const reqId: string = (req.body.user === undefined) ? req.body.id : req.body.user.id;

        if (reqId && reqId !== userId) {
            return res.status(401).json({ error: "Invalid user ID." });
        } else {
            next();
        }
    } catch (error) {
        return res.status(401).send(error);
    }
};