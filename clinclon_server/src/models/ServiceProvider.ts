import {JsonObject, JsonProperty, PropertyConvertingMode} from 'json2typescript';
import {BaseRequest} from './BaseRequest';
import { GetUserRs, UserRawDB } from './User';
import { UserSchedule } from './UserSchedule';
import { Mode, RateType } from '../helpers/enum';

@JsonObject("ServiceProviderRawDB")
class ServiceProviderRawDB extends BaseRequest {
    @JsonProperty("id", Number)
    id?: number = 0;
    @JsonProperty("first_name", String)
    first_name?: string = '';
    @JsonProperty("last_name", String)
    last_name?: string = '';
    @JsonProperty("email", String)
    email: string = '';
    @JsonProperty("status")
    status: string = '';
    @JsonProperty("rate", String)
    rate: string = '0';
    @JsonProperty("rate_type")
    rateType: RateType = RateType.HOURLY;
    @JsonProperty("schedule_id", Number, true)
    scheduleId?: number = 0;
    @JsonProperty("allow_edit")
    allowEdit: Mode = Mode.False;
}

@JsonObject("GetServiceProviderRsMini")  
class GetServiceProviderRsMini {
    @JsonProperty("firstName", String)
    firstName: string = "";
    @JsonProperty("lastName", String)
    lastName: string = "";
    @JsonProperty("email", String)
    email: string = "";
    @JsonProperty("status")
    status: string = '';
    @JsonProperty("rate", String)
    rate: string = "0";
    @JsonProperty("rateType")
    rateType: RateType = RateType.HOURLY;
    @JsonProperty("allow_edit")
    allowEdit: Mode = Mode.False;
    @JsonProperty("schedules")
    schedules: UserSchedule[]

    constructor(serviceProviderResult: ServiceProviderRawDB) {
        this.firstName = serviceProviderResult.first_name;
        this.lastName = serviceProviderResult.last_name;
        this.email = serviceProviderResult.email;
        this.status = serviceProviderResult.status;
        this.rate = serviceProviderResult.rate;
        this.rateType = serviceProviderResult.rateType;
        this.allowEdit = serviceProviderResult.allowEdit
        this.schedules = []
    }
}

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
    @JsonProperty('rate', Number, true)
    rate?: number;
    @JsonProperty('rate_type', String, true)
    rate_type?: RateType;
    @JsonProperty('status', String, true)
    status?: string;
    @JsonProperty('schedule', [UserSchedule], true)
    schedule?: UserSchedule[];
    @JsonProperty('update_by', String)
    update_by: string = '';
}

@JsonObject("GetServiceProviderRs")
class GetServiceProviderRs {
    @JsonProperty("rows", [ServiceProviderRawDB])
    serviceProviders: ServiceProviderRawDB[] = [];
}

@JsonObject("GetInactiveServiceProviderRs")
class GetInactiveServiceProviderRs extends GetServiceProviderRs {}

@JsonObject("ServiceProviderMini")
class ServiceProviderMiniRs {
    @JsonProperty("serviceProviderUser", GetUserRs)
    serviceProviderUser?: GetUserRs 
    constructor(userResult?: UserRawDB) {
       if (userResult) this.serviceProviderUser = new GetUserRs(userResult);
    }
}

export { ServiceProviderRawDB, GetServiceProviderRsMini, GetServiceProviderRq, GetServiceProviderRs, UpdateServiceProviderRq, ServiceProviderMiniRs, GetInactiveServiceProviderRs }