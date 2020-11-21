/**
 * Required External Modules and Interfaces
 */

import express, { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import UserController from "../controller/UserController";
import { User } from "../entity/User";

export const userRouter = express.Router();

/**
 * GET user/:id
 */
userRouter.get("/:id",
    [
        check('id').isInt()
    ],
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        try {
            const id: number = parseInt(req.params.id, 10);
            const user: User = await UserController.find(id);

            res.status(200).send(user);
        } catch (e) {
            res.status(404).send(e.message);
        }
    });

/**
 * POST user/
 */
userRouter.post("/",
    [
        check('user.firstName').notEmpty(),
        check('user.lastName').notEmpty()
    ],
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors);
            return res.status(422).json({ errors: errors.array() });
        }

        try {
            await UserController.create(req.body.user);

            return res.sendStatus(201);
        } catch (e) {
            return res.status(404).send(e.message);
        }
    });

/**
 * PUT user/
 */
userRouter.put("/",
    [
        check('user.id').isInt().not().isString(),
        check('user.firstName').notEmpty(),
        check('user.lastName').notEmpty()
    ],
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        try {
            await UserController.update(req.body.user);

            res.sendStatus(200);
        } catch (e) {
            res.status(500).send(e.message);
        }
    });

/**
 * DELETE user/:id
 */
userRouter.delete("/:id",
    [
        check('id').isInt()
    ],
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        try {
            const id: number = parseInt(req.params.id, 10);
            await UserController.delete(id);

            return res.sendStatus(200);
        } catch (e) {
            return res.status(404).send(e.message);
        }
    });