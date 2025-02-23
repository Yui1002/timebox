import dotenv from "dotenv";
import JSHelperInstance from "../helpers/JsonConverterHelper";
import ResponseException from "../models/ResponseException";
import Repositories from "./Repositories";
import { GetUserScheduleRs, SetUserScheduleRq, UserSchedule } from "../models/UserSchedule";
dotenv.config();


interface IUserScheduleRepo {
    getUserSchedule(transactionId: number): Promise<GetUserScheduleRs>;
    getUserScheduleById(ids: number[]): Promise<GetUserScheduleRs>;
    setUserSchedule(userScheduleRq: UserSchedule, serviceProviderId: number, transactionId: number): Promise<void>;
}

class UserScheduleRepo extends Repositories implements IUserScheduleRepo {
    async getUserSchedule(transactionId: number): Promise<GetUserScheduleRs> {
        try {
            const sql = "SELECT user_schedule_id AS id, day, start_time, end_time FROM user_schedule WHERE user_transaction_id = $1;";
            const data = await this.queryDB(sql, [transactionId]);
            if (data?.rows.length <= 0) {
                return null;
            }
            return JSHelperInstance._converter.deserializeObject(data, GetUserScheduleRs);
        } catch (e) {
            throw new ResponseException(e, 500, "unable to get from db");
        }
    }

    async getUserScheduleById(ids: number[]): Promise<GetUserScheduleRs> {
        try {
            const sql = `SELECT 
                            user_schedule_id AS id, 
                            day, 
                            start_time, 
                            end_time 
                        FROM user_schedule 
                        WHERE user_schedule_id = ANY($1::int[]);`;
            const data = await this.queryDB(sql, [ids]);
            if (data?.rows.length <= 0) {
                return null;
            }
            console.log('dataaaaa', data)
            return JSHelperInstance._converter.deserializeObject(data, GetUserScheduleRs);
        } catch (e) {
            throw new ResponseException(e, 500, "unable to get from db");
        }
    }

    async setUserSchedule(userScheduleRq: UserSchedule, serviceProviderId: number, transactionId: number): Promise<void> {
        try {
            const sql = "INSERT INTO user_schedule (user_schedule_id, day, start_time, end_time, service_provider_id, user_transaction_id) VALUES (DEFAULT, $1, $2, $3, $4, $5);";
            await this.queryDB(sql, [
                userScheduleRq.day,
                userScheduleRq.startTime,
                userScheduleRq.endTime,
                serviceProviderId,
                transactionId
            ]);
        } catch (e) {
            throw new ResponseException(e, 500, "unable to insert into db");
        }
    }

} 

export default UserScheduleRepo;