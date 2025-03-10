import RecordRepo from "../repositories/RecordRepo";
import UserTransactionManager from "./UserTransactionManager";
import {
  GetRecordRq,
  GetRecordByDateRq,
  GetRecordByPeriodRq,
  GetRecordRs,
  SetRecordRq,
  TimeType,
  UpdateRecordRq,
} from "../models/Record";
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
    let transactionData = await this._userTransactionManager.getUserTransaction(
      recordRq
    );
    if (!transactionData) {
      throw new ResponseException(null, 400, "no data found");
    }

    let transactionId = transactionData.id;

    let recordData = await this._recordRepo.getRecord(transactionId);
    if (!recordData) {
      throw new ResponseException(null, 400, "no data found");
    }
    return recordData;
  }

  async getRecordByDate(recordRq: GetRecordByDateRq): Promise<GetRecordRs> {
    let transactionData = await this._userTransactionManager.getUserTransaction(
      recordRq
    );
    if (!transactionData) {
      throw new ResponseException(null, 400, "no data found");
    }

    let transactionId = transactionData.id;

    let recordData = await this._recordRepo.getRecordByDate(
      transactionId,
      recordRq.date
    );
    if (!recordData) {
      throw new ResponseException(null, 400, "no data found");
    }
    return recordData;
  }

  async getRecordByPeriod(recordRq: GetRecordByPeriodRq): Promise<GetRecordRs> {
    let transactionData = await this._userTransactionManager.getUserTransaction(
      recordRq
    );
    if (!transactionData) {
      throw new ResponseException(null, 400, "no data found");
    }

    let transactionId = transactionData.id;

    let recordData = await this._recordRepo.getRecordByPeriod(
      transactionId,
      recordRq.from,
      recordRq.to
    );
    if (!recordData) {
      throw new ResponseException(null, 400, "no data found");
    }
    return recordData;
  }

  async setRecord(recordRq: SetRecordRq): Promise<GetRecordRs> {
    let transactionData = await this._userTransactionManager.getUserTransaction(
      recordRq
    );

    if (!transactionData) {
      throw new ResponseException(null, 400, "no data found");
    }

    let transactionId = transactionData.id;

    let recordExists = await this._recordRepo.getRecordByDate(
      transactionId,
      recordRq.recordTime
    );

    if (recordExists) {
        throw new ResponseException(null, 400, "duplicate record"); 
    }

    if (recordRq.type === TimeType.START_TIME) {
      return await this._recordRepo.setStartRecord(
        transactionId,
        recordRq.recordTime
      );
    } else {
      return await this._recordRepo.setEndRecord(
        transactionId,
        recordRq.recordTime
      );
    }
  }

  async updateRecord(recordRq: UpdateRecordRq): Promise<GetRecordRs> {
    if (recordRq.type === TimeType.START_TIME) {
      return await this._recordRepo.updateStartRecord(
        recordRq.recordId,
        recordRq.recordTime
      );
    } else {
      return await this._recordRepo.updateEndRecord(
        recordRq.recordId,
        recordRq.recordTime
      );
    }
  }
}

export default RecordManager;
