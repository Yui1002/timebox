import EmployerManager from '../managers/employerManager';
import { GetEmployerRq, GetEmployerRs } from '../models/Employer';
import SuperController from './SuperController';
import { Get, Route, Queries } from "tsoa";

interface IEmployerController {
    getEmployer(request: GetEmployerRq, response: any, next: any): Promise<GetEmployerRs>;
}

@Route("employer")
export class EmployerController extends SuperController implements IEmployerController {
    private _employerManager: EmployerManager;

    constructor() {
        super();
        this._employerManager = new EmployerManager();
    }

    @Get()
    public async getEmployer(@Queries() rq: GetEmployerRq): Promise<GetEmployerRs> {
        const parsedRq = this._validator.validateBody<GetEmployerRq>(rq, new GetEmployerRq());
        return await this._employerManager.getEmployer(parsedRq);
    }
    
}