import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { createConnection } from "typeorm";
import { userRouter } from "./routes/userRouter"

dotenv.config();

if (!process.env.PORT) {
    process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);
const app = express();

/**
*  App Configuration
*/

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use("/api/user", userRouter);

/**
 * Server Activation
 */

const server = app.listen(PORT, () => {
    createConnection();
    console.log(`Listening on port ${PORT}`);
});
