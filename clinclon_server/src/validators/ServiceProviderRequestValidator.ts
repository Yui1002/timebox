import SuperValidator from "./SuperValidator";
import { GetServiceProviderRq, UpdateServiceProviderRq } from "../models/ServiceProvider";
import JSHelperInstance from "../helpers/JsonConverterHelper";
import {isEmail} from 'validator';
import { RateType } from "../helpers/enum";

class GetServiceProviderRequestValidator extends SuperValidator {
    constructor() {
        super(new GetServiceProviderRq());
    }

    validateAndConvertRequest(request: any): GetServiceProviderRq | null {
        this.checkRequestEmpty(request);
        let instance = JSHelperInstance._converter.deserializeObject(request, GetServiceProviderRq);

        if (!isEmail(instance.employerEmail)) {
            this.throwError(null, "Employer email is invalid");
        }

        return instance;
    }
}

class UpdateServiceProviderRequestValidator extends SuperValidator {
    constructor() {
        super(new UpdateServiceProviderRq());
    }

    validateAndConvertRequest(request: any): Partial<UpdateServiceProviderRq> | null {
        this.checkRequestEmpty(request);

        let instance = JSHelperInstance._converter.deserializeObject(request, UpdateServiceProviderRq);
        if (!isEmail(instance.employerEmail) || !isEmail(instance.serviceProviderEmail)) {
            this.throwError(null, 'Email is invalid')
        }

        if (instance.hasOwnProperty("rate") && instance.rate < 0) {
            this.throwError("Rate must be a positive number")
        }

        if (instance.hasOwnProperty('rate_type')) {
            if (instance.rate_type !== RateType.HOURLY && instance.rate_type !== RateType.DAILY) {
                this.throwError("Rate type must be hourly or daily");
            }
        }

        if (instance.hasOwnProperty('schedule')) {
            if (instance.schedule.length < 1) {
                this.throwError("Schedule field must be more than 1 schedule")
            }
        }

        if (!instance.hasOwnProperty('update_by')) {
            this.throwError("Update by property is required")
        }
 
        return instance;
    }
}

export {GetServiceProviderRequestValidator, UpdateServiceProviderRequestValidator};