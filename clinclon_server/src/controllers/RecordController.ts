import { Body, Get, Post, Put, Delete, Queries, Route, Security } from "tsoa";
import RecordManager from '../managers/RecordManager'
import SuperController from "./SuperController";
import { GetRecordRq, GetRecordByPeriodRq, SetRecordRq, GetRecordRs, UpdateRecordRq, DeleteRecordRq, GetRecordChangeRs, AddRecordRq } from "../models/Record";
import Validate from "../validators/CustomValidator";
import { JWT } from "../config";

interface IRecordController {
    getRecord(rq: GetRecordRq): Promise<GetRecordRs>
    getRecordByPeriod(rq: GetRecordByPeriodRq): Promise<GetRecordRs>;
    setRecord(rq: SetRecordRq): Promise<GetRecordRs>;
    updateRecord(rq: UpdateRecordRq): Promise<void>;
    deleteRecord(rq: DeleteRecordRq): Promise<void>;
    addRecord(rq: AddRecordRq): Promise<void>
}

@Route('record')
export class RecordController extends SuperController implements IRecordController {
    private _recordManager: RecordManager;

    constructor() {
        super();
        this._recordManager = new RecordManager();
    }

    @Get()
    @Security(JWT)
    @Validate
    public async getRecord(@Queries() rq: GetRecordRq): Promise<GetRecordRs> {
        return await this._recordManager.getRecord(rq);
    }

    @Get('/period')
    @Security(JWT)
    @Validate
    public async getRecordByPeriod(@Queries() rq: GetRecordByPeriodRq): Promise<GetRecordRs> {
        return await this._recordManager.getRecordByPeriod(rq);
    }

    @Get('/changes')
    @Security(JWT)
    @Validate
    public async getRecordChanges(@Queries() rq: GetRecordByPeriodRq): Promise<GetRecordChangeRs> {
        return await this._recordManager.getRecordChanges(rq);
    }

    @Post()
    @Security(JWT)
    @Validate
    public async setRecord(@Body() request: SetRecordRq): Promise<GetRecordRs> {
        return await this._recordManager.setRecord(request);
    }

    @Post('/add')
    @Security(JWT)
    @Validate
    public async addRecord(@Body() request: AddRecordRq): Promise<void> {
        await this._recordManager.addRecord(request);
    }
 
    @Put('/')
    @Security(JWT)
    @Validate
    public async updateRecord(@Body() request: UpdateRecordRq): Promise<void> {
        await this._recordManager.updateRecord(request);
    }

    @Delete('/')
    @Security(JWT)
    @Validate
    public async deleteRecord(@Body() request: DeleteRecordRq): Promise<void> {
        await this._recordManager.deleteRecord(request);
    }
}