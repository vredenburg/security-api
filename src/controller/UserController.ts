import { Request, Response, Router } from "express";
import { check, validationResult } from "express-validator";
import { UserService } from "../service/UserService";
import { User } from "../model/User";
import { checkJwt } from "../middleware/checkJwt";
import { requireAdmin } from "../middleware/requireAdmin";

export class UserController {
	public path = "/users";
	public router: Router = Router();

	private userService: UserService;

	constructor() {
		this.userService = new UserService();
		this.intialiseRoutes();
	}

	private intialiseRoutes(): void {

		/**
		* GET api/users/
		*/
		this.router.get(this.path,
			[
				checkJwt,
				requireAdmin
			],
			this.listUsers);

		/**
		* GET api/users/:id
		*/
		this.router.get(this.path + "/:id",
			[
				check('id').isUUID(),
				checkJwt,
				requireAdmin
			],
			this.getUserById);

		/**
		* GET api/users/:email
		*/
		this.router.get(this.path + "/:email",
			[
				check('email').normalizeEmail().isEmail(),
				checkJwt,
				requireAdmin
			],
			this.getUserByEmail);

		/**
		* POST api/users
		* Authorisation: admin
		*/
		this.router.post(this.path,
			[
				check('email').normalizeEmail().isEmail(),
				check(['password', 'passwordRepeat', 'firstName', 'lastName']).notEmpty(),
				check(['createdOn', 'updatedOn']).not().exists(),
				checkJwt,
				requireAdmin
			],
			this.createUser);

		/**
		* POST api/users/:id/password_change
		*/
		this.router.post(this.path + "/:id" + "/password_change",
			[
				check(['old', 'new']).notEmpty(),
				checkJwt
			],
			this.updateUserPassword);

		/**
		* PUT api/users/:id
		* Authorisation: admin
		*/
		this.router.put(this.path + "/:id",
			[
				check('id').isUUID(),
				check(['user.firstName', 'user.lastName']).isString(),
				check(['user.email', 'user.password', 'user.role', 'user.createdOn', 'user.updatedOn']).not().exists(),
				checkJwt,
				requireAdmin
			],
			this.updateUser);

		/**
		* DELETE api/users/:id
		* Authorisation: admin
		*/
		this.router.delete(this.path + "/:id",
			[
				check('id').isUUID(),
				checkJwt,
				requireAdmin
			],
			this.deleteUser);
	}

	private listUsers = async (request: Request, response: Response) => {
		const errors = validationResult(request);
		if (!errors.isEmpty()) {
			return response.status(422).json({ errors: errors.array() });
		}

		try {
			const users: User[] = await this.userService.listAll();

			response.status(200).json(users);
		} catch (error) {
			response.status(404).json({ errors: error.message });
		}
	}

	private getUserById = async (request: Request, response: Response) => {
		const errors = validationResult(request);
		if (!errors.isEmpty()) {
			return response.status(422).json({ errors: errors.array() });
		}

		try {
			const user: User = await this.userService.findById(request.params.id);

			response.status(200).json(user);
		} catch (error) {
			response.status(404).json({ errors: error.message });
		}
	}

	private getUserByEmail = async (request: Request, response: Response) => {
		const errors = validationResult(request);
		if (!errors.isEmpty()) {
			return response.status(422).json({ errors: errors.array() });
		}

		try {
			const user: User = await this.userService.findByEmail(request.params.email);

			response.status(200).json(user);
		} catch (error) {
			response.status(404).json({ errors: error.message });
		}
	}

	private createUser = async (request: Request, response: Response) => {
		const errors = validationResult(request);
		if (!errors.isEmpty()) {
			return response.status(422).json({ errors: errors.array() });
		}

		try {
			await this.userService.create(request.body);

			return response.sendStatus(201);
		} catch (error) {
			return response.status(409).json({ errors: error.message });
		}
	}

	private updateUser = async (request: Request, response: Response) => {
		const errors = validationResult(request);
		if (!errors.isEmpty()) {
			return response.status(422).json({ errors: errors.array() });
		}

		try {
			await this.userService.update(request.params.id, request.body.user);

			response.sendStatus(200);
		} catch (error) {
			response.status(500).json({ errors: error.message });
		}
	}

	private updateUserPassword = async (request: Request, response: Response) => {
		const errors = validationResult(request);
		if (!errors.isEmpty()) {
			return response.status(422).json({ errors: errors.array() });
		}

		try {
			await this.userService.updatePassword(request.params.id, request.body.old, request.body.new);

			response.sendStatus(200);
		} catch (error) {
			response.status(409).json({ errors: error.message });
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
			return response.status(404).json({ errors: error.message });
		}
	}

}
