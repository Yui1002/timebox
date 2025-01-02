import SuperValidator from "./SuperValidator";
import { GetOTPRq, SetOTPRq } from "../models/OTP";
import JSHelperInstance from "../helpers/JsonConverterHelper";
import {isEmail} from 'validator';

class GetOTPRequestValidator extends SuperValidator {
    constructor() {
        super(new GetOTPRq());
    }

    validateAndConvertRequest(request: any): GetOTPRq | null {
        this.checkRequestEmpty(request);

        let instance = JSHelperInstance._converter.deserializeObject(request, GetOTPRq);
        if (!isEmail(instance.email)) {
            this.throwError(null, "Email is invalid")
        }

        return instance;
    }
}

class SetOTPRequestValidator extends SuperValidator {
    constructor() {
        super(new SetOTPRq());
    }

    validateAndConvertRequest(request: any): SetOTPRq | null {
        this.checkRequestEmpty(request);

        let instance = JSHelperInstance._converter.deserializeObject(request, SetOTPRq);
        if (!isEmail(instance.email)) {
            this.throwError(null, "Email is invalid")
        }

        return instance;
    }
}

export { GetOTPRequestValidator, SetOTPRequestValidator };