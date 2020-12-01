import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { createConnection } from "typeorm";
import expressWinston from "express-winston";
import { LoggingFactory } from "./common/LoggingFactory"
import { userRouter } from "./routes/userRouter"
import { authRouter } from "./routes/authRouter";

/**
*  App variables
*/

dotenv.config();
if (!process.env.PORT || !process.env.JWT_SECRET_KEY) {
    console.error("FATAL ERROR: missing env variables.")
    process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);
const app = express();

/**
*  App Configuration
*/

app.use(LoggingFactory.getWinstonLogger);

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use("/api/user", userRouter);
app.use("/api", authRouter);

app.use(LoggingFactory.getWinstonErrorLogger);

/**
 * Server Activation
 */

const server = app.listen(PORT, () => {
    createConnection();
    console.log(`Listening on port ${PORT}`);
});
