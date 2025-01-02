import { JsonObject, JsonProperty } from "json2typescript";

class BaseRequest {
    private _instanceName: string;
    constructor() {
        this._instanceName = this.constructor.name;
    }

    getInstanceName() {
        return this._instanceName;
    }
}

@JsonObject("UserBaseRq")
class BaseUserRequest extends BaseRequest {
    @JsonProperty("email", String)
    email: string = "";
}

export { BaseRequest, BaseUserRequest};