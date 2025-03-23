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
    @JsonProperty("dateInEpoch", Number)
    dateInEpoch: number = 0;
}

@JsonObject("GetRecordByPeriodRq")
class GetRecordByPeriodRq extends BaseRequest {
    @JsonProperty("employerEmail", String)
    employerEmail: string = "";
    @JsonProperty("serviceProviderEmail", String)
    serviceProviderEmail: string = "";
    @JsonProperty("from", Number)
    from: number = 0;
    @JsonProperty("to", Number)
    to: number = 0;
}

@JsonObject("SetRecordRq")
class SetRecordRq extends BaseRequest {
    @JsonProperty("id", Number)
    id?: number = 0;
    @JsonProperty("employerEmail", String)
    employerEmail: string = "";
    @JsonProperty("serviceProviderEmail", String)
    serviceProviderEmail: string = "";
    @JsonProperty("recordTime", Number)
    recordTime: number = 0;
    @JsonProperty("type")
    type: TimeType = TimeType.START_TIME;
}

@JsonObject("UpdateRecordRq") 
class UpdateRecordRq extends BaseRequest {
    @JsonProperty("recordId", Number)
    recordId: number = 0;
    @JsonProperty("recordTime", Number)
    recordTime: number = 0;
    @JsonProperty("type")
    type: TimeType = TimeType.START_TIME;
}

@JsonObject("DeleteRecordRq") 
class DeleteRecordRq extends BaseRequest {
    @JsonProperty("recordId", Number)
    recordId: number = 0;
}

@JsonObject("Record")
class Record {
    @JsonProperty("id", Number)
    id: number = 0;
    @JsonProperty("epoch_start_time", String)
    epoch_start_time: number = 0;
    @JsonProperty("epoch_start_time", String)
    epoch_end_time: number = 0;
}

@JsonObject("RecordChange")
class RecordChange {
    @JsonProperty("start_time", Date)
    startTime: Date = new Date();
    @JsonProperty("end_time", Date)
    endTime: Date = new Date();
    @JsonProperty("changed_on", Date)
    changedOn: Date = new Date();
    @JsonProperty("updated_by", String)
    updatedBy: string = '';
}

@JsonObject("GetRecordRs")
class GetRecordRs {
    @JsonProperty("rows", [Record])
    records: Record[] = [];
}

@JsonObject("GetRecordChangeRs")
class GetRecordChangeRs {
    @JsonProperty("rows", [RecordChange])
    records: RecordChange[] = [];
}



export {GetRecordRq, GetRecordByDateRq, GetRecordByPeriodRq, SetRecordRq, GetRecordRs, TimeType, UpdateRecordRq, DeleteRecordRq, GetRecordChangeRs}