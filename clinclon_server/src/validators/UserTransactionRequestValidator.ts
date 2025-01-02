import SuperValidator from "./SuperValidator";
import { GetUserTransactionRq } from "../models/UserTransaction";
import JSHelperInstance from "../helpers/JsonConverterHelper";
import {isEmail} from 'validator';

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

export { GetUserTransactionRequestValidator };