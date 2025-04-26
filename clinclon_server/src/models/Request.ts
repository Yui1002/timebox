import {JsonObject, JsonProperty} from 'json2typescript';
import {BaseRequest} from './BaseRequest';
import { RateType, RequestStatus, Mode } from '../helpers/enum';
import { UserSchedule } from './UserSchedule';

@JsonObject("RequestRawDB")
class RequestRawDB extends BaseRequest {
    @JsonProperty("id", Number)
    id: number = 0;
    @JsonProperty("sender_first_name", String)
    senderFirstName: string = '';
    @JsonProperty("sender_last_name", String)
    senderLastName: string = '';
    @JsonProperty('sender_email', String)
    senderEmail: string = '';
    @JsonProperty('receiver_email', String)
    receiverEmail: string = '';
    @JsonProperty("status", String)
    status: RequestStatus = RequestStatus.PENDING;
    @JsonProperty("rate", String)
    rate: string = "0";
    @JsonProperty("rate_type")
    rateType: RateType = RateType.HOURLY;
    @JsonProperty("request_date", Date)
    requestDate: Date = new Date();
    @JsonProperty("day", String)
    day: string = "";

    @JsonProperty("start_time", String)
    startTime: string = "";

    @JsonProperty("end_time", String)
    endTime: string = "";
    @JsonProperty("allow_edit")
    allowEdit: Mode = Mode.False;
}

@JsonObject("GetRequestRsMini")  
class GetRequestRsMini {
    @JsonProperty("firstName", String)
    firstName: string = "";
    @JsonProperty("lastName", String)
    lastName: string = "";
    @JsonProperty("email", String)
    email: string = "";
    @JsonProperty("rate", String)
    rate: string = "0";
    @JsonProperty("rateType")
    rateType: RateType = RateType.HOURLY;
    @JsonProperty("day", String)
    day: string = "";

    @JsonProperty("start_time", String)
    startTime: string = "";

    @JsonProperty("end_time", String)
    endTime: string = "";
    @JsonProperty("allow_edit")
    allowEdit: Mode = Mode.False;
    @JsonProperty("schedules")
    schedules?: any;
    @JsonProperty("requestDate", Date)
    requestDate: Date = new Date();

    constructor(requestResult: RequestRawDB) {
        this.firstName = requestResult.senderFirstName;
        this.lastName = requestResult.senderLastName;
        this.email = requestResult.senderEmail;
        this.rate = requestResult.rate;
        this.rateType = requestResult.rateType;
        this.day = requestResult.day;
        this.startTime = requestResult.startTime;
        this.endTime = requestResult.endTime;
        this.allowEdit = requestResult.allowEdit;
        this.schedules = [];
        this.requestDate = requestResult.requestDate;
    }
}


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
    @JsonProperty("status")
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
    rateType: RateType = RateType.UNSPECIFIED;
    @JsonProperty('schedules')
    schedules: UserSchedule[] = []
    @JsonProperty("mode")
    mode: Mode = Mode.False;
}


@JsonObject("UpdateRequestRq")
class UpdateRequestRq extends BaseRequest {
    @JsonProperty("senderEmail", String)
    senderEmail: string = "";
    @JsonProperty("receiverEmail", String)
    receiverEmail: string = "";
    @JsonProperty("status")
    status: RequestStatus = RequestStatus.PENDING;
    @JsonProperty("rate", String)
    rate?: string = '';
    @JsonProperty("rateType")
    rateType?: RateType = RateType.HOURLY;
    @JsonProperty("schedules")
    schedules?: UserSchedule[] = [];
    @JsonProperty("mode")
    mode: Mode = Mode.False;
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

    @JsonProperty("rate", Number)
    rate: number = 0;

    @JsonProperty("rate_type")
    rateType: RateType = RateType.HOURLY;

    @JsonProperty("day", String)
    day: string = "";

    @JsonProperty("start_time", String)
    startTime: string = "";

    @JsonProperty("end_time", String)
    endTime: string = "";
    schedules?: UserSchedule[] = []

    @JsonProperty("allow_edit")
    allowEdit: Mode = Mode.False;
    @JsonProperty("request_date", Date)
    requestDate: Date = new Date();
}

@JsonObject("GetRequestRs")
class GetRequestRs {
    @JsonProperty("rows", [RequestRawDB])
    requests: RequestRawDB[] = [];
}

export { GetRequestRsMini, RequestRawDB, GetRequestByEmailRq, GetRequestByStatusRq, GetRequestRq, GetRequestRs, SetRequestRq, UpdateRequestRq };