import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { Request, Response, Router } from "express";
import { check, validationResult } from "express-validator";
import { UserService } from "../service/UserService";
import { User } from "../model/User";
import { jwtToken } from "../common/jwtToken";
import { checkJwt } from "../middleware/checkJwt";

export class AuthController {
	public path = "/auth";
	public router: Router = Router();

	private userService: UserService;

	constructor() {
		this.userService = new UserService();
		this.intialiseRoutes();
	}

	private intialiseRoutes(): void {

		/**
		* POST api/auth/refresh
		*/
		this.router.post(this.path + "/refresh",
			[
				checkJwt
			],
			this.refresh);

		/**
		* POST api/auth/signin
		*/
		this.router.post(this.path + "/signin",
			[
				check('email').normalizeEmail().isEmail(),
				check('password').notEmpty()
			],
			this.checkCredentials);

		/**
		* POST api/auth/signup
		*/
		this.router.post(this.path + "/signup",
			[
				check('email').normalizeEmail().isEmail(),
				check(['password', 'passwordRepeat', 'firstName', 'lastName']).notEmpty(),
				check(['role', 'createdOn', 'updatedOn']).not().exists()
			],
			this.signUp);
	}

	private refresh = async (request: Request, response: Response) => {
		const errors = validationResult(request);
		if (!errors.isEmpty()) {
			return response.status(422).json({ errors: errors.array() });
		}

		let accessToken: string;
		let user: User;

		try {
			user = await this.userService.findById(request.params.tokenId);
			accessToken = this.getJwt(user);

		} catch (error) {
			return response.status(401).json({ error: error.message });
		}

		return response.status(200).json({ jwt: accessToken, user: user });
	}

	private checkCredentials = async (request: Request, response: Response) => {
		const errors = validationResult(request);
		if (!errors.isEmpty()) {
			return response.status(422).json({ errors: errors.array() });
		}

		let accessToken: string;
		let user: User;

		try {
			user = await this.userService.findByEmail(request.body.email);
			const isCorrectPassword: boolean = await this.userService.passwordIsCorrect(user.id, request.body.password);

			if (!isCorrectPassword) {
				return response.status(409).json({ errors: "Incorrect password." });
			} else {
				accessToken = this.getJwt(user);
			}
		} catch (error) {
			return response.status(401).json({ errors: error.message });
		}

		return response.status(200).json({ jwt: accessToken, user: user });
	}

	private signUp = async (request: Request, response: Response) => {
		const errors = validationResult(request);
		if (!errors.isEmpty()) {
			return response.status(422).json({ errors: errors.array() });
		}

		let accessToken: string;
		let user: User;

		try {
			user = await this.userService.create(request.body);
			accessToken = this.getJwt(user);

		} catch (error) {
			return response.status(409).json({ errors: error.message });
		}

		return response.status(201).json({ jwt: accessToken, user: user });
	}

	private getJwt(user: User): string {
		const JWT_SECRET_KEY: Buffer = fs.readFileSync(path.resolve(__dirname, "../../jwtSecretKey.pem"));
		const token: jwtToken = { userId: user.id, role: user.role };
		return jwt.sign(token, JWT_SECRET_KEY, { algorithm: 'RS256', expiresIn: '600000' });
	}
}
