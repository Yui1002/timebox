import UserRepositories from "../repositories/userRepositories";
import { UserInterface } from "../interfaces/UserInterface";
import dotenv from 'dotenv';
dotenv.config();

class UserModels {
    repositories: UserRepositories;

    constructor() {
        this.repositories = new UserRepositories();
    }

    async getOwnerId(email: string) {
        return await this.repositories.getOwnerId(email);
    }

    async getUsers(email: string) {
        const ownerId = await this.getOwnerId(email);
        return await this.repositories.getUsers(ownerId);
    }

    async getUser(username: string) {
        return await this.repositories.getUser(username);
    }

    async addUser(user: UserInterface) {
        const ownerId = await this.getOwnerId(user.ownerEmail);
        user.ownerId = ownerId;
        user.updateBy = user.ownerEmail;
        return await this.repositories.addUser(user);
    }

    async updateUser(req: any) {
        const userId = await this.repositories.getUserId(req.originalUsername);
        return await this.repositories.updateUser(req, userId)
    }
}

export default UserModels;