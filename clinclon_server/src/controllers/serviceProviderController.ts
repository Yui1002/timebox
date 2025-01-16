import ServiceProviderManager from '../managers/serviceProviderManager';
import SuperController from './SuperController';
import { GetServiceProviderRq, UpdateServiceProviderRq, GetServiceProviderRs } from '../models/ServiceProvider';
import { Body, Get, Put, Queries, Route } from "tsoa";
import Validate from '../validators/CustomValidator';

interface IServiceProviderController {
    getServiceProvider(rq: GetServiceProviderRq): Promise<GetServiceProviderRs>;
    updateServiceProvider(request: UpdateServiceProviderRq): Promise<void>
}

@Route('serviceProvider')
export class ServiceProviderController extends SuperController implements IServiceProviderController {
    private _serviceProviderManager: ServiceProviderManager;

    constructor() {
        super();
        this._serviceProviderManager = new ServiceProviderManager();
    }

    @Get()
    @Validate
    public async getServiceProvider(@Queries() rq: GetServiceProviderRq): Promise<GetServiceProviderRs> {
        return await this._serviceProviderManager.getServiceProvider(rq);
    }
    
    @Put()
    @Validate
    public async updateServiceProvider(@Body() rq: UpdateServiceProviderRq): Promise<void> {
        await this._serviceProviderManager.updateServiceProvider(rq);
    }
}