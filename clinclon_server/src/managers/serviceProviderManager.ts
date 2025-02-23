import ServiceProviderRepo from "../repositories/ServiceProviderRepo";
import UserRepo from "../repositories/UserRepo";
import { GetServiceProviderRq, GetServiceProviderRsMini, ServiceProviderRawDB, UpdateServiceProviderRq } from "../models/ServiceProvider";
import ResponseException from "../models/ResponseException";
import UserScheduleManager from "./UserScheduleManager";

interface IServiceProviderManager {
    getServiceProvider(serviceProviderRq: GetServiceProviderRq): Promise<GetServiceProviderRsMini[]>;
    updateServiceProvider(serviceProvider: UpdateServiceProviderRq): Promise<void>;
}

class ServiceProviderManager implements IServiceProviderManager {
    private _serviceProviderRepo: ServiceProviderRepo;
    private _userRepo: UserRepo;
    private _userScheduleManager: UserScheduleManager;

    constructor() {
        this._serviceProviderRepo = new ServiceProviderRepo();
        this._userRepo = new UserRepo();
        this._userScheduleManager = new UserScheduleManager();
    }

    async getServiceProvider(serviceProviderRq: GetServiceProviderRq): Promise<GetServiceProviderRsMini[]> {
        let employerData = await this._userRepo.getUser(serviceProviderRq.employerEmail);
        if (!employerData) {
            throw new ResponseException(null, 400, 'no data found');
        }
        const { id: employerId, email: employerEmail } = employerData;
        
        let [activeServiceProviders, inactiveServiceProviders] = await Promise.all([
            this._serviceProviderRepo.getServiceProvider(employerId),
            this._serviceProviderRepo.getInactiveServiceProvider(employerEmail)
        ]);

        let scheduleIds: number[] = [];
        let serviceProviderData = [...activeServiceProviders.serviceProviders, ...inactiveServiceProviders.serviceProviders];
        serviceProviderData.forEach((sp) => {
            if (sp.scheduleId && sp.scheduleId !== 0) {
                scheduleIds.push(sp.scheduleId);
            }
        });
        let finalData: GetServiceProviderRsMini[];
        
        if (scheduleIds.length > 0) {
            let spSchedule = await this._userScheduleManager.getUserScheduleById(scheduleIds);
            finalData = serviceProviderData.map((sp: ServiceProviderRawDB) => {
                let matchedSchedules = spSchedule.rows.filter((us) => us.id == sp.scheduleId);
                let returnObj = new GetServiceProviderRsMini(sp);
                
                matchedSchedules.forEach((schedule) => returnObj.schedules.push(schedule));
                return returnObj;
            })
        } else {
            finalData = serviceProviderData.map((sp: ServiceProviderRawDB) => new GetServiceProviderRsMini(sp))
        }

        const hashMap = new Map<string, GetServiceProviderRsMini>();

        finalData.map((data) => {
            let entry = hashMap.get(data.email)
            if (!entry) {
                hashMap.set(data.email, data);
            } else {
                entry.schedules.push(...data.schedules)
            }
        });

        return Array.from(hashMap.values());
    }
    
    async updateServiceProvider(serviceProviderRq: UpdateServiceProviderRq): Promise<void> {
        let [employerData, serviceProviderData] = await Promise.all(
            [this._userRepo.getUser(serviceProviderRq.employerEmail), 
            this._userRepo.getUser(serviceProviderRq.serviceProviderEmail)]);

        if (!employerData || !serviceProviderData) {
            throw new ResponseException(null, 400, 'no data found');
        }

        let employerId = employerData.id;
        let serviceProviderId = serviceProviderData.id;

        let transactionData = await this._serviceProviderRepo.getTransaction(employerId, serviceProviderId);
        if (!transactionData) {
            throw new ResponseException(null, 400, 'no data found');
        }

        let transactionId = transactionData.id;

        //When you get the data from the database about the schedule
        //Then for each row in the schedule table, update all not null fields from the request to the table
        //then do a blind update

        /**
         * Request:
         * {
         *  Schedule: [
         *      {
         *          id: 149,
         *          day: Saturday,
         *          startTime: 12 AM,
         *          endTime: 12 PM
         *      },
         *      {
         *          id: 150,
         *          day: null,
         *          startTime: 1 PM,
         *          endTime: null
         *      }
         *  ]
         * }
         * 
         * [
         * "user_schedule_id"	"day"	"start_time"	"end_time"	"service_provider_id"	"user_transaction_id"
                149	            "Tuesday"	"10:00 AM"	"6:00 PM"	27	81
                150	            "Saturday"	"9:00 AM"	"9:00 PM"	27	81
         * ]
         * 
         * [CHECK] Check if id passed in from request schedule belongs to the appropriate service provier id and user transaction id
         * 
         * If all fields are null and the id is passed in, do not change row
         * If some fields are not null, only change those fields
         * If the id is not in the update array, then delete from db
         * 
         * 
         * Change the row id 1234, such that the data reflects that the day is now Saturday, the startime Is 12 AM and then end time is 12 PM
         * Change the row id 456, such that the data reflects that the day is unchanged, the startime is 1 PM and the endTime is unchanged  
         * 
         * 
         */

        await this._serviceProviderRepo.updateUserTransaction(serviceProviderRq, transactionId);
        
        // await Promise.all(serviceProviderRq.schedule.map(async (item: UserSchedule): Promise<void> => {
        //     let scheduleData = await this._serviceProviderRepo.getSchedule(item.id);
        //     if (!scheduleData) {
        //         throw new ResponseException(null, 400, 'no data found');
        //     } 
        //     if (!item.day && !item.startTime && !item.endTime) {
        //         await this._serviceProviderRepo.deleteSchedule(item.id);
        //     } else {
        //         let args: any = {};
        //         if (item.day !== scheduleData.day) args['day'] = item.day;
        //         if (item.startTime !== scheduleData.startTime) args['start_time'] = item.startTime;
        //         if (item.endTime !== scheduleData.endTime) args['end_time'] = item.endTime;
        //         await this._serviceProviderRepo.updateSchedule(args, item.id);
        //     }
        // }));

    }    
}

export default ServiceProviderManager;