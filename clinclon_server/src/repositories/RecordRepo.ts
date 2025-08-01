import dotenv from "dotenv";
import { GetRecordChangeRs, GetRecordRs, UpdateRecordRq } from "../models/Record";
import JSHelperInstance from "../helpers/JsonConverterHelper";
import ResponseException from "../models/ResponseException";
import Repositories from "./Repositories";
dotenv.config();

interface IRecordRepo {
    getRecord(userTransactionId: number): Promise<GetRecordRs | null>
    getRecordByPeriod(userTransactionId: number, from: number, to: number): Promise<GetRecordRs>;
    getRecordChanges(userTransactionId: number): Promise<GetRecordChangeRs>;
    setStartRecord(userTransactionId: number, startTime: number): Promise<GetRecordRs>;
    setEndRecord(userTransactionId: number, endTime: number): Promise<GetRecordRs>;
    updateStartRecord(recordId: number, startTime: number): Promise<GetRecordRs>;
    deleteRecord(recordId: number): Promise<void>
    updateRecord(recordRq: UpdateRecordRq): Promise<void>;
    addRecord(updateBy: string, startTimeEpoch: number, endTimeEpoch: number, userTransactionId: number): Promise<void>
}

class RecordRepo extends Repositories implements IRecordRepo  {

    async getRecord(userTransactionId: number): Promise<GetRecordRs | null> {
        try {
            const sql = "SELECT time_record_id AS id, epoch_start_time, epoch_end_time FROM time_record WHERE id_user_transaction = $1;";
            const data = await this.queryDB(sql, [userTransactionId]);

            if (data?.rows.length <= 0) {
                return null;
            }
            return JSHelperInstance._converter.deserializeObject(data, GetRecordRs);
        } catch(e: any) {
            throw new ResponseException(e, 500, 'unable to get from db');
        } 
    }

    async getRecordByPeriod(userTransactionId: number, from: number, to: number): Promise<GetRecordRs> {
        try {
            const sql = `SELECT 
                            tr.time_record_id AS id, 
                            tr.epoch_start_time, 
                            tr.epoch_end_time,
                            ut.rate,
                            ut.rate_type
                        FROM time_record tr
                        INNER JOIN user_transaction ut
                        ON tr.id_user_transaction = ut.user_transaction_id
                        WHERE 
                            (
                                (tr.epoch_start_time >= $1 AND tr.epoch_end_time < $2) OR 
                                (tr.epoch_start_time >= $1 AND tr.epoch_end_time IS NULL) OR
                                (tr.epoch_start_time IS NULL AND tr.epoch_end_time < $2)
                            )
                            AND tr.id_user_transaction = $3 
                            AND tr.status = 'active'`
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

    async setStartRecord(userTransactionId: number, startTimeEpoch: number): Promise<GetRecordRs> {
        try {
            const sql = `INSERT INTO time_record (
                            time_record_id, 
                            status, 
                            update_date,
                            update_by, 
                            id_user_transaction, 
                            epoch_start_time, 
                            epoch_end_time
                        ) VALUES (
                            DEFAULT, 
                            'active', 
                            CURRENT_TIMESTAMP, 
                            $1, 
                            $2, 
                            $3, 
                            NULL
                        ) RETURNING time_record_id AS id, epoch_start_time, epoch_end_time;`;
            const data = await this.queryDB(sql, ['temp', userTransactionId, startTimeEpoch]);
            if (data?.rows.length <= 0) {
                return null;
            }
            return JSHelperInstance._converter.deserializeObject(data, GetRecordRs);
        } catch (e: any) {
            throw new ResponseException(e, 500, 'unable to insert into db');
        }
    }

    async updateStartRecord(recordId: number, startTime: number): Promise<GetRecordRs> {
        try {
            const sql = `UPDATE time_record 
                            SET epoch_start_time = $1 
                            WHERE time_record_id = $2 
                            RETURNING time_record_id AS id, epoch_start_time, epoch_end_time;`;
            const data = await this.queryDB(sql, [startTime, recordId]);
            if (data?.rows.length <= 0) {
                return null;
            }
            return JSHelperInstance._converter.deserializeObject(data, GetRecordRs);
        } catch (e: any) {
            throw new ResponseException(e, 500, 'unable to insert into db');
        }
    }

    async setEndRecord(recordId: number, endTimeEpoch: number): Promise<GetRecordRs> {
        try {
            const sql = `UPDATE time_record 
                            SET epoch_end_time = $1 
                            WHERE time_record_id = $2 
                            RETURNING time_record_id AS id, epoch_start_time, epoch_end_time;`
            const data = await this.queryDB(sql, [endTimeEpoch, recordId]);
            if (data?.rows.length <= 0) {
                return null;
            }
            return JSHelperInstance._converter.deserializeObject(data, GetRecordRs);
        } catch (e: any) {
            throw new ResponseException(e, 500, 'unable to insert into db');
        }
    }

    async addRecord(updateBy: string, startTimeEpoch: number, endTimeEpoch: number, userTransactionId: number): Promise<void> {
        try {
            const sql = `INSERT INTO time_record (
                            status, 
                            update_date, 
                            update_by, 
                            id_user_transaction, 
                            epoch_start_time, 
                            epoch_end_time
                        ) VALUES ('active', CURRENT_TIMESTAMP, $1, $2, $3, $4);`;
            await this.queryDB(sql, [updateBy, userTransactionId, startTimeEpoch, endTimeEpoch]);
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

    async updateRecord(recordRq: UpdateRecordRq): Promise<void> {
        try {
            const sql = `UPDATE time_record SET 
                            epoch_start_time = $1, 
                            epoch_end_time = $2, 
                            update_by = $3 
                        WHERE time_record_id = $4;`;
            await this.queryDB(sql, [recordRq.startTime, recordRq.endTime, recordRq.updatedBy, recordRq.recordId]);
        } catch (e) {
            throw new ResponseException(e, 500, 'unable to update data')
        }
    }
}

export default RecordRepo;