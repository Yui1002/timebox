import {JsonObject, JsonProperty} from 'json2typescript';
import {BaseRequest} from './BaseRequest';
import { RateType, RequestStatus, Mode } from '../helpers/enum';
import { GetUserScheduleRs } from './UserSchedule';

@JsonObject("GetRequestRq")
class GetRequestRq extends BaseRequest { 
    @JsonProperty("receiverEmail", String)
    receiverEmail: string = "";
}

@JsonObject("GetRequestByEmailRq")
class GetRequestByEmailRq extends BaseRequest { 
    @JsonProperty("senderEmail", String)
    senderEmail: string = "";
    @JsonProperty("receiverEmail", String)
    receiverEmail: string = "";
}

@JsonObject("GetRequestByStatusRq")
class GetRequestByStatusRq extends BaseRequest { 
    @JsonProperty("receiverEmail", String)
    receiverEmail: string = "";
    @JsonProperty("status", RequestStatus)
    status: RequestStatus = RequestStatus.PENDING;
}

@JsonObject("SetRequestRq")
class SetRequestRq extends BaseRequest {
    @JsonProperty("senderEmail", String)
    senderEmail: string = "";
    @JsonProperty("receiverEmail", String)
    receiverEmail: string = "";
    @JsonProperty("rate", Number)
    rate: number = 0;
    @JsonProperty("rateType")
    rateType: RateType = RateType.HOURLY;
    @JsonProperty('schedules', [GetUserScheduleRs])
    schedules: GetUserScheduleRs[] = []
    @JsonProperty("mode")
    mode: Mode = Mode.False;
}

@JsonObject("UpdateRequestStatusRq")
class UpdateRequestStatusRq extends BaseRequest {
    @JsonProperty("senderEmail", String)
    senderEmail: string = "";
    @JsonProperty("receiverEmail", String)
    receiverEmail: string = "";
    @JsonProperty("status")
    status: RequestStatus = RequestStatus.PENDING;
}

@JsonObject("Request")
class Request {
    @JsonProperty("id", Number)
    id: number = 0;
    @JsonProperty("sender_first_name", String)
    senderFirstName: string = "";
    
    @JsonProperty("sender_last_name", String)
    senderLastName: string = "";
    @JsonProperty("sender_email", String)
    senderEmail: string = "";

    @JsonProperty("receiver_email", String)
    receiverEmail: string = "";

    @JsonProperty("status")
    status: RequestStatus = RequestStatus.PENDING; 

    @JsonProperty("rate", String)
    rate: string = '0';

    @JsonProperty("rate_type")
    rateType: RateType = RateType.HOURLY;

    @JsonProperty("day", String)
    day: string = "";

    @JsonProperty("start_time", String)
    startTime: string = "";

    @JsonProperty("end_time", String)
    endTime: string = "";
    schedules: GetUserScheduleRs[] = []

    @JsonProperty("allow_edit")
    allowEdit: boolean = true;
    @JsonProperty("request_date", Date)
    requestDate: Date = new Date();
}

@JsonObject("GetRequestRs")
class GetRequestRs {
    @JsonProperty("rows", [Request])
    requests: Request[] = [];
}

export { GetRequestByEmailRq, GetRequestByStatusRq, GetRequestRq, GetRequestRs, SetRequestRq, UpdateRequestStatusRq };