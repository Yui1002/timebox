import { Body, Get, Post, Queries, Route } from "tsoa";
import RecordManager from "../managers/recordManager";
import SuperController from "./SuperController";
import { GetRecordRq, GetRecordByDateRq, GetRecordByPeriodRq, SetRecordRq, GetRecordRs, IGetRecordRq } from "../models/Record";

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
    public async getRecord(@Queries() rq: GetRecordRq): Promise<GetRecordRs> {
        const parsedRq = this._validator.validateBody<GetRecordRq>(rq, new GetRecordRq());
        return await this._recordManager.getRecord(parsedRq);
    }

    @Get('/date')
    public async getRecordByDate(@Queries() rq: GetRecordByDateRq): Promise<GetRecordRs> {
        const parsedRq = this._validator.validateBody<GetRecordByDateRq>(rq, new GetRecordByDateRq());
        return await this._recordManager.getRecordByDate(parsedRq);
    }

    @Get('/period')
    public async getRecordByPeriod(@Queries() rq: GetRecordByPeriodRq): Promise<GetRecordRs> {
        const parsedRq = this._validator.validateBody<GetRecordByPeriodRq>(rq, new GetRecordByPeriodRq());
        return await this._recordManager.getRecordByPeriod(parsedRq);
    }

    @Post()
    public async setRecord(@Body() request: SetRecordRq): Promise<void> {
        let parsedRq = this._validator.validateBody<SetRecordRq>(request, new SetRecordRq());
        await this._recordManager.setRecord(parsedRq);
    }
}