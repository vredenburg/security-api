import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { Request, Response, Router } from "express";
import { check, validationResult } from "express-validator";
import { UserService } from "../service/UserService";
import { User } from "../model/User";
import { jwtToken } from "../common/jwtToken";

export class AuthController {
	public path = "/auth";
	public router: Router = Router();

	private userService: UserService;

	constructor() {
		this.userService = new UserService();
		this.intialiseRoutes();
	}

	private intialiseRoutes(): void {
		this.router.post(this.path + "/login",
			[
				check('email').normalizeEmail().isEmail(),
				check('password').notEmpty()
			],
			this.checkCredentials);
	}

	private checkCredentials = async (request: Request, response: Response) => {
		const errors = validationResult(request);
		if (!errors.isEmpty()) {
			return response.status(422).json({ errors: errors.array() });
		}

		let accessToken: string;

		try {
			const user: User = await this.userService.findByEmail(request.body.email);
			const isCorrectPassword: boolean = await this.userService.passwordIsCorrect(user.id, request.body.password);

			if (!isCorrectPassword) {
				return response.status(409).json({ error: { name: "PasswordIncorrect", message: "Incorrect password." } });
			} else {
				const JWT_SECRET_KEY: Buffer = fs.readFileSync(path.resolve(__dirname, "../../jwtSecretKey.pem"));
				const token: jwtToken = { userId: user.id, role: user.role };
				accessToken = jwt.sign(token, JWT_SECRET_KEY, { algorithm: 'RS256', expiresIn: '600000' });
			}
		} catch (error) {
			return response.status(401).json({ error: error.message });
		}

		return response.status(200).send(accessToken);
	}
}
