import {JsonObject, JsonProperty} from 'json2typescript';
import {BaseRequest} from './BaseRequest';

@JsonObject("GetOTPRq")
class GetOTPRq extends BaseRequest {
    @JsonProperty("email", String)
    email: string = "";
}

@JsonObject("GetOTPRs")
class GetOTPRs {
    @JsonProperty("id", Number)
    id: number;
    @JsonProperty("otp", String)
    otp: string;
    @JsonProperty("email_address", String)
    email: string;
    @JsonProperty('create_date', Date)
    createDate: Date;

    constructor(OTPResult: OTPRawDB) {
        this.id = OTPResult.id;
        this.otp = OTPResult.otp;
        this.email = OTPResult.email;
        this.createDate = OTPResult.createDate;
    }
}

@JsonObject("SetOTPRq")
class SetOTPRq extends BaseRequest {
    @JsonProperty("email", String)
    email: string = "";
    @JsonProperty("otp", String)
    otp: string = "";
}

@JsonObject("OTPRawDB")
class OTPRawDB extends BaseRequest {
    @JsonProperty("id", Number)
    id: number = 0;
    @JsonProperty("otp", String)
    otp: string = "";
    @JsonProperty("email_address", String)
    email: string = "";
    @JsonProperty("create_date", Date)
    createDate: Date = new Date();
}



export {GetOTPRq, GetOTPRs, SetOTPRq, OTPRawDB }