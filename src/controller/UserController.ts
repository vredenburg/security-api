import { Request, Response, Router } from "express";
import { check, validationResult } from "express-validator";
import { UserService } from "../service/UserService";
import { User } from "../model/User";
import { checkJwt } from "../middleware/checkJwt";

export class UserController {
    public path: string = "/user";
    public router: Router = Router();

    private userService: UserService;

    constructor() {
        this.userService = new UserService();
        this.intialiseRoutes();
    }

    private intialiseRoutes() {

        /**
        * GET api/user/:id
        */
        this.router.get(this.path + "/:id",
            [
                check('id').isUUID(),
                checkJwt
            ],
            this.getUser);

        /**
        * POST api/user/
        */
        this.router.post(this.path,
            [
                check('user.email').normalizeEmail().isEmail(),
                check(['user.password', 'user.firstName', 'user.lastName']).notEmpty(),
                check(['user.role', 'user.createdOn', 'user.updatedOn']).not().exists(),
                checkJwt
            ],
            this.createUser);

        /**
        * PUT api/user/:id
        */
        this.router.put(this.path,
            [
                check('user.id').isUUID(),
                check(['user.firstName', 'user.lastName']).isString(),
                check(['user.email', 'user.password', 'user.role', 'user.createdOn', 'user.updatedOn']).not().exists(),
                checkJwt
            ],
            this.updateUser);

        /**
        * DELETE api/user/:id
        */
        this.router.delete(this.path + "/:id",
            [
                check('id').isUUID(),
                checkJwt
            ],
            this.deleteUser);
    }

    private getUser = async (request: Request, response: Response) => {

        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            return response.status(422).json({ errors: errors.array() });
        }

        try {
            const user: User = await this.userService.find(request.params.id);

            response.status(200).send(user);
        } catch (error) {
            response.status(404).send(error.message);
        }

    }

    private createUser = async (request: Request, response: Response) => {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            return response.status(422).json({ errors: errors.array() });
        }

        try {
            await this.userService.create(request.body.user);

            return response.sendStatus(201);
        } catch (error) {
            return response.status(409).send(error.message);
        }
    }

    private updateUser = async (request: Request, response: Response) => {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            return response.status(422).json({ errors: errors.array() });
        }

        try {
            await this.userService.update(request.body.user);

            response.sendStatus(200);
        } catch (error) {
            response.status(500).send(error.message);
        }
    }

    private deleteUser = async (request: Request, response: Response) => {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            return response.status(422).json({ errors: errors.array() });
        }

        try {
            await this.userService.delete(request.params.id);

            return response.sendStatus(200);
        } catch (error) {
            return response.status(404).send(error.message);
        }
    }

}
