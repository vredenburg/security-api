import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { UserController } from "./UserController";

export class AuthController {

    static login = (email: string, password: string): Promise<string> => {
        return new Promise(async (resolve, reject) => {

            UserController.findIdAndPasswordByEmail(email).then(user => {
                bcrypt.compare(password, user.password, (error, same) => {
                    if (error) {
                        return reject(error);
                    }
                    if (!same) {
                        return reject("Incorrect password.");
                    } else {
                        const JWT_SECRET_KEY: Buffer = fs.readFileSync(path.resolve(__dirname, "../../jwtSecretKey.pem"));
                        const userId: string = user.id;
                        const accessToken = jwt.sign({ userId }, JWT_SECRET_KEY, { algorithm: 'RS256' });
                        return resolve(accessToken);
                    }
                });
            });

        });
    };

}

