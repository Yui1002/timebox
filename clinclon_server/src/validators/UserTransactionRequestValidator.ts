import SuperValidator from "./SuperValidator";
import { GetUserTransactionRq, SetUserTransactionRq } from "../models/UserTransaction";
import JSHelperInstance from "../helpers/JsonConverterHelper";
import {isEmail} from 'validator';
import { AllowEdit } from "../helpers/enum";

class GetUserTransactionRequestValidator extends SuperValidator {
    constructor() {
        super(new GetUserTransactionRq());
    }

    validateAndConvertRequest(request: any): GetUserTransactionRq | null {
        this.checkRequestEmpty(request);

        let instance = JSHelperInstance._converter.deserializeObject(request, GetUserTransactionRq);
        if (!isEmail(instance.employerEmail) || !isEmail(instance.serviceProviderEmail)) {
            this.throwError(null, 'Email is invalid')
        }

        return instance;
    }
}

class SetUserTransactionRequestValidator extends SuperValidator {
    constructor() {
        super(new SetUserTransactionRq());
    }

    validateAndConvertRequest(request: any): SetUserTransactionRq | null {
        this.checkRequestEmpty(request);

        let instance = JSHelperInstance._converter.deserializeObject(request, SetUserTransactionRq);
        if (!isEmail(instance.employerEmail) || !isEmail(instance.serviceProviderEmail)) {
            this.throwError(null, 'Email is invalid')
        }
        if (!instance.rate) {
            this.throwError(null, 'Rate is invalid');
        }
        if (!instance.rateType) {
            this.throwError(null, 'Rate type is invalid')
        }
        if (instance.allowEdit !== AllowEdit.True && instance.allowEdit !== AllowEdit.False) {
            this.throwError(null, 'Allow Edit is invalid');
        }

        return instance;
    }
}

export { GetUserTransactionRequestValidator, SetUserTransactionRequestValidator };