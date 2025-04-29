import RecordRepo from "../repositories/RecordRepo";
import UserTransactionManager from "./UserTransactionManager";
import {
  GetRecordRq,
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
  getRecordByPeriod(record: GetRecordByPeriodRq): Promise<GetRecordRs>;
  getRecordChanges(recordRq: GetRecordByPeriodRq): Promise<GetRecordChangeRs>;
  setRecord(record: SetRecordRq): Promise<GetRecordRs>;
  deleteRecord(record: DeleteRecordRq): Promise<void>;
  updateRecord(record: UpdateRecordRq): Promise<void>;
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

  async getRecordChanges(
    recordRq: GetRecordByPeriodRq
  ): Promise<GetRecordChangeRs> {
    let transactionData = await this._userTransactionManager.getUserTransaction(
      recordRq
    );

    if (!transactionData) {
      throw new ResponseException(null, 400, "no data found");
    }

    let transactionId = transactionData.id;
    return await this._recordRepo.getRecordChanges(transactionId);
  }

  async setRecord(recordRq: SetRecordRq): Promise<GetRecordRs> {
    let transactionData = await this._userTransactionManager.getUserTransaction(
      recordRq
    );

    if (!transactionData) {
      throw new ResponseException(null, 400, "no data found");
    }

    let transactionId = transactionData.id;
    const { startEpoch, endEpoch } = this.getTodayStartAndEndEpoch();

    let existingRecord = await this._recordRepo.getRecordByPeriod(
      transactionId,
      startEpoch,
      endEpoch
    );


    if (
      (recordRq.type === TimeType.START_TIME &&
        existingRecord && existingRecord.records[0].epoch_start_time) ||
      (recordRq.type === TimeType.END_TIME &&
        existingRecord && existingRecord.records[0].epoch_end_time)
    ) {
      throw new ResponseException(
        null,
        400,
        `${recordRq.type} time is already registered`
      );
    }

    if (recordRq.type === TimeType.START_TIME) {
      return await this._recordRepo.setStartRecord(
        transactionId,
        recordRq.recordTime
      );
    } else {
      await this._recordRepo.setEndRecord(recordRq.id, recordRq.recordTime);
    }
  }

  async updateRecord(recordRq: UpdateRecordRq): Promise<void> {
    return await this._recordRepo.updateRecord(recordRq);
    // if (recordRq.type === TimeType.START_TIME) {
    //   return await this._recordRepo.updateStartRecord(
    //     recordRq.recordId,
    //     recordRq.recordTime
    //   );
    // } else {
    //   await this._recordRepo.setEndRecord(
    //     recordRq.recordId,
    //     recordRq.recordTime
    //   );
    // }
  }

  async deleteRecord(recordRq: DeleteRecordRq): Promise<void> {
    await this._recordRepo.deleteRecord(recordRq.recordId);
  }

  getTodayStartAndEndEpoch(): { startEpoch: number; endEpoch: number } {
    const now = new Date();

    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    const startEpoch = Math.floor(startOfDay.getTime() / 1000);

    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);
    const endEpoch = Math.floor(endOfDay.getTime() / 1000);

    return { startEpoch, endEpoch };
  }
}

export default RecordManager;
