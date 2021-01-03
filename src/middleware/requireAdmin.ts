import { Request, Response, NextFunction } from "express";
import { Role } from "../common/enums";

export const requireAdmin = (request: Request, response: Response, next: NextFunction) => {
    try {
        if (request.params.tokenRole !== Role.Admin) {
            return response.status(401).json({ error: { name: "Unauthorised", message: "User does not have the required admin role." } });
        } else {
            next();
        }
    } catch (error) {
        return response.status(401).send(error);
    }
};