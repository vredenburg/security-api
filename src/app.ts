import express from "express";
import cors from "cors";
import helmet from "helmet";
import { createConnection } from "typeorm";
import { LoggingFactory } from "./common/LoggingFactory"
import { UserController } from "./controller/UserController";
import { AuthController } from "./controller/AuthController";

export class App {
	public app: express.Application;
	public port: number;

	constructor(port: number) {
		this.app = express();
		this.port = port

		this.initialiseMiddlewares();

		// Wait for databse connection to establish before initialising controllers
		createConnection().then(() => {

			this.initialiseControllers();
		})
	}

	private initialiseMiddlewares(): void {
		this.app.use(helmet());
		this.app.use(cors());
		this.app.use(express.json());
		this.app.use(LoggingFactory.getWinstonLogger);
	}

	private initialiseControllers(): void {
		this.app.use('/api', new UserController().router);
		this.app.use("/api", new AuthController().router);

		// Error logging MUST only be added after initialising routes
		this.app.use(LoggingFactory.getWinstonErrorLogger);
	}

	public run(): void {
		this.app.listen(this.port, () => {
			console.log(`Listening on port ${this.port}`);
		});
	}
}