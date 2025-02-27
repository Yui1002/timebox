import { Body, Get, Post, Put, Queries, Route } from "tsoa";
import RecordManager from '../managers/RecordManager';
import SuperController from "./SuperController";
import { GetRecordRq, GetRecordByDateRq, GetRecordByPeriodRq, SetRecordRq, GetRecordRs, UpdateRecordRq } from "../models/Record";
import Validate from "../validators/CustomValidator";

interface IRecordController {
    getRecord(rq: GetRecordRq): Promise<GetRecordRs>
    getRecordByDate(rq: GetRecordByDateRq): Promise<GetRecordRs>;
    getRecordByPeriod(rq: GetRecordByPeriodRq): Promise<GetRecordRs>;
    setRecord(rq: SetRecordRq): Promise<void>;
}

@Route('record')
export class RecordController extends SuperController implements IRecordController {
    private _recordManager: RecordManager;

    constructor() {
        super();
        this._recordManager = new RecordManager();
    }

    @Get()
    @Validate
    public async getRecord(@Queries() rq: GetRecordRq): Promise<GetRecordRs> {
        return await this._recordManager.getRecord(rq);
    }

    @Get('/date')
    @Validate
    public async getRecordByDate(@Queries() rq: GetRecordByDateRq): Promise<GetRecordRs> {
        return await this._recordManager.getRecordByDate(rq);
    }

    @Get('/period')
    @Validate
    public async getRecordByPeriod(@Queries() rq: GetRecordByPeriodRq): Promise<GetRecordRs> {
        return await this._recordManager.getRecordByPeriod(rq);
    }

    @Post()
    @Validate
    public async setRecord(@Body() request: SetRecordRq): Promise<void> {
        await this._recordManager.setRecord(request);
    }

    //AMIT NOTE: Use PUT request instead of POST('/update')
    @Put('/update')
    @Validate
    public async updateRecord(@Body() request: UpdateRecordRq): Promise<void> {
        console.log('here')
        await this._recordManager.updateRecord(request);
    }
}