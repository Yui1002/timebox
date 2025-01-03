import UserRepo from "../repositories/userRepo";
import { GetUserRq, GetUserRs, SetUserRq, SignInUserRq, ResetPasswordRq } from "../models/User";
import ResponseException from "../models/ResponseException";
import bcrypt from "bcrypt";
import dotenv from 'dotenv';
dotenv.config();


interface IUserManager {
    getUser(rq: GetUserRq): Promise<GetUserRs>;
    setUser(userRq: SetUserRq): Promise<void>;
    signInUser(userRq: SignInUserRq): Promise<GetUserRs>;
    resetPassword(passwordRq: ResetPasswordRq): Promise<void>;
}

class UserManager implements IUserManager {
    private _userRepo: UserRepo;
 
    constructor() {
        this._userRepo = new UserRepo();
    }
    
    async getUser(rq: GetUserRq): Promise<GetUserRs> {
        let userDB = await this._userRepo.getUser(rq.email);
        if (!userDB) {
            throw new ResponseException(null, 400, 'data not found');
        }
        return new GetUserRs(userDB);
    }
    
    async setUser(userRq: SetUserRq): Promise<void> {
        userRq.password = await bcrypt.hash(userRq.password, Number(process.env.SALT_ROUNDS));
        await this._userRepo.setUser(userRq);
    }

    async signInUser(userRq: SignInUserRq): Promise<GetUserRs> {
        let userExists = await this._userRepo.getUser(userRq.email);

        if (!userExists) {
            throw new ResponseException(null, 400, "Incorrect email or password");
        }

        let passwordMatch = await bcrypt.compare(userRq.password, userExists.password);
        if (!passwordMatch) {
            throw new ResponseException(null, 400, "Incorrect email or password");
        }

        return new GetUserRs(userExists);
    }

    async resetPassword(passwordRq: ResetPasswordRq): Promise<void> {
        let userExists = await this._userRepo.getUser(passwordRq.email);
        if (!userExists) {
            throw new ResponseException(null, 400, 'no data found');
        }

        let oldPassword = userExists.password;
        let passwordMatch = await bcrypt.compare(passwordRq.newPassword, oldPassword);

        if (passwordMatch) {
            throw new ResponseException(null, 400, 'You cannot reuse the previous password');
        }

        passwordRq.newPassword = await bcrypt.hash(passwordRq.newPassword, Number(process.env.SALT_ROUNDS));
        await this._userRepo.resetPassword(passwordRq);
    }
}

export default UserManager;