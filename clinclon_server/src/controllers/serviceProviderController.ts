import ServiceProviderManager from '../managers/serviceProviderManager';
import SuperController from './SuperController';
import { GetServiceProviderRq, UpdateServiceProviderRq, GetServiceProviderRs } from '../models/ServiceProvider';
import { Body, Get, Put, Query, Route } from "tsoa";

interface IServiceProviderController {
    getServiceProvider(employerEmail: string): Promise<GetServiceProviderRs>;
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
    public async getServiceProvider(@Query() employerEmail: string): Promise<GetServiceProviderRs> {
        this._validator.validateBody<GetServiceProviderRq>(employerEmail, new GetServiceProviderRq());
        return await this._serviceProviderManager.getServiceProvider(employerEmail);
    }
    
    @Put()
    public async updateServiceProvider(@Body() request: UpdateServiceProviderRq): Promise<void> {
        let parsedRq = this._validator.validateBody<UpdateServiceProviderRq>(request, new UpdateServiceProviderRq());
        await this._serviceProviderManager.updateServiceProvider(parsedRq);
    }
}