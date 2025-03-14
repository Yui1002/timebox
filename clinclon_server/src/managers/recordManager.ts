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
  DeleteRecordRq,
  GetRecordChangeRs,
} from "../models/Record";
import ResponseException from "../models/ResponseException";

interface IRecordManager {
  getRecord(record: GetRecordRq): Promise<GetRecordRs>;
  getRecordByDate(record: GetRecordByDateRq): Promise<GetRecordRs>;
  getRecordByPeriod(record: GetRecordByPeriodRq): Promise<GetRecordRs>;
  getRecordChanges(recordRq: GetRecordByPeriodRq): Promise<GetRecordChangeRs>;
  setRecord(record: SetRecordRq): Promise<GetRecordRs>;
  updateRecord(record: UpdateRecordRq): Promise<GetRecordRs>;
  deleteRecord(record: DeleteRecordRq): Promise<void>;
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

  async getRecordChanges(recordRq: GetRecordByPeriodRq): Promise<GetRecordChangeRs> {
    let transactionData = await this._userTransactionManager.getUserTransaction(recordRq);

    if (!transactionData) {
      throw new ResponseException(null, 400, "no data found");
    }

    let transactionId = transactionData.id;
    return await this._recordRepo.getRecordChanges(transactionId)
  }

  async setRecord(recordRq: SetRecordRq): Promise<GetRecordRs> {
    let transactionData = await this._userTransactionManager.getUserTransaction(
      recordRq
    );

    if (!transactionData) {
      throw new ResponseException(null, 400, "no data found");
    }

    let transactionId = transactionData.id;

    if (recordRq.type === TimeType.START_TIME) {
      return await this._recordRepo.setStartRecord(
        transactionId,
        recordRq.recordTime
      );
    } else {
      return await this._recordRepo.updateEndRecord(
        recordRq.id,
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

  async deleteRecord(recordRq: DeleteRecordRq): Promise<void> {
    await this._recordRepo.deleteRecord(recordRq.recordId);
  }
}

export default RecordManager;
