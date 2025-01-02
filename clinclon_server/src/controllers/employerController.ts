import EmployerManager from '../managers/employerManager';
import { GetEmployerRq, GetEmployerRs } from '../models/Employer';
import SuperController from './SuperController';
import {
    Body,
    Post,
    Route,
  } from "tsoa";

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

    /**
     * 
     * @param GetEmployerRq Get the employer data
     * @returns GetEmployerRs Return the employer data
     */
    @Post()
    public async getEmployer(@Body() request: GetEmployerRq): Promise<GetEmployerRs> {
        let parsedRq = this._validator.validateBody<GetEmployerRq>(request, new GetEmployerRq());
        return await this._employerManager.getEmployer(parsedRq);
    }
    
}