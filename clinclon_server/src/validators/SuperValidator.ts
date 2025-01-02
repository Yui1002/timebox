import {BaseRequest} from "../models/BaseRequest";
import ResponseException from "../models/ResponseException";

abstract class SuperValidator {
    protected _requestInstance: BaseRequest;
    constructor(requestType: BaseRequest) {
        this._requestInstance = requestType;
    }

    getType(): BaseRequest {
        return this._requestInstance;
    }

    throwError(e: any = null, message: string = "validation error"): void {
        throw new ResponseException(e, e == null ? 400 : 500, message);
    }

    checkRequestEmpty(request: any): void {
        if (!request || Object.keys(request).length == 0) {
            this.throwError();
        }
    }

    abstract validateAndConvertRequest(request: any): any;
}

export default SuperValidator;