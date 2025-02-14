import dotenv from "dotenv";
import { GetRequestByEmailRq, GetRequestByStatusRq, GetRequestRs, SetRequestRq, UpdateRequestRq } from "../models/Request";
import JSHelperInstance from "../helpers/JsonConverterHelper";
import ResponseException from "../models/ResponseException";
import { UserSchedule } from "../models/UserSchedule";
import Repositories from "./Repositories";
import { RequestStatus } from "../helpers/enum";
dotenv.config();


interface IRequestRepo {
    getRequests(receiverEmail: string): Promise<GetRequestRs>;
    getRequestByEmail(requestRq: GetRequestByEmailRq): Promise<GetRequestRs>;
    getRequestsByStatus(requestRq: GetRequestByStatusRq): Promise<GetRequestRs>;
    setRequest(requestRq: SetRequestRq, schedule: UserSchedule): Promise<void>;
    updateRequest(requestRq: UpdateRequestRq): Promise<void>;
}

class RequestRepo extends Repositories implements IRequestRepo {
    async getRequests(receiverEmail: string): Promise<GetRequestRs> {
        try {
            const sql = `SELECT
	                        u.first_name AS sender_first_name,
                            u.last_name AS sender_last_name,
                            r.request_id AS id,
                            r.sender_email AS email,
                            r.receiver_email,
                            r.status,
                            r.request_date,
                            r.request_rate AS rate,
                            r.request_rate_type AS rate_type,
                            r.request_schedule_day AS day,
                            r.request_schedule_start_time AS start_time,
                            r.request_schedule_end_time AS end_time,
                            r.request_mode AS allow_edit
                        FROM users u INNER JOIN requests r on u.email_address = r.sender_email
                        WHERE r.receiver_email = $1`;
            const data = await this.queryDB(sql, [receiverEmail]);
            console.log('get requests data', data)
            if (data?.rows.length <= 0) {
                return null;
            }
            return JSHelperInstance._converter.deserializeObject(data, GetRequestRs);
        } catch (e: any) {
            throw new ResponseException(e, 500, "unable to get from db");
        }
    }

    async getRequestByEmail(requestRq: GetRequestByEmailRq): Promise<GetRequestRs> {
        try {
            const sql = 
                    `SELECT
                        u.first_name AS sender_first_name,
                        u.last_name AS sender_last_name,
                        r.request_id AS id,
                        r.sender_email,
                        r.receiver_email,
                        r.status,
                        r.request_date,
                        r.request_rate AS rate,
                        r.request_rate_type AS rate_type,
                        r.request_schedule_day AS day,
                        r.request_schedule_start_time AS start_time,
                        r.request_schedule_end_time AS end_time,
                        r.request_mode AS allow_edit
                    FROM users u LEFT JOIN requests r on u.email_address = r.sender_email
                    WHERE r.sender_email = $1 AND r.receiver_email = $2;`;
            const data = await this.queryDB(sql, [requestRq.senderEmail, requestRq.receiverEmail]);
            if (data?.rows.length <= 0) {
                return null;
            }
            return JSHelperInstance._converter.deserializeObject(data, GetRequestRs);
        } catch (e: any) {
            throw new ResponseException(e, 500, "unable to get from db");
        }
    }

    async getRequestsByStatus(requestRq: GetRequestByStatusRq): Promise<GetRequestRs> {
        try {
            const sql = 
                    `SELECT
                        u.first_name AS sender_first_name,
                        u.last_name AS sender_last_name,
                        r.request_id AS id,
                        r.sender_email,
                        r.receiver_email,
                        r.status,
                        r.request_date,
                        r.request_rate AS rate,
                        r.request_rate_type AS rate_type,
                        r.request_schedule_day AS day,
                        r.request_schedule_start_time AS start_time,
                        r.request_schedule_end_time AS end_time,
                        r.request_mode AS allow_edit
                    FROM users u LEFT JOIN requests r on u.email_address = r.sender_email
                    WHERE r.receiver_email = $1 AND r.status = $2;`;
            const data = await this.queryDB(sql, [requestRq.receiverEmail, requestRq.status]);
            if (data?.rows.length <= 0) {
                return null;
            }
            return JSHelperInstance._converter.deserializeObject(data, GetRequestRs);
        } catch (e: any) {
            throw new ResponseException(e, 500, 'unable to get from db')
        }
    }

    async setRequest(requestRq: SetRequestRq, schedule?: UserSchedule): Promise<void> {
        try {
            const sql = `INSERT INTO requests (
                            request_id, 
                            sender_email, 
                            receiver_email, 
                            status, 
                            request_date, 
                            request_rate, 
                            request_rate_type, 
                            request_schedule_day, 
                            request_schedule_start_time, 
                            request_schedule_end_time, request_mode) 
                        VALUES (DEFAULT, $1, $2, $3, CURRENT_TIMESTAMP, $4, $5, $6, $7, $8, $9);`;
            await this.queryDB(sql, [requestRq.senderEmail, requestRq.receiverEmail, RequestStatus.PENDING, requestRq.rate, requestRq.rateType, schedule?.day, schedule?.startTime, schedule?.endTime, requestRq.mode]);
        } catch (e: any) {
            console.log('error', e);
            throw new ResponseException(e, 500, 'unable to insert into db');
        }
    }

    async updateRequest(requestRq: UpdateRequestRq): Promise<void> {
        try {
            const sql = "UPDATE requests SET status = $1, request_date = CURRENT_TIMESTAMP WHERE sender_email = $2 AND receiver_email = $3;";
            await this.queryDB(sql, [requestRq.status, requestRq.senderEmail, requestRq.receiverEmail]);
        } catch (e: any) {
            console.log('update error', e)
            throw new ResponseException(e, 500, 'unable to update db');
        }
    }
} 

export default RequestRepo;