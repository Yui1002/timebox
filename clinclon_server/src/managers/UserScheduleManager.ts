import UserRepo from "../repositories/UserRepo";
import ResponseException from "../models/ResponseException";
import dotenv from 'dotenv';
import { GetUserScheduleRq, GetUserScheduleRs, SetUserScheduleRq, UserSchedule } from "../models/UserSchedule";
import UserScheduleRepo from "../repositories/UserScheduleRepo";
import UserTransactionManager from "./UserTransactionManager";
import { GetUserTransactionRq } from "../models/UserTransaction";
dotenv.config();

interface IUserScheduleManager {
    getUserSchedule(userScheduleRq: GetUserScheduleRq): Promise<GetUserScheduleRs>;
    getUserScheduleById(id: number[]): Promise<GetUserScheduleRs>
    setUserSchedule(userScheduleRq: SetUserScheduleRq): Promise<void>;
}

class UserScheduleManager implements IUserScheduleManager {
    private _userTransactionManager: UserTransactionManager;
    private _userScheduleRepo: UserScheduleRepo;
    private _userRepo: UserRepo;

    constructor() {
        this._userScheduleRepo = new UserScheduleRepo();
        this._userTransactionManager = new UserTransactionManager();
        this._userRepo = new UserRepo();
    }

    async getUserSchedule(userScheduleRq: GetUserScheduleRq): Promise<GetUserScheduleRs> {
        let transactionData = await this._userTransactionManager.getUserTransaction({
            employerEmail: userScheduleRq.employerEmail,
            serviceProviderEmail: userScheduleRq.serviceProviderEmail
        } as GetUserTransactionRq);

        let transactionId = transactionData.id;
        return await this._userScheduleRepo.getUserSchedule(transactionId);
    }

    async getUserScheduleById(id: number[]): Promise<GetUserScheduleRs> {
        return await this._userScheduleRepo.getUserScheduleById(id);
    }

    async setUserSchedule(userScheduleRq: SetUserScheduleRq): Promise<void> {
        let serviceProviderData = await this._userRepo.getUser(userScheduleRq.serviceProviderEmail);
        if (!serviceProviderData) {
            throw new ResponseException(null, 400, 'data not found');
        }

        let serviceProviderId = serviceProviderData.id;

        let transactionData = await this._userTransactionManager.getUserTransaction({
            employerEmail: userScheduleRq.employerEmail,
            serviceProviderEmail: userScheduleRq.serviceProviderEmail
        } as GetUserTransactionRq);

        let transactionId = transactionData.id;

        userScheduleRq.schedules.map(async (schedule: UserSchedule) => {
            await this._userScheduleRepo.setUserSchedule(schedule, serviceProviderId, transactionId);
        })
    }
}

export default UserScheduleManager;