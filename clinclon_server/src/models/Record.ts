import {JsonObject, JsonProperty} from 'json2typescript';
import {BaseRequest} from './BaseRequest';

enum TimeType {
    START_TIME = 'start',
    END_TIME = 'end',
}

@JsonObject("GetRecordRq")
class GetRecordRq extends BaseRequest {
    @JsonProperty("employerEmail", String)
    employerEmail: string = "";
    @JsonProperty("serviceProviderEmail", String)
    serviceProviderEmail: string = "";
}

@JsonObject("GetRecordByDateRq")
class GetRecordByDateRq extends BaseRequest {
    @JsonProperty("employerEmail", String)
    employerEmail: string = "";
    @JsonProperty("serviceProviderEmail", String)
    serviceProviderEmail: string = "";
    @JsonProperty("date", String)
    date: string = "";
}

@JsonObject("GetRecordByPeriodRq")
class GetRecordByPeriodRq extends BaseRequest {
    @JsonProperty("employerEmail", String)
    employerEmail: string = "";
    @JsonProperty("serviceProviderEmail", String)
    serviceProviderEmail: string = "";
    @JsonProperty("from", String)
    from: string = "";
    @JsonProperty("to", String)
    to: string = "";
}

@JsonObject("SetRecordRq")
class SetRecordRq extends BaseRequest {
    @JsonProperty("employerEmail", String)
    employerEmail: string = "";
    @JsonProperty("serviceProviderEmail", String)
    serviceProviderEmail: string = "";
    @JsonProperty("recordTime", String)
    recordTime: string = "";
    @JsonProperty("type")
    type: TimeType = TimeType.START_TIME;
}

@JsonObject("UpdateRecordRq") 
class UpdateRecordRq extends BaseRequest {
    @JsonProperty("recordId", Number)
    recordId: number = 0;
    @JsonProperty("recordTime", String)
    recordTime: string = "";
    @JsonProperty("type")
    type: TimeType = TimeType.START_TIME;
}


@JsonObject("Record")
class Record {
    @JsonProperty("id", Number)
    id: number = 0;
    @JsonProperty("start_time", Date)
    startTime: Date = new Date();
    @JsonProperty("end_time", Date)
    endTime: Date = new Date();
}

@JsonObject("GetRecordRs")
class GetRecordRs {
    @JsonProperty("rows", [Record])
    records: Record[] = [];
}

export {GetRecordRq, GetRecordByDateRq, GetRecordByPeriodRq, SetRecordRq, GetRecordRs, TimeType, UpdateRecordRq}