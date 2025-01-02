import EmployerRepo from "../repositories/employerRepo";
import UserRepo from "../repositories/userRepo";
import { GetEmployerRq, GetEmployerRs } from "../models/Employer";
import ResponseException from "../models/ResponseException";
import dotenv from 'dotenv';
dotenv.config();


interface IEmployerManager {
    getEmployer(user: GetEmployerRq): Promise<GetEmployerRs>;
}

class EmployerManager implements IEmployerManager {
    private _employerRepo: EmployerRepo;
    private _userRepo: UserRepo;

    constructor() {
        this._employerRepo = new EmployerRepo();
        this._userRepo = new UserRepo();
    }
    
    async getEmployer(userRq: GetEmployerRq): Promise<GetEmployerRs> {
        let user = await this._userRepo.getUser(userRq.email);
        if (!user) {
            throw new ResponseException(null, 400, 'no data found');
        }

        let employer = await this._employerRepo.getEmployer(user.id);
        if (!employer) {
            throw new ResponseException(null, 204, 'No employers found');
        }
        
        return employer;
    }
}

export default EmployerManager;