import {
    Body,
    Get,
    Post,
    Query,
    Queries,
    Route,
    Put
  } from "tsoa";
import RequestManager from '../managers/RequestManager';
import SuperController from './SuperController';
import { GetRequestRq, GetRequestByEmailRq, GetRequestByStatusRq, SetRequestRq, UpdateRequestStatusRq, GetRequestRs, GetRequestRsMini } from '../models/Request';
import { ServiceProviderMiniRs } from "../models/ServiceProvider";
import Validate from "../validators/CustomValidator";

interface IRequestController {
    getRequests(rq: GetRequestRq): Promise<GetRequestRs>;
    getRequestByEmail(rq: GetRequestByEmailRq): Promise<GetRequestRs>;
    getRequestsByStatus(rq: GetRequestByStatusRq): Promise<GetRequestRsMini[]>;
    setRequest(rq: SetRequestRq): Promise<void>;
    updateRequestStatus(rq: UpdateRequestStatusRq): Promise<void>;
    isRequestValid(rq: GetRequestByEmailRq): Promise<ServiceProviderMiniRs>
}

@Route('request')
export class RequestController extends SuperController implements IRequestController {
    private _requestManager: RequestManager;

    constructor() {
        super();
        this._requestManager = new RequestManager();
    }
   
    @Get()
    @Validate
    public async getRequests(@Queries() rq: GetRequestRq): Promise<GetRequestRs> {
        return await this._requestManager.getRequests(rq);
    }

    @Get('/email')
    @Validate
    public async getRequestByEmail(@Queries() rq: GetRequestByEmailRq): Promise<GetRequestRs> {
        return await this._requestManager.getRequestByEmail(rq);
    }

    @Get('/status')
    @Validate
    public async getRequestsByStatus(@Queries() rq: GetRequestByStatusRq): Promise<GetRequestRsMini[]> {
        return await this._requestManager.getRequestsByStatus(rq);
    }

    @Post()
    @Validate
    public async setRequest(@Body() rq: SetRequestRq): Promise<void> {
        await this._requestManager.setRequest(rq);
    }

    @Put()
    @Validate
    async updateRequestStatus(@Body() rq: UpdateRequestStatusRq): Promise<void> {
        await this._requestManager.updateRequestStatus(rq);
    }

    @Get('/eligible')
    @Validate
    async isRequestValid(@Queries() rq: GetRequestByEmailRq): Promise<ServiceProviderMiniRs> {
        return await this._requestManager.isRequestValid(rq);
    }
}