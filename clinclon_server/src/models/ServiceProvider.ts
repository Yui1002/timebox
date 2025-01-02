import {JsonObject, JsonProperty} from 'json2typescript';
import {BaseRequest} from './BaseRequest';
import { GetUserRs, UserRawDB } from './User';
import { GetUserScheduleRs } from './UserSchedule';
import { RateType, RequestStatus } from '../helpers/enum';

@JsonObject("GetServiceProviderRq")
class GetServiceProviderRq extends BaseRequest {
    @JsonProperty("employerEmail", String)
    employerEmail: string = "";
}

@JsonObject("UpdateServiceProviderRq")
class UpdateServiceProviderRq extends BaseRequest {
    @JsonProperty("employerEmail", String)
    employerEmail: string = "";
    @JsonProperty("serviceProviderEmail", String)
    serviceProviderEmail: string = '';
    @JsonProperty('rate', Number)
    rate: number = 0;
    @JsonProperty('rateType', String)
    rateType: RateType = RateType.HOURLY;
    @JsonProperty('schedule', [GetUserScheduleRs])
    schedule: GetUserScheduleRs[] = [];
}

class ServiceProvider {
    @JsonProperty("id", Number)
    id: number;

    @JsonProperty("first_name", String)
    first_name: string;

    @JsonProperty("last_name", String)
    last_name: string;

    @JsonProperty("email", String)
    email: string;

    @JsonProperty("status", RequestStatus)
    status: RequestStatus;

    @JsonProperty("rate", Number)
    rate?: number;

    @JsonProperty("rate_type", RateType)
    rateType?: RateType;
    @JsonProperty("schedule_id", Number)
    scheduleId: number;

    @JsonProperty("day", String)
    day: string;

    @JsonProperty("start_time", String)
    startTime: string;

    @JsonProperty("end_time", String)
    endTime: string;

    @JsonProperty("allow_edit", Boolean)
    allowEdit: boolean;
    @JsonProperty("schedule")
    schedule?: GetUserScheduleRs[] = [];
}

@JsonObject("GetServiceProviderRs")
class GetServiceProviderRs {
    @JsonProperty("rows", [ServiceProvider])
    serviceProviders: ServiceProvider[] = [];
}

@JsonObject("ServiceProviderMini")
class ServiceProviderMiniRs {
    @JsonProperty("serviceProviderUser", GetUserRs)
    serviceProviderUser?: GetUserRs 
    constructor(userResult?: UserRawDB) {
       if (userResult) this.serviceProviderUser = new GetUserRs(userResult);
    }
}

export { GetServiceProviderRq, GetServiceProviderRs, UpdateServiceProviderRq, ServiceProviderMiniRs }