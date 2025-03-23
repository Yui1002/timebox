import Validate from '../validators/CustomValidator';
import EmployerManager from '../managers/EmployerManager';
import { GetEmployerRq, GetEmployerRs } from '../models/Employer';
import SuperController from './SuperController';
import { Get, Route, Queries, Security } from "tsoa";
import { JWT } from '../config';

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
    @Security(JWT)
    @Validate
    public async getEmployer(@Queries() rq: GetEmployerRq): Promise<GetEmployerRs> {
        return await this._employerManager.getEmployer(rq);
    }
    
}