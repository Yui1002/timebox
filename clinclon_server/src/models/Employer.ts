import {JsonObject, JsonProperty} from 'json2typescript';
import {BaseRequest} from './BaseRequest';
import { AllowEdit } from '../helpers/enum';

@JsonObject("GetEmployerRq")
class GetEmployerRq extends BaseRequest  {
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
    @JsonProperty("allow_edit")
    allowEdit: AllowEdit = AllowEdit.True;  
}

@JsonObject("GetEmployerRs") 
class GetEmployerRs extends BaseRequest {
    @JsonProperty("rows", [Employer])
    employers: Employer[] = [];
}

export {GetEmployerRq, GetEmployerRs};