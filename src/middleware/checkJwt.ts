import jwt, { Secret } from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { Request, Response, NextFunction } from "express";
import { jwtToken } from "../common/jwtToken";

export const checkJwt = (request: Request, response: Response, next: NextFunction) => {
	const authHeader: string | undefined = request.headers['authorization'];
	if (authHeader === undefined) {
		return response.status(401).json({ error: "No Authorization header provided." });
	}

	const token = authHeader && authHeader.split(' ')[1];
	const JWT_SECRET_KEY: Secret = fs.readFileSync(path.resolve(__dirname, "../../jwtSecretKey.pem"));

	try {
		const decodedToken: jwtToken = jwt.verify(token, JWT_SECRET_KEY, { algorithms: ['RS256'] }) as jwtToken;
		const userId: string = decodedToken.userId;
		const reqId: string = (request.body.user === undefined) ? request.body.id : request.body.user.id;

		if (reqId && reqId !== userId) {
			return response.status(401).json({ error: { name: "InvalidToken", message: "Provided jwt token is not valid for this user." } });
		} else {
			request.params.role = decodedToken.role;
			next();
		}
	} catch (error) {
		return response.status(401).send(error);
	}
};