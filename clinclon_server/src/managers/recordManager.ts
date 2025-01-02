import RecordRepo from "../repositories/recordRepo";
import UserTransactionManager from "./userTransactionManager";
import { GetRecordRq, GetRecordByDateRq, GetRecordByPeriodRq, GetRecordRs, SetRecordRq, TimeType } from "../models/Record";
import ResponseException from "../models/ResponseException";

interface IRecordManager {
    getRecord(record: GetRecordRq): Promise<GetRecordRs>;
    getRecordByDate(record: GetRecordByDateRq): Promise<GetRecordRs>;
    getRecordByPeriod(record: GetRecordByPeriodRq): Promise<GetRecordRs>;
    setRecord(record: SetRecordRq): Promise<GetRecordRs>;
}

class RecordManager implements IRecordManager {
    private _recordRepo: RecordRepo;
    private _userTransactionManager: UserTransactionManager;

    constructor() {
        this._recordRepo = new RecordRepo();
        this._userTransactionManager = new UserTransactionManager();
    }

    async getRecord(recordRq: GetRecordRq): Promise<GetRecordRs> {
        let transactionData = await this._userTransactionManager.getUserTransaction(recordRq);
        if (!transactionData) {
            throw new ResponseException(null, 400, 'no data found');
        }

        let transactionId = transactionData.id;

        let recordData = await this._recordRepo.getRecord(transactionId);
        if (!recordData) {
            throw new ResponseException(null, 400, 'no data found');
        }
        return recordData;
    }

    async getRecordByDate(recordRq: GetRecordByDateRq): Promise<GetRecordRs> {
        let transactionData = await this._userTransactionManager.getUserTransaction(recordRq);
        if (!transactionData) {
            throw new ResponseException(null, 400, 'no data found');
        }

        let transactionId = transactionData.id;

        let recordData = await this._recordRepo.getRecordByDate(transactionId, recordRq.date);
        if (!recordData) {
            throw new ResponseException(null, 400, 'no data found');
        }
        return recordData;
    }

    async getRecordByPeriod(recordRq: GetRecordByPeriodRq): Promise<GetRecordRs> {
        let transactionData = await this._userTransactionManager.getUserTransaction(recordRq);
        if (!transactionData) {
            throw new ResponseException(null, 400, 'no data found');
        }

        let transactionId = transactionData.id;

        let recordData = await this._recordRepo.getRecordByPeriod(transactionId, recordRq.from, recordRq.to);
        if (!recordData) {
            throw new ResponseException(null, 400, 'no data found');
        }
        return recordData;
    }

    async setRecord(recordRq: SetRecordRq): Promise<GetRecordRs> {
        let transactionData = await this._userTransactionManager.getUserTransaction(recordRq);

        if (!transactionData) {
            throw new ResponseException(null, 400, 'no data found');
        }

        let transactionId = transactionData.id;

        let recordExists = await this._recordRepo.getRecordByDate(transactionId, recordRq.recordTime);
        if (recordExists) {
            if (recordRq.type === TimeType.START_TIME) {
                return await this._recordRepo.updateStartRecord(recordExists.records[0].id, recordRq.recordTime);
            } else {
                return await this._recordRepo.updateEndRecord(recordExists.records[0].id, recordRq.recordTime);
            }
        } else {
            if (recordRq.type === TimeType.START_TIME) {
                return await this._recordRepo.setStartRecord(transactionId, recordRq.recordTime);
            } else {
                return await this._recordRepo.setEndRecord(transactionId, recordRq.recordTime);
            }
        }
    }
}

export default RecordManager;