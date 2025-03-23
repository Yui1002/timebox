import { Body, Get, Post, Put, Delete, Queries, Route } from "tsoa";
import RecordManager from '../managers/RecordManager'
import SuperController from "./SuperController";
import { GetRecordRq, GetRecordByDateRq, GetRecordByPeriodRq, SetRecordRq, GetRecordRs, UpdateRecordRq, DeleteRecordRq, GetRecordChangeRs } from "../models/Record";
import Validate from "../validators/CustomValidator";

interface IRecordController {
    getRecord(rq: GetRecordRq): Promise<GetRecordRs>
    getRecordByDate(rq: GetRecordByDateRq): Promise<GetRecordRs>;
    getRecordByPeriod(rq: GetRecordByPeriodRq): Promise<GetRecordRs>;
    setRecord(rq: SetRecordRq): Promise<GetRecordRs>;
    updateRecord(rq: UpdateRecordRq): Promise<GetRecordRs>;
    deleteRecord(rq: DeleteRecordRq): Promise<void>;
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

    @Get('/changes')
    @Validate
    public async getRecordChanges(@Queries() rq: GetRecordByPeriodRq): Promise<GetRecordChangeRs> {
        return await this._recordManager.getRecordChanges(rq);
    }

    @Post()
    @Validate
    public async setRecord(@Body() request: SetRecordRq): Promise<GetRecordRs> {
        return await this._recordManager.setRecord(request);
    }

    @Put('/')
    @Validate
    public async updateRecord(@Body() request: UpdateRecordRq): Promise<GetRecordRs> {
        return await this._recordManager.updateRecord(request);
    }

    @Delete('/')
    @Validate
    public async deleteRecord(@Body() request: DeleteRecordRq): Promise<void> {
        await this._recordManager.deleteRecord(request);
    }
}