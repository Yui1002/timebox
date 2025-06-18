import dotenv from "dotenv";
import { SetUserRq, UserRawDB, ResetPasswordRq } from "../models/User";
import JSHelperInstance from "../helpers/JsonConverterHelper";
import ResponseException from "../models/ResponseException";
import Repositories from "./Repositories";
dotenv.config();


interface IUserRepo {
    getUser(email: string): Promise<UserRawDB>;
    getUserById(id: string): Promise<UserRawDB>;
    setUser(userRq: SetUserRq): Promise<void>;
    resetPassword(passwordRq: ResetPasswordRq): Promise<void>;
    setTempUser(userRq: SetUserRq): Promise<void>;
}

class UserRepo extends Repositories implements IUserRepo {

    async getUser(email: string): Promise<UserRawDB> {
        try {
            const sql = "SELECT user_id AS id, first_name, last_name, email_address, password, status FROM users WHERE email_address = $1;";
            const data = await this.queryDB(sql, [email]);
            if (data?.rows.length <= 0) {
                return null;
            }
            return JSHelperInstance._converter.deserializeObject(data?.rows[0], UserRawDB);
        } catch (e) {
            throw new ResponseException(e, 500, "unable to get from db");
        }
    }

    async getUserById(id: string): Promise<UserRawDB> {
        try {
            const sql = "SELECT user_id AS id, first_name, last_name, email_address, password, status FROM users WHERE user_id = $1;";
            const data = await this.queryDB(sql, [id]);
            if (data?.rows.length <= 0) {
                return null;
            }
            return JSHelperInstance._converter.deserializeObject(data?.rows[0], UserRawDB);
        } catch (e) {
            throw new ResponseException(e, 500, "unable to get from db");
        }
    }

    async setUser(userRq: SetUserRq): Promise<void> {
        try {
            const sql = "INSERT INTO users VALUES (DEFAULT, $1, $2, $3, $4, DEFAULT, CURRENT_TIMESTAMP);";
            await this.queryDB(sql, [userRq.firstName, userRq.lastName, userRq.email, userRq.password]);
        } catch (e) {
            throw new ResponseException(e, 500, "unable to insert into db");
        } 
    }

    async resetPassword(passwordRq: ResetPasswordRq): Promise<void> {
        try {
            const sql = "UPDATE users SET password = $1 WHERE email_address = $2;";
            await this.queryDB(sql, [passwordRq.newPassword, passwordRq.email]);
        } catch (e) {
            throw new ResponseException(e, 500, "unable to insert into db");
        } 
    }

    async setTempUser(userRq: SetUserRq): Promise<void> {
        try {
            const sql = "INSERT INTO temp_users (first_name, last_name, email_address, password, created_at) VALUES ($1, $2, $3, $4, $5);";
            await this.queryDB(sql, [userRq.firstName, userRq.lastName, userRq.email, userRq.password, Date.now()])
        } catch (e) {
            throw new ResponseException(e, 500, "unable to insert into db")
        }
    }

} 

export default UserRepo;