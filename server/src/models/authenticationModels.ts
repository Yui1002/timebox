import AuthenticationRepositories from "../repositories/authenticationRepositories";
import { OwnerInterface } from "../interfaces/OwnerInterface";
import { UserInterface } from "../interfaces/UserInterface";
import { ActivityInterface } from "../interfaces/ActivityInterface";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

class AuthenticationModels {
    repositories: AuthenticationRepositories;

    constructor() {
        this.repositories = new AuthenticationRepositories();
    }

    async isOwnerRegistered(email: string) {
        return await this.repositories.isOwnerRegistered(email);
    }

    async isPasswordMatch(email: string, password: string) {
        const hashedPassword = await this.repositories.getOwnerPassword(email);
        const isMatch = await bcrypt.compare(password, hashedPassword);
        return isMatch;
    }

    async signUpOwner(owner: OwnerInterface) {
        if (owner.password !== null) {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(owner.password, saltRounds);
            owner.password = hashedPassword;
        }
        return await this.repositories.registerOwner(owner);
    }
}

export default AuthenticationModels;