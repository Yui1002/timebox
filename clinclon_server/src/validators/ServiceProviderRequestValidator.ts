import SuperValidator from "./SuperValidator";
import { GetServiceProviderRq, UpdateServiceProviderRq } from "../models/ServiceProvider";
import JSHelperInstance from "../helpers/JsonConverterHelper";
import {isEmail} from 'validator';

class GetServiceProviderRequestValidator extends SuperValidator {
    constructor() {
        super(new GetServiceProviderRq());
    }

    validateAndConvertRequest(employerEmail: string): string {
        this.checkRequestEmpty(employerEmail);

        if (!isEmail(employerEmail)) {
            this.throwError(null, "Employer email is invalid");
        }

        return employerEmail;
    }
}

class UpdateServiceProviderRequestValidator extends SuperValidator {
    constructor() {
        super(new UpdateServiceProviderRq());
    }

    validateAndConvertRequest(request: any): UpdateServiceProviderRq | null {
        this.checkRequestEmpty(request);

        let instance = JSHelperInstance._converter.deserializeObject(request, UpdateServiceProviderRq);
        if (!isEmail(instance.employerEmail) || !isEmail(instance.serviceProviderEmail)) {
            this.throwError(null, 'Email is invalid')
        }

        return instance;
    }
}

export {GetServiceProviderRequestValidator, UpdateServiceProviderRequestValidator};