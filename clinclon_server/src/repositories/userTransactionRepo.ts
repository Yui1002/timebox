import dotenv from "dotenv";
import { GetUserTransactionRs, SetUserTransactionRq, UpdateUserTransactionRq } from "../models/UserTransaction";
import JSHelperInstance from "../helpers/JsonConverterHelper";
import ResponseException from "../models/ResponseException";
import Repositories from "./repositories";
dotenv.config();


interface IUserTransactionRepo {
    getUserTransaction(employerId: number, serviceProviderId: number): Promise<GetUserTransactionRs>;
    setUserTransaction(userTransactionRq: SetUserTransactionRq, employerId: number, serviceProviderId: number): void
    updateUserTransaction(userTransactionRq: UpdateUserTransactionRq, transactionId: number): Promise<void>;
}

class UserTransactionRepo extends Repositories implements IUserTransactionRepo {

    async getUserTransaction(employerId: number, serviceProviderId: number): Promise<GetUserTransactionRs> {
        try {
            const sql = "SELECT user_transaction_id AS id, rate, rate_type, status FROM user_transaction WHERE employer_user_id = $1 AND service_provider_id = $2;";
            const data = await this.queryDB(sql, [employerId, serviceProviderId]);
            if (data?.rows.length <= 0) {
                return null;
            }
            return JSHelperInstance._converter.deserializeObject(data?.rows[0], GetUserTransactionRs);
        } catch (e) {
            throw new ResponseException(e, 500, "unable to get from db");
        }
    }

    async setUserTransaction(userTransactionRq: SetUserTransactionRq, employerId: number, serviceProviderId: number): Promise<void> {
        try {
            const sql = "INSERT INTO user_transaction (user_transaction_id, rate, rate_type, status, update_date, update_by, employer_user_id, service_provider_id, mode) VALUES (DEFAULT, $1, $2, DEFAULT, CURRENT_TIMESTAMP, $3, $4, $5, $6);";
            await this.queryDB(sql, [
                userTransactionRq.rate, 
                userTransactionRq.rateType,
                userTransactionRq.employerEmail,
                employerId,
                serviceProviderId,
                userTransactionRq.mode
            ]);
        } catch (e) {
            throw new ResponseException(e, 500, "unable to get from db");
        }
    }

    async updateUserTransaction(userTransactionRq: UpdateUserTransactionRq, transactionId: number): Promise<void> {
        try {
            const sql = "UPDATE user_transaction SET rate = $1, rate_type = $2, update_date = CURRENT_TIMESTAMP WHERE user_transaction_id = $3";
            await this.queryDB(sql, [userTransactionRq.rate, userTransactionRq.rateType, transactionId])
        } catch (e) {
            throw new ResponseException(e, 500, 'unable to update db');
        }
    }

} 

export default UserTransactionRepo;