import dotenv from "dotenv";
import JSHelperInstance from "../helpers/JsonConverterHelper";
import ResponseException from "../models/ResponseException";
import Repositories from "./Repositories";
import { GetUserScheduleRs, SetUserScheduleRq, UpdateUserScheduleRq, UserSchedule } from "../models/UserSchedule";
dotenv.config();


interface IUserScheduleRepo {
    getUserSchedule(transactionId: number): Promise<GetUserScheduleRs>;
    getUserScheduleById(ids: number[]): Promise<GetUserScheduleRs>;
    setUserSchedule(userScheduleRq: UserSchedule, serviceProviderId: number, transactionId: number): Promise<void>;
    updateUserSchedule(fieldsToUpdate: Partial<UpdateUserScheduleRq>, scheduleId: number): Promise<void>;
    deleteUserSchedule(id: number): Promise<void>;
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
            return JSHelperInstance._converter.deserializeObject(data, GetUserScheduleRs);
        } catch (e) {
            throw new ResponseException(e, 500, "unable to get from db");
        }
    }

    async setUserSchedule(userScheduleRq: UserSchedule, serviceProviderId: number, transactionId: number): Promise<void> {
        try {
            const sql = `INSERT INTO user_schedule (
                            user_schedule_id, 
                            day, 
                            start_time, 
                            end_time, 
                            service_provider_id, 
                            user_transaction_id
                        ) VALUES 
                         (DEFAULT, $1, $2, $3, $4, $5);`;
            await this.queryDB(sql, [
                userScheduleRq.day,
                userScheduleRq.start_time,
                userScheduleRq.end_time,
                serviceProviderId,
                transactionId
            ]);
        } catch (e) {
            throw new ResponseException(e, 500, "unable to insert into db");
        }
    }

    async updateUserSchedule(fieldsToUpdate: Partial<UpdateUserScheduleRq>, scheduleId: number): Promise<void> {
        try {
            const sql = this.buildUpdateQuery(fieldsToUpdate, "user_schedule", "user_schedule_id");
            await this.queryDB(sql, [...Object.values(fieldsToUpdate), scheduleId])
        } catch (e) {
            throw new ResponseException(e, 500, 'unable to update the data');
        }
    }

    private buildUpdateQuery(fields: Partial<UserSchedule>, tableName: string, idColumn: string): string {
        const columns = Object.keys(fields);
        
        if (columns.length === 0) {
            throw new ResponseException(null, 500, 'No fields to update')
        }

        const setClause = columns.map((col, index) => `${col} = $${index+1}`).join(", ");
        return `UPDATE ${tableName} SET ${setClause} WHERE ${idColumn} = $${columns.length+1}`;
    }

    async deleteUserSchedule(id: number): Promise<void> {
        try {
            const sql = `DELETE FROM user_schedule WHERE user_schedule_id = $1;`;
            await this.queryDB(sql, [id]);
        } catch (e) {
            throw new ResponseException(e, 500, 'unable to delete the data');
        }
    }
} 

export default UserScheduleRepo;