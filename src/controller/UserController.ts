import { getRepository } from "typeorm";
import { User } from "../entity/User"

class UserController {

    static find = async (id: string): Promise<User> => {
        const userRepository = getRepository(User);
        const user: User = await userRepository.findOneOrFail(id);

        return user;
    };

    static create = async (newUser: User): Promise<void> => {
        const userRepository = getRepository(User);

        const user: User = userRepository.create(newUser);
        userRepository.save(user);
        console.info("Created new user: " + newUser.firstName + " " + newUser.lastName);
    };

    static update = async (updatedUser: User): Promise<void> => {
        const userRepository = getRepository(User);

        await UserController.find(updatedUser.id);
        userRepository.save(updatedUser);
        console.info("Updated user: " + updatedUser);
    };

    static delete = async (id: string): Promise<void> => {
        const userRepository = getRepository(User);

        const user: User = await UserController.find(id);
        userRepository.delete(id);
        console.info("Deleted user: " + user);
    };
}

export default UserController;
