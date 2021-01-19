import fs from "fs";
import express from "express";
import https from "https";
import cors from "cors";
import helmet from "helmet";
import { createConnection } from "typeorm";
import { LoggingFactory } from "./common/LoggingFactory"
import { UserController } from "./controller/UserController";
import { AuthController } from "./controller/AuthController";
import path from "path";

export class App {
	private app: express.Application;
	private port: number;

	constructor(port: number) {
		this.app = express();
		this.port = port;
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

	private createHttpsServer(): https.Server {
		const key: string = fs.readFileSync(path.resolve(__dirname, "../certs/key-rsa.pem")).toString();
		const cert: string = fs.readFileSync(path.resolve(__dirname, "../certs/cert.pem")).toString();

		return https.createServer({ key, cert }, this.app);
	}

	public run = async (): Promise<void> => {
		this.initialiseMiddlewares();
		// Wait for database connection to establish before initialising controllers
		await createConnection();
		this.initialiseControllers();

		this.createHttpsServer().listen(this.port, () => {
			console.log(`Listening on port ${this.port}`);
		});
	}
}