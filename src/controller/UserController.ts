import { getRepository } from "typeorm";
import bcrypt from "bcrypt";
import { User } from "../entity/User"

class UserController {
    private SALT_ROUNDS: number = 10;

    static find = async (id: string): Promise<User> => {
        return new Promise(async (resolve, reject) => {
            const userRepository = getRepository(User);
            let user: User;

            try {
                user = await userRepository.findOneOrFail(id);
            } catch (error) {
                return reject(error);
            }

            return resolve(user);
        });

    };

    static findByEmail = async (email: string): Promise<User | undefined> => {
        return new Promise(async (resolve, reject) => {
            const userRepository = getRepository(User);
            let user: User | undefined;

            try {
                user = await userRepository
                    .createQueryBuilder('user')
                    .where('user.email = :email', { email: email })
                    .getOne();
            } catch (error) {
                return reject(error);
            }

            resolve(user);
        })
    };

    static create = async (newUser: User): Promise<void> => {
        return new Promise(async (resolve, reject) => {
            const userRepository = getRepository(User);

            // check if email already exists
            UserController.findByEmail(newUser.email).then(result => {
                if (result !== undefined) {
                    return reject(new Error("Email " + newUser.email + " is already in use."));
                } else {
                    bcrypt.hash(newUser.password, 10).then(hash => {
                        console.log(hash);
                        newUser.password = hash.toString();
                        userRepository.save(newUser);
                    });

                    console.info("Created new user: " + newUser.firstName + " " + newUser.lastName);
                    resolve();
                }
            });
        })
    };

    static update = async (updatedUser: User): Promise<void> => {
        return new Promise(async (resolve, reject) => {
            const userRepository = getRepository(User);

            await UserController.find(updatedUser.id)
                .catch(error => {
                    return reject(error);
                });
            userRepository
                .createQueryBuilder()
                .update('user')
                .set({
                    firstName: updatedUser.firstName,
                    lastName: updatedUser.lastName
                })
                .where('id = :id', { id: updatedUser.id })
                .execute();
            console.info("Updated user: " + updatedUser);
            resolve();
        });

    };

    static delete = async (id: string): Promise<void> => {
        return new Promise(async (resolve, reject) => {
            const userRepository = getRepository(User);
            let user: User;

            try {
                user = await UserController.find(id)
            } catch (error) {
                return reject(error);
            }

            userRepository.delete(id);
            console.info("Deleted user: " + user);
            resolve();
        });
    };
}

export default UserController;
