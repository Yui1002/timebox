import {JsonObject, JsonProperty} from 'json2typescript';
import {BaseRequest} from './BaseRequest';
import { Mode, RateType, UserStatus } from '../helpers/enum';

@JsonObject("GetUserTransactionRq")
class GetUserTransactionRq extends BaseRequest {
    @JsonProperty("employerEmail", String)
    employerEmail: string = "";
    @JsonProperty("serviceProviderEmail", String)
    serviceProviderEmail: string = "";
}

@JsonObject("GetUserTransactionRs")
class GetUserTransactionRs {
    @JsonProperty("id", Number)
    id: number = 0;
    @JsonProperty("rate", String)
    rate: string = '';
    @JsonProperty("rate_type", String)
    rateType: string = 'hourly';
    @JsonProperty("status")
    status: UserStatus = UserStatus.ACTIVE;
    @JsonProperty("mode")
    mode: Mode = Mode.True;
}

@JsonObject("SetUserTransactionRq")
class SetUserTransactionRq extends BaseRequest {
    @JsonProperty("rate", String)
    rate: string = '';
    @JsonProperty("rateType")
    rateType: RateType = RateType.HOURLY;
    @JsonProperty("employerEmail", String)
    employerEmail: string = '';
    @JsonProperty("serviceProviderEmail", String)
    serviceProviderEmail: string = '';
    @JsonProperty("status")
    status: UserStatus = UserStatus.ACTIVE;
    @JsonProperty("mode")
    mode: Mode = Mode.True;

}

@JsonObject("UpdateUserTransactionRq")
class UpdateUserTransactionRq {
    @JsonProperty("employerEmail", String)
    employerEmail: string = "";
    @JsonProperty("serviceProviderEmail", String)
    serviceProviderEmail: string = "";
    @JsonProperty('rate', Number)
    rate: number = 0;
    @JsonProperty('rateType', String)
    rateType: string = "";
}

export { GetUserTransactionRq, GetUserTransactionRs, UpdateUserTransactionRq, SetUserTransactionRq }