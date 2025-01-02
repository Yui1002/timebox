import SuperValidator from "./SuperValidator";
import { GetEmployerRq } from "../models/Employer";
import JSHelperInstance from "../helpers/JsonConverterHelper";
import {isEmail} from 'validator';

class GetEmployerRequestValidator extends SuperValidator {
    constructor() {
        super(new GetEmployerRq());
    }

    validateAndConvertRequest(request: any): GetEmployerRq | null {
        this.checkRequestEmpty(request);

        let instance = JSHelperInstance._converter.deserializeObject(request, GetEmployerRq);
        if (!isEmail(instance.email)) {
            this.throwError(null, "Email is invalid")
        }
        
        return instance;
    }
}


export {GetEmployerRequestValidator};