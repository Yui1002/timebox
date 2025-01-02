import SuperValidator from "./SuperValidator";
import { GetRequestRq, GetRequestByEmailRq, SetRequestRq, UpdateRequestStatusRq, GetRequestByStatusRq } from "../models/Request";
import JSHelperInstance from "../helpers/JsonConverterHelper";
import {isEmail, isFloat, isEmpty} from "validator";
import { RateType, Mode } from "../helpers/enum";

class GetRequestsValidator extends SuperValidator {
    constructor() {
        super(new GetRequestRq());
    }

    validateAndConvertRequest(receiverEmail: string): string | null {
        this.checkRequestEmpty(receiverEmail);

        if (!isEmail(receiverEmail)) {
            this.throwError(null, "Receiver email is invalid");
        }

        return receiverEmail
    }
}

class GetRequestByEmailValidator extends SuperValidator {
    constructor() {
        super(new GetRequestByEmailRq());
    }

    validateAndConvertRequest(request: any): GetRequestByEmailRq | null {
        this.checkRequestEmpty(request);

        let instance = JSHelperInstance._converter.deserializeObject(request, GetRequestByEmailRq);
        if (!isEmail(instance.senderEmail) || !isEmail(instance.receiverEmail)) {
            this.throwError(null, 'Email is invalid')
        }

        return instance;
    }
}

class GetRequestByStatusQueryValidator extends SuperValidator {
    constructor() {
        super(new GetRequestByStatusRq());
    }

    // implement
    validateAndConvertRequest(request: any): any {
        this.throwError(null, "method not implemented exception");
    }

    // override
    validateAndConvertQuery(request: GetRequestByStatusRq): GetRequestByStatusRq {
        this.checkRequestEmpty(request);

        if (!isEmail(request.receiverEmail)) {
            this.throwError(null, 'Email is invalid')
        }

        if (isEmpty(request.status)) {
            this.throwError(null, 'status must not be empty');
        }

        return request;
    }
}

class SetRequestValidator extends SuperValidator {
    constructor() {
        super(new SetRequestRq());
    }

    validateAndConvertRequest(request: any): SetRequestRq | null {
        this.checkRequestEmpty(request);

        let instance = JSHelperInstance._converter.deserializeObject(request, SetRequestRq);

        if (!isEmail(instance.senderEmail) || !isEmail(instance.receiverEmail)) {
            this.throwError(null, 'Email is invalid')
        }
        if (!instance.rate || !isFloat(instance.rate.toString(), {
            min: 1.00,
            max: 3000.00
        })) {
            this.throwError(null, "Rate is invalid");
        }
        if (instance.rateType !== RateType.DAILY && instance.rateType !== RateType.HOURLY) {
            this.throwError(null, "Rate type is invalid");
        }
        if (instance.mode !== Mode.True && instance.mode !== Mode.False) {
            this.throwError(null, "Mode is invalid");
        } 

        return instance;
    }
}

class UpdateRequestStatusValidator extends SuperValidator {
    constructor() {
        super(new UpdateRequestStatusRq());
    }

    validateAndConvertRequest(request: any): UpdateRequestStatusRq | null {
        this.checkRequestEmpty(request);

        let instance = JSHelperInstance._converter.deserializeObject(request, UpdateRequestStatusRq);
        
        if (!isEmail(instance.senderEmail) || !isEmail(instance.receiverEmail)) {
            this.throwError(null, 'Email is invalid')
        }
        if (instance.status.length == 0) {
            this.throwError(null, "Status must not be empty");
        }

        return instance;
    }
}

export { GetRequestsValidator, GetRequestByEmailValidator, SetRequestValidator, UpdateRequestStatusValidator, GetRequestByStatusQueryValidator as GetRequestByStatuslValidator };