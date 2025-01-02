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
    getRequests(receiverEmail: string): Promise<GetRequestRs>;
    getRequestByEmail(senderEmail: string, receiverEmail: string): Promise<GetRequestRs>;
    getRequestsByStatus(receiverEmail: string, status: RequestStatus): Promise<GetRequestRs>;
    setRequest(request: SetRequestRq): Promise<void>;
    updateRequestStatus(request: UpdateRequestStatusRq): Promise<void>;
    isRequestValid(senderEmail: string, receiverEmail: string): Promise<ServiceProviderMiniRs>
}

@Route('request')
export class RequestController extends SuperController implements IRequestController {
    private _requestManager: RequestManager;

    constructor() {
        super();
        this._requestManager = new RequestManager();
    }
   
    @Get()
    // public async getRequests(@Query() receiverEmail: string): Promise<GetRequestRs> {
    public async getRequests(@Queries() receiverEmail: string): Promise<GetRequestRs> {
        this._validator.validateBody(receiverEmail, new GetRequestRq());
        return await this._requestManager.getRequests(receiverEmail);
    }

    @Get('/email')
    public async getRequestByEmail(@Query() senderEmail: string, @Query() receiverEmail: string): Promise<GetRequestRs> {
        this._validator.validateBody<GetRequestByEmailRq>({...arguments}, new GetRequestByEmailRq());
        return await this._requestManager.getRequestByEmail(senderEmail, receiverEmail);
    }

    @Get('/status')
    public async getRequestsByStatus(@Query() receiverEmail: string, @Query() status: RequestStatus): Promise<GetRequestRs> {
        let rq = new GetRequestByStatusRq();
        rq.receiverEmail = receiverEmail;
        rq.status = status;
        this._validator.validateBody<GetRequestByStatusRq>(null, rq);
        return await this._requestManager.getRequestsByStatus(receiverEmail, status);
    }

    @Post()
    public async setRequest(@Body() request: SetRequestRq): Promise<void> {
        let parsedRq = this._validator.validateBody<SetRequestRq>(request, new SetRequestRq());
        await this._requestManager.setRequest(parsedRq);
    }

    @Put()
    async updateRequestStatus(@Body() request: UpdateRequestStatusRq): Promise<void> {
        let parsedRq = this._validator.validateBody<UpdateRequestStatusRq>(request, new UpdateRequestStatusRq());
        await this._requestManager.updateRequestStatus(parsedRq);
    }

    @Get('/eligible')
    async isRequestValid(@Query() senderEmail: string, @Query() receiverEmail: string): Promise<ServiceProviderMiniRs> {
        this._validator.validateBody<GetRequestByEmailRq>({senderEmail, receiverEmail}, new GetRequestByEmailRq());
        return await this._requestManager.isRequestValid(senderEmail, receiverEmail);
    }
}