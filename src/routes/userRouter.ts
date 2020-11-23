import express, { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import UserController from "../controller/UserController";
import { User } from "../entity/User";

export const userRouter = express.Router();

/**
 * GET api/user/:id
 */
userRouter.get("/:id",
    [
        check('id').isUUID()
    ],
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        try {
            const user: User = await UserController.find(req.params.id);

            res.status(200).send(user);
        } catch (error) {
            res.status(404).send(error.message);
        }
    });

/**
 * POST api/user/
 */
userRouter.post("/",
    [
        check('user.email').normalizeEmail().isEmail(),
        check('user.password').notEmpty(),
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
        } catch (error) {
            return res.status(409).send(error.message);
        }
    });

/**
 * PUT api/user/
 */
userRouter.put("/",
    [
        check('user.id').isUUID(),
        check('user.email').not().exists(),
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
        } catch (error) {
            res.status(500).send(error.message);
        }
    });

/**
 * DELETE user/:id
 */
userRouter.delete("/:id",
    [
        check('id').isUUID()
    ],
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        try {
            await UserController.delete(req.params.id);

            return res.sendStatus(200);
        } catch (error) {
            return res.status(404).send(error.message);
        }
    });