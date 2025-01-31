import UserTransactionRepo from "../repositories/userTransactionRepo";
import UserRepo from "../repositories/userRepo";
import ResponseException from "../models/ResponseException";
import dotenv from 'dotenv';
import { GetUserScheduleRq, GetUserScheduleRs, SetUserScheduleRq, UserSchedule } from "../models/UserSchedule";
import UserScheduleRepo from "../repositories/userScheduleRepo";
import UserTransactionManager from "./userTransactionManager";
import { GetUserTransactionRq } from "../models/UserTransaction";
dotenv.config();

interface IUserScheduleManager {
    getUserSchedule(userScheduleRq: GetUserScheduleRq): Promise<GetUserScheduleRs>;
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
        console.log('transaction Id', transactionId)

        userScheduleRq.schedules.map(async (schedule: UserSchedule) => {
            console.log('schedule', schedule)
            await this._userScheduleRepo.setUserSchedule(schedule, serviceProviderId, transactionId);
        })
    }
}

export default UserScheduleManager;