import {JsonObject, JsonProperty} from 'json2typescript';
import { BaseRequest, BaseUserRequest} from './BaseRequest';
import { UserStatus } from '../helpers/enum';

@JsonObject("GetUserRq")
class GetUserRq extends BaseRequest {
    @JsonProperty("email", String)
    email: string = "";
}

@JsonObject("GetUserRs")
class GetUserRs {
    @JsonProperty("firstName", String)
    firstName: string;
    @JsonProperty("lastName", String)
    lastName: string;
    @JsonProperty("email", String)
    email: string;

    constructor(userResult: UserRawDB) {
        this.firstName = userResult.first_name
        this.lastName = userResult.last_name
        this.email = userResult.email
    }
}

@JsonObject("SetUserRq")
class SetUserRq extends BaseUserRequest {
    @JsonProperty("firstName", String)
    firstName: string = "";
    @JsonProperty("lastName", String)
    lastName: string = "";
    @JsonProperty("password", String)
    password: string = "";
}

@JsonObject("SignInUserRq")
class SignInUserRq extends BaseUserRequest {
    @JsonProperty("password", String)
    password: string = "";
}

@JsonObject("ResetPasswordRq")
class ResetPasswordRq extends BaseUserRequest {
    @JsonProperty("newPassword", String)
    newPassword: string = '';
}

@JsonObject("UserRawDB")
class UserRawDB extends BaseRequest {
    @JsonProperty("id", Number)
    id: number = 0;

    @JsonProperty("first_name", String)
    first_name: string = "";

    @JsonProperty("last_name", String)
    last_name: string = "";

    @JsonProperty("email_address", String)
    email: string = "";
    @JsonProperty("password", String)
    password: string = "";

    @JsonProperty("status")
    status: UserStatus = UserStatus.ACTIVE;
}

export { GetUserRq, GetUserRs, SetUserRq, SignInUserRq, ResetPasswordRq, UserRawDB }