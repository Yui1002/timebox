import {JsonObject, JsonProperty} from 'json2typescript';
import {BaseRequest} from './BaseRequest';
import { Mode } from '../helpers/enum';

@JsonObject("GetEmployerRq")
class GetEmployerRq extends BaseRequest {
    @JsonProperty("email", String)
    email: string = "";
}

@JsonObject("Employer")
class Employer {
    @JsonProperty("first_name", String)
    firstName: string = "";

    @JsonProperty("last_name", String)
    lastName: string = "";

    @JsonProperty("email_address", String)
    email: string = "";
    @JsonProperty("mode")
    mode: Mode = Mode.True;  
}

@JsonObject("GetEmployerRs") 
class GetEmployerRs extends BaseRequest {
    @JsonProperty("rows", [Employer])
    employers: Employer[] = [];
}

export {GetEmployerRq, GetEmployerRs};