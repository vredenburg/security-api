import * as dotenv from "dotenv";
import { App } from './app';

dotenv.config();

if (!process.env.PORT) {
	console.error("FATAL ERROR: missing env variables.")
	process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);

const app: App = new App(
	PORT
);

app.run();