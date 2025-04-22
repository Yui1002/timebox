import SuperValidator from "./SuperValidator";
import { GetUserRq, SetUserRq, SignInUserRq, ResetPasswordRq } from "../models/User";
import JSHelperInstance from "../helpers/JsonConverterHelper";
import {isEmail, isEmpty, isStrongPassword} from "validator";
import { PASSWORD_RULES } from '../config'

class GetUserRequestValidator extends SuperValidator {
    constructor() {
        super(new GetUserRq());
    }

    validateAndConvertRequest(request: any): GetUserRq | null {
        this.checkRequestEmpty(request);
        let instance = JSHelperInstance._converter.deserializeObject(request, GetUserRq);

        if (!isEmail(instance.email)) {
            this.throwError(null, 'Email is invalid')
        }

        return instance;
    }
}

class SetUserRequestValidator extends SuperValidator {
    constructor() {
        super(new SetUserRq());
    }

    validateAndConvertRequest(request: any): SetUserRq | null {
        this.checkRequestEmpty(request);

        let instance = JSHelperInstance._converter.deserializeObject(request, SetUserRq);
        if (!instance.firstName || !instance.lastName) {
            this.throwError(null, "Name is required")
        }
        if (!isEmail(instance.email)) {
            this.throwError(null, 'Email is invalid')
        }
        if (!isStrongPassword(instance.password, PASSWORD_RULES)) {
            this.throwError(null, 'Password must contain 8 characters, 1 number, 1 upper, 1 lower')
        }

        return instance;
    }
}

class SignInUserRequestValidator extends SuperValidator {
    constructor() {
        super(new SignInUserRq());
    }

    validateAndConvertRequest(request: any): SignInUserRq | null {
        this.checkRequestEmpty(request);

        let instance = JSHelperInstance._converter.deserializeObject(request, SignInUserRq);
        if (!isEmail(instance.email)) {
            this.throwError(null, 'Email is invalid')
        }
        if (!isStrongPassword(instance.password, PASSWORD_RULES)) {
            this.throwError(null, 'Password must contain 8 characters, 1 number, 1 upper, 1 lower')
        }

        return instance;
    }
}

class ResetPasswordRequestValidator extends SuperValidator {
    constructor() {
        super(new ResetPasswordRq());
    }

    validateAndConvertRequest(request: any): ResetPasswordRq | null {
        this.checkRequestEmpty(request);

        let instance = JSHelperInstance._converter.deserializeObject(request, ResetPasswordRq);
        if (!isEmail(instance.email)) {
            this.throwError(null, 'Email is invalid')
        }
        if (!isStrongPassword(instance.newPassword, PASSWORD_RULES)) {
            this.throwError(null, 'Password must contain 8 characters, 1 number, 1 upper, 1 lower')
        }

        return instance;
    }
}

export {GetUserRequestValidator, SetUserRequestValidator, SignInUserRequestValidator, ResetPasswordRequestValidator};