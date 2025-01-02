import {
    Body,
    Get,
    Post,
    Query,
    Queries,
    Route,
    Put
  } from "tsoa";
import RequestManager from '../managers/requestManager';
import SuperController from './SuperController';
import { GetRequestRq, GetRequestByEmailRq, GetRequestByStatusRq, SetRequestRq, UpdateRequestStatusRq, GetRequestRs } from '../models/Request';
import { ServiceProviderMiniRs } from "../models/ServiceProvider";
import { RequestStatus } from "../helpers/enum";

interface IRequestController {
    getRequests(rq: GetRequestRq): Promise<GetRequestRs>;
    getRequestByEmail(rq: GetRequestByEmailRq): Promise<GetRequestRs>;
    getRequestsByStatus(rq: GetRequestByStatusRq): Promise<GetRequestRs>;
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
    public async getRequests(@Queries() rq: GetRequestRq): Promise<GetRequestRs> {
        const parsedRq = this._validator.validateBody<GetRequestRq>(rq, new GetRequestRq());
        return await this._requestManager.getRequests(parsedRq);
    }

    @Get('/email')
    public async getRequestByEmail(@Queries() rq: GetRequestByEmailRq): Promise<GetRequestRs> {
        const parsedRq = this._validator.validateBody<GetRequestByEmailRq>(rq, new GetRequestByEmailRq());
        return await this._requestManager.getRequestByEmail(parsedRq);
    }

    @Get('/status')
    public async getRequestsByStatus(@Queries() rq: GetRequestByStatusRq): Promise<GetRequestRs> {
        const parsedRq = this._validator.validateBody<GetRequestByStatusRq>(rq, new GetRequestByStatusRq());
        return await this._requestManager.getRequestsByStatus(parsedRq);
    }

    @Post()
    public async setRequest(@Body() rq: SetRequestRq): Promise<void> {
        let parsedRq = this._validator.validateBody<SetRequestRq>(rq, new SetRequestRq());
        await this._requestManager.setRequest(parsedRq);
    }

    @Put()
    async updateRequestStatus(@Body() rq: UpdateRequestStatusRq): Promise<void> {
        let parsedRq = this._validator.validateBody<UpdateRequestStatusRq>(rq, new UpdateRequestStatusRq());
        await this._requestManager.updateRequestStatus(parsedRq);
    }

    @Get('/eligible')
    async isRequestValid(@Queries() rq: GetRequestByEmailRq): Promise<ServiceProviderMiniRs> {
        const parsedRq = this._validator.validateBody<GetRequestByEmailRq>(rq, new GetRequestByEmailRq());
        return await this._requestManager.isRequestValid(parsedRq);
    }
}