import EmployerRepo from "../repositories/EmployerRepo";
import UserRepo from "../repositories/UserRepo";
import { GetEmployerRq, GetEmployerRs } from "../models/Employer";
import ResponseException from "../models/ResponseException";
import dotenv from 'dotenv';
dotenv.config();

interface IEmployerManager {
    getEmployer(employerRq: GetEmployerRq): Promise<GetEmployerRs>;
}

class EmployerManager implements IEmployerManager {
    private _employerRepo: EmployerRepo;
    private _userRepo: UserRepo;

    constructor() {
        this._employerRepo = new EmployerRepo();
        this._userRepo = new UserRepo();
    }
    
    async getEmployer(employerRq: GetEmployerRq): Promise<GetEmployerRs> {
        let user = await this._userRepo.getUser(employerRq.email);
        if (!user) {
            throw new ResponseException(null, 400, 'no data found');
        }

        let employer = await this._employerRepo.getEmployer(user.id);
        if (!employer) {
            throw new ResponseException(null, 400, 'No employers found');
        }
        
        return employer;
    }
}

export default EmployerManager;