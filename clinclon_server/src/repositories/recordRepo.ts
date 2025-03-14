import dotenv from "dotenv";
import { GetRecordChangeRs, GetRecordRs } from "../models/Record";
import JSHelperInstance from "../helpers/JsonConverterHelper";
import ResponseException from "../models/ResponseException";
import Repositories from "./Repositories";
dotenv.config();

interface IRecordRepo {
    getRecord(userTransactionId: number): Promise<GetRecordRs | null>
    getRecordByDate(userTransactionId: number, string: string): Promise<GetRecordRs>;
    getRecordByPeriod(userTransactionId: number, from: string, to: string): Promise<GetRecordRs>;
    getRecordChanges(userTransactionId: number): Promise<GetRecordChangeRs>;
    setStartRecord(userTransactionId: number, startTime: string): Promise<GetRecordRs>;
    setEndRecord(userTransactionId: number, endTime: string): Promise<GetRecordRs>;
    updateStartRecord(recordId: number, startTime: string): Promise<GetRecordRs>;
    updateEndRecord(recordId: number, endTime: string): Promise<GetRecordRs>;
    deleteRecord(recordId: number): Promise<void>
}

class RecordRepo extends Repositories implements IRecordRepo  {

    async getRecord(userTransactionId: number): Promise<GetRecordRs | null> {
        try {
            const sql = "SELECT time_record_id AS id, start_time, end_time FROM time_record WHERE id_user_transaction = $1;";
            const data = await this.queryDB(sql, [userTransactionId]);

            if (data?.rows.length <= 0) {
                return null;
            }
            return JSHelperInstance._converter.deserializeObject(data, GetRecordRs);
        } catch(e: any) {
            console.log('error here', e) 
            throw new ResponseException(e, 500, 'unable to get from db');
        } 
    }

    async getRecordByDate(userTransactionId: number, date: string): Promise<GetRecordRs> {
        try {
            const sql = "SELECT time_record_id AS id, start_time, end_time FROM time_record WHERE id_user_transaction = $1 AND (start_time::DATE = $2 OR end_time::DATE = $3);";
            const data = await this.queryDB(sql, [userTransactionId, date, date]);
            if (data?.rows.length <= 0) {
                return null;
            }
            return JSHelperInstance._converter.deserializeObject(data, GetRecordRs);
        } catch (e: any) {
            throw new ResponseException(e, 500, 'unable to get from db');
        }
    }

    async getRecordByPeriod(userTransactionId: number, from: string, to: string): Promise<GetRecordRs> {
        try {
            const sql = "SELECT time_record_id AS id, start_time, end_time FROM time_record WHERE (start_time, end_time) OVERLAPS ($1::DATE, $2::DATE) AND id_user_transaction = $3 AND status = 'active';";
            const data = await this.queryDB(sql, [from, to, userTransactionId]);
            if (data?.rows.length <= 0) {
                return null;
            }
            return JSHelperInstance._converter.deserializeObject(data, GetRecordRs);
        } catch (e: any) {
            throw new ResponseException(e, 500, 'unable to get from db');
        }
    }

    async getRecordChanges(userTransactionId: number): Promise<GetRecordChangeRs> {
        try {
            const sql = `SELECT start_time, end_time, changed_on, updated_by FROM time_record_audits 
                            WHERE time_record_id IN 
                            (SELECT time_record_id FROM time_record WHERE id_user_transaction = $1);`;
            const data = await this.queryDB(sql, [userTransactionId]);
            if (data?.rows.length <= 0) {
                return null;
            }
            return JSHelperInstance._converter.deserializeObject(data, GetRecordChangeRs);
        } catch (e) {
            throw new ResponseException(e, 500, 'unable to get from db');
        }
    }

    async setStartRecord(userTransactionId: number, startTime: string): Promise<GetRecordRs> {
        let now = new Date();
        try {
            const sql = `INSERT INTO time_record (
                            time_record_id, 
                            status, 
                            start_time,
                            end_time, 
                            update_date, 
                            update_by, 
                            id_user_transaction
                        ) VALUES (
                            DEFAULT, 
                            DEFAULT, 
                            $1, 
                            NULL, 
                            $2, 
                            $3, 
                            $4
                        ) RETURNING time_record_id AS id, start_time, end_time;`;
            const data = await this.queryDB(sql, [startTime, now, 'temp', userTransactionId]);
            if (data?.rows.length <= 0) {
                return null;
            }
            return JSHelperInstance._converter.deserializeObject(data, GetRecordRs);
        } catch (e: any) {
            throw new ResponseException(e, 500, 'unable to insert into db');
        }
    }
    
    async setEndRecord(userTransactionId: number, endTime: string): Promise<GetRecordRs> {
        try {
            const sql = `INSERT INTO time_record (
                            time_record_id, 
                            status, 
                            start_time, 
                            end_time, 
                            update_date, 
                            update_by, 
                            id_user_transaction
                        ) VALUES (
                            DEFAULT, 
                            DEFAULT, 
                            $1, 
                            $2, 
                            CURRENT_TIMESTAMP, 
                            $3, 
                            $4
                        ) RETURNING time_record_id AS id, start_time, end_time;`
            const data = await this.queryDB(sql, [null, endTime, 'temp', userTransactionId]);
            if (data?.rows.length <= 0) {
                return null;
            }
            return JSHelperInstance._converter.deserializeObject(data, GetRecordRs);
        } catch (e: any) {
            throw new ResponseException(e, 500, 'unable to insert into db');
        }
    }

    async updateStartRecord(recordId: number, startTime: string): Promise<GetRecordRs> {
        try {
            const sql = `UPDATE time_record 
                            SET start_time = $1 
                            WHERE time_record_id = $2 
                            RETURNING time_record_id AS id, start_time, end_time;`;
            const data = await this.queryDB(sql, [startTime, recordId]);
            if (data?.rows.length <= 0) {
                return null;
            }
            return JSHelperInstance._converter.deserializeObject(data, GetRecordRs);
        } catch (e: any) {
            throw new ResponseException(e, 500, 'unable to insert into db');
        }
    }

    async updateEndRecord(recordId: number, endTime: string): Promise<GetRecordRs> {
        try {
            const sql = `UPDATE time_record 
                            SET end_time = $1 
                            WHERE time_record_id = $2 
                            RETURNING time_record_id AS id, start_time, end_time;`
            const data = await this.queryDB(sql, [endTime, recordId]);
            if (data?.rows.length <= 0) {
                return null;
            }
            return JSHelperInstance._converter.deserializeObject(data, GetRecordRs);
        } catch (e: any) {
            throw new ResponseException(e, 500, 'unable to insert into db');
        }
    }

    async deleteRecord(recordId: number): Promise<void> {
        try {   
            const sql = `UPDATE time_record 
                            SET status = $1 
                            WHERE time_record_id = $2;`;
            await this.queryDB(sql, ['inactive', recordId]);
        } catch (e: any) {
            throw new ResponseException(e, 500, 'unable to delete from db');
        }
    }
}

export default RecordRepo;