import {JsonObject, JsonProperty} from 'json2typescript';
import {BaseRequest} from './BaseRequest';

@JsonObject("GetUserScheduleRq") 
class GetUserScheduleRq extends BaseRequest {
    @JsonProperty("employerEmail", String)
    employerEmail: string = '';
    @JsonProperty("serviceProviderEmail", String)
    serviceProviderEmail: string = '';
}

@JsonObject("UserSchedule")
class UserSchedule {
    @JsonProperty("id", Number)
    id?: number = 0;
    @JsonProperty("day", String)
    day: string = "";
    @JsonProperty("startTime", String)
    startTime: string = "";
    @JsonProperty("endTime", String)
    endTime: string = "";
}

@JsonObject("GetUserScheduleRs")
class GetUserScheduleRs {
    @JsonProperty("rows", [UserSchedule])
    rows: UserSchedule[] = []
}

@JsonObject("SetUserScheduleRq")
class SetUserScheduleRq extends BaseRequest {
    @JsonProperty("employerEmail", String)
    employerEmail: string = '';
    @JsonProperty("serviceProviderEmail", String)
    serviceProviderEmail: string = '';
    @JsonProperty("schedule")
    schedules: UserSchedule[] = [];
}

export { GetUserScheduleRq, GetUserScheduleRs, SetUserScheduleRq, UserSchedule };