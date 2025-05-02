import {JsonObject, JsonProperty} from 'json2typescript';
import { JsonCustomConvert, JsonConverter } from 'json2typescript';
import {BaseRequest} from './BaseRequest';

// @JsonConverter
// class TimeConverter implements JsonCustomConvert<string> {
//     serialize(data: string): any {
//         return data;
//     }

//     deserialize(data: any): string {
//         return data;
//     }
// }

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
    @JsonProperty("start_time", String)
    start_time: string = "";
    @JsonProperty("end_time", String)
    end_time: string = "";
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

@JsonObject("UpdateUserScheduleRq")
class UpdateUserScheduleRq extends BaseRequest {
    @JsonProperty("user_schedule_id", Number, true)
    id?: number;
    @JsonProperty("day", String, true)
    day?: string;
    @JsonProperty("start_time", String, true)
    startTime?: string;
    @JsonProperty("end_time", String, true)
    endTime?: string;
}

export { GetUserScheduleRq, GetUserScheduleRs, SetUserScheduleRq, UserSchedule, UpdateUserScheduleRq };