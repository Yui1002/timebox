import ServiceProviderRepo from "../repositories/ServiceProviderRepo";
import UserRepo from "../repositories/UserRepo";
import { GetServiceProviderRq, GetServiceProviderRsMini, ServiceProviderRawDB, UpdateServiceProviderRq } from "../models/ServiceProvider";
import ResponseException from "../models/ResponseException";
import UserScheduleManager from "./UserScheduleManager";
import UserScheduleRepo from "../repositories/UserScheduleRepo";
import { UpdateUserScheduleRq, UserSchedule } from "../models/UserSchedule";

interface IServiceProviderManager {
    getServiceProvider(serviceProviderRq: GetServiceProviderRq): Promise<GetServiceProviderRsMini[]>;
    updateServiceProvider(serviceProvider: Partial<UpdateServiceProviderRq>): Promise<void>;
}

class ServiceProviderManager implements IServiceProviderManager {
    private _serviceProviderRepo: ServiceProviderRepo;
    private _userRepo: UserRepo;
    private _userScheduleManager: UserScheduleManager;
    private _userScheduleRepo: UserScheduleRepo;

    constructor() {
        this._serviceProviderRepo = new ServiceProviderRepo();
        this._userRepo = new UserRepo();
        this._userScheduleManager = new UserScheduleManager();
        this._userScheduleRepo = new UserScheduleRepo();
    }

    async getServiceProvider(serviceProviderRq: GetServiceProviderRq): Promise<GetServiceProviderRsMini[]> {
        let employerData = await this._userRepo.getUser(serviceProviderRq.employerEmail);
        if (!employerData) {
            throw new ResponseException(null, 400, 'no data found');
        }
        const { id: employerId, email_address: employerEmail } = employerData;
        
        let [activeServiceProviders, inactiveServiceProviders] = await Promise.all([
            this._serviceProviderRepo.getServiceProvider(employerId),
            this._serviceProviderRepo.getInactiveServiceProvider(employerEmail)
        ]);

        let scheduleIds: number[] = [];
        let serviceProviderData = [
            ...(activeServiceProviders?.serviceProviders || []), 
            ...(inactiveServiceProviders?.serviceProviders || [])
        ];

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
    
    async updateServiceProvider(serviceProviderRq: Partial<UpdateServiceProviderRq>): Promise<void> {
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

        const { employerEmail, serviceProviderEmail, schedule, ...changedFields } = serviceProviderRq;
        
        await this._serviceProviderRepo.updateUserTransaction(changedFields, transactionId);

        if (schedule && schedule.length > 0) {
            for (const sched of schedule) {

        
                if (this.isDeleteSchedule(sched)) {
                    await this._userScheduleRepo.deleteUserSchedule(sched.id);
                } else if (this.isUpdateUserScheduleRq(sched)) {
                    // Update existing schedule
                    const { id, ...changedScheduleFields } = sched;
                    await this._userScheduleRepo.updateUserSchedule(changedScheduleFields, id);
                } else {
                    // Insert new schedule
                    await this._userScheduleRepo.setUserSchedule(sched as UserSchedule, serviceProviderId, transactionId);
                }
            }
        }
    }   

    private isDeleteSchedule(schedule: UpdateUserScheduleRq): boolean {
        return schedule.id !== undefined && !schedule.day && !schedule.start_time && !schedule.end_time;
    }
    
    private isUpdateUserScheduleRq(schedule: any): schedule is UpdateUserScheduleRq {
        return (schedule as UpdateUserScheduleRq).id !== undefined;
    }
}

export default ServiceProviderManager;