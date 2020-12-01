import { getRepository } from "typeorm";
import bcrypt from "bcrypt";
import { User } from "../entity/User"
import { Role } from "../common/enums";

export class UserController {

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

    static findIdAndPasswordByEmail = async (email: string): Promise<User> => {
        return new Promise(async (resolve, reject) => {
            const userRepository = getRepository(User);
            let user: User;

            try {
                user = await userRepository
                    .createQueryBuilder('user')
                    .select('user.id')
                    .addSelect('user.password')
                    .where('user.email = :email', { email: email })
                    .getOneOrFail();
            } catch (error) {
                return reject(error);
            }

            return resolve(user);
        });
    }

    static exists = (email: string): Promise<boolean> => {
        return new Promise(async (resolve, reject) => {
            const userRepository = getRepository(User);
            let count: User | undefined;

            try {
                count = await userRepository
                    .createQueryBuilder('user')
                    .where('user.email = :email', { email: email })
                    .getOne();
            } catch (error) {
                return reject(error);
            }

            resolve(count !== undefined);
        });
    }

    static create = async (newUser: User): Promise<void> => {
        return new Promise(async (resolve, reject) => {
            const userRepository = getRepository(User);

            if (await UserController.exists(newUser.email)) {
                return reject(new Error("Email " + newUser.email + " is already in use."));
            } else {
                bcrypt.hash(newUser.password, 10).then(hash => {
                    newUser.password = hash.toString();
                    newUser.role = Role.Member;
                    userRepository.save(newUser);
                });

                console.info("Created new user: " + newUser.firstName + " " + newUser.lastName);
                resolve();
            }
        });
    }


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
