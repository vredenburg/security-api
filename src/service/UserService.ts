import { getRepository, Repository } from "typeorm";
import bcrypt from "bcrypt";
import { User } from "../model/User"
import { Role } from "../common/enums";

export class UserService {
    private userRepository: Repository<User>;

    constructor() {
        this.userRepository = getRepository(User);
    }

    public find = async (id: string): Promise<User> => {
        let user: User;

        try {
            user = await this.userRepository.findOneOrFail(id);
        } catch (error) {
            return Promise.reject(error);
        }

        return Promise.resolve(user);
    };

    public findIdAndPasswordByEmail = async (email: string): Promise<User> => {
        let user: User;

        try {
            user = await this.userRepository
                .createQueryBuilder('user')
                .select('user.id')
                .addSelect('user.password')
                .where('user.email = :email', { email: email })
                .getOneOrFail();
        } catch (error) {
            return Promise.reject(error);
        }

        return Promise.resolve(user);
    }

    public idExists = async (id: string): Promise<boolean> => {
        let count: User | undefined;

        try {
            count = await this.userRepository
                .createQueryBuilder('user')
                .where('user.id = :id', { id: id })
                .getOne();
        } catch (error) {
            return Promise.reject(error);
        }

        return Promise.resolve(count !== undefined);
    }

    public emailExists = async (email: string): Promise<boolean> => {
        let count: User | undefined;

        try {
            count = await this.userRepository
                .createQueryBuilder('user')
                .where('user.email = :email', { email: email })
                .getOne();
        } catch (error) {
            return Promise.reject(error);
        }

        return Promise.resolve(count !== undefined);
    }

    public create = async (newUser: User): Promise<void> => {
        try {
            if (await this.emailExists(newUser.email)) {
                return Promise.reject(new Error("Email " + newUser.email + " is already in use."));
            }

            await bcrypt.hash(newUser.password, 10).then(hash => {
                newUser.password = hash.toString();
                newUser.role = Role.Member;
            });

            await this.userRepository.save(newUser);
        } catch (error) {
            return Promise.reject(error);
        }

        return Promise.resolve();
    }

    public update = async (updatedUser: User): Promise<void> => {

        try {
            // Check if user exists
            const userExists: boolean = await this.idExists(updatedUser.id);

            if (!userExists) {
                return Promise.reject(new Error("User with id " + updatedUser.id + " doesn't exist."));
            }

            await this.userRepository
                .createQueryBuilder()
                .update('user')
                .set({
                    firstName: updatedUser.firstName,
                    lastName: updatedUser.lastName
                })
                .where('id = :id', { id: updatedUser.id })
                .execute();
        } catch (error) {
            return Promise.reject(error);
        }

        return Promise.resolve();
    };

    public delete = async (id: string): Promise<void> => {
        try {
            const userExists: boolean = await this.idExists(id);

            if (!userExists) {
                return Promise.reject(new Error("User with id " + id + " doesn't exist."));
            }

            await this.userRepository.delete(id);
        } catch (error) {
            return Promise.reject(error);
        }

        return Promise.resolve();
    };
}
