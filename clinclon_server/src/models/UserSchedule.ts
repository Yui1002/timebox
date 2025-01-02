import {JsonObject, JsonProperty} from 'json2typescript';
import {BaseRequest} from './BaseRequest';

@JsonObject("GetUserScheduleRs")
class GetUserScheduleRs extends BaseRequest {
    @JsonProperty("id", Number)
    id?: number = 0;
    @JsonProperty("day", String)
    day: string = "";
    @JsonProperty("startTime", String)
    startTime: string = "";
    @JsonProperty("endTime", String)
    endTime: string = "";
}

export { GetUserScheduleRs };