import express, { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import { AuthController } from "../controller/AuthController";

export const authRouter = express.Router();

/**
 * POST /api/login
 */
authRouter.post("/login",
    [
        check('email').normalizeEmail().isEmail(),
        check('password').notEmpty()
    ],
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        try {
            const token: string = await AuthController.login(req.body.email, req.body.password);
            return res.status(200).send(token);
        } catch (error) {
            return res.status(401).json({ error: error });
        }
    });

