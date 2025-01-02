import UserTransactionRepo from "../repositories/userTransactionRepo";
import UserRepo from "../repositories/userRepo";
import { GetUserTransactionRq, GetUserTransactionRs, UpdateUserTransactionRq } from "../models/UserTransaction";
import ResponseException from "../models/ResponseException";
import dotenv from 'dotenv';
dotenv.config();


interface IUserTransactionManager {
    getUserTransaction(userTransactionRq: GetUserTransactionRq): Promise<GetUserTransactionRs>;
}

class UserTransactionManager implements IUserTransactionManager {
    private _userTransactionRepo: UserTransactionRepo;
    private _userRepo: UserRepo;

    constructor() {
        this._userTransactionRepo = new UserTransactionRepo();
        this._userRepo = new UserRepo();
    }
    
    async getUserTransaction(userTransactionRq: GetUserTransactionRq): Promise<GetUserTransactionRs> {
        let [employerData, serviceProviderData] = await Promise.all(
            [this._userRepo.getUser(userTransactionRq.employerEmail),
            this._userRepo.getUser(userTransactionRq.serviceProviderEmail)]);
        
        if (!employerData || !serviceProviderData) {
            throw new ResponseException(null, 400, 'no data found');
        }

        let employerId = employerData.id;
        let serviceProviderId = serviceProviderData.id;

        let transactionData = await this._userTransactionRepo.getUserTransaction(employerId, serviceProviderId);
        if (!transactionData) {
            throw new ResponseException(null, 400, 'no data found');
        }

        return transactionData;
    }

    async updateUserTransaction(userTransactionRq: UpdateUserTransactionRq): Promise<void> {
        let [employerData, serviceProviderData] = await Promise.all(
            [this._userRepo.getUser(userTransactionRq.employerEmail),
            this._userRepo.getUser(userTransactionRq.serviceProviderEmail)]);
        
        if (!employerData || !serviceProviderData) {
            throw new ResponseException(null, 400, 'no data found');
        }

        let employerId = employerData.id;
        let serviceProviderId = serviceProviderData.id;

        let transactionData = await this._userTransactionRepo.getUserTransaction(employerId, serviceProviderId);
        if (!transactionData) {
            throw new ResponseException(null, 400, 'no data found');
        }

        await this._userTransactionRepo.updateUserTransaction(userTransactionRq, transactionData.id)
    }
}

export default UserTransactionManager;