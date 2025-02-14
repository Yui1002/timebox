import SuperValidator from "./SuperValidator";
import { GetRequestRq, GetRequestByEmailRq, SetRequestRq, UpdateRequestRq, GetRequestByStatusRq } from "../models/Request";
import JSHelperInstance from "../helpers/JsonConverterHelper";
import {isEmail, isFloat, isEmpty} from "validator";
import { RateType, Mode } from "../helpers/enum";

class GetRequestsValidator extends SuperValidator {
    constructor() {
        super(new GetRequestRq());
    }

    validateAndConvertRequest(request: any): GetRequestRq | null {
        this.checkRequestEmpty(request);

        let instance = JSHelperInstance._converter.deserializeObject(request, GetRequestRq);
        if (!isEmail(instance.receiverEmail)) {
            this.throwError(null, 'Email is invalid')
        }

        return instance;
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

    validateAndConvertRequest(request: GetRequestByStatusRq): GetRequestByStatusRq {
        this.checkRequestEmpty(request);
        let instance = JSHelperInstance._converter.deserializeObject(request, GetRequestByStatusRq);

        if (!isEmail(instance.receiverEmail)) {
            this.throwError(null, 'Email is invalid')
        }

        if (isEmpty(instance.status)) {
            this.throwError(null, 'status must not be empty');
        }

        return instance;
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

class UpdateRequestValidator extends SuperValidator {
    constructor() {
        super(new UpdateRequestRq());
    }

    validateAndConvertRequest(request: any): UpdateRequestRq | null {
        this.checkRequestEmpty(request);

        let instance = JSHelperInstance._converter.deserializeObject(request, UpdateRequestRq);
        
        if (!isEmail(instance.senderEmail) || !isEmail(instance.receiverEmail)) {
            this.throwError(null, 'Email is invalid')
        }
        if (instance.status.length == 0) {
            this.throwError(null, "Status must not be empty");
        }

        return instance;
    }
}

export { GetRequestsValidator, GetRequestByEmailValidator, SetRequestValidator, UpdateRequestValidator, GetRequestByStatusQueryValidator as GetRequestByStatuslValidator };