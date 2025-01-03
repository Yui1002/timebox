import Validate from '../validators/CustomValidator';
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
    @Validate
    public async getEmployer(@Queries() rq: GetEmployerRq): Promise<GetEmployerRs> {
        return await this._employerManager.getEmployer(rq);
    }
    
}