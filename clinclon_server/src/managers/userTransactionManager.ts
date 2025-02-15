import UserTransactionRepo from "../repositories/UserTransactionRepo";
import UserRepo from "../repositories/UserRepo";
import { GetUserTransactionRq, GetUserTransactionRs, SetUserTransactionRq, UpdateUserTransactionRq } from "../models/UserTransaction";
import ResponseException from "../models/ResponseException";
import dotenv from 'dotenv';
dotenv.config();

interface IUserTransactionManager {
    getUserTransaction(userTransactionRq: GetUserTransactionRq): Promise<GetUserTransactionRs>;
    setUserTransaction(userTransactionRq: SetUserTransactionRq): Promise<void>;
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

    async setUserTransaction(userTransactionRq: SetUserTransactionRq): Promise<void> {
        let [employerData, serviceProviderData] = await Promise.all(
            [this._userRepo.getUser(userTransactionRq.employerEmail),
            this._userRepo.getUser(userTransactionRq.serviceProviderEmail)]);
        
        if (!employerData || !serviceProviderData) {
            throw new ResponseException(null, 400, 'no data found');
        }

        let employerId = employerData.id;
        let serviceProviderId = serviceProviderData.id;

        await this._userTransactionRepo.setUserTransaction(userTransactionRq, employerId, serviceProviderId);
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