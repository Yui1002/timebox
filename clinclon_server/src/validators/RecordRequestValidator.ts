import SuperValidator from "./SuperValidator";
import JSHelperInstance from "../helpers/JsonConverterHelper";
import { GetRecordRq, GetRecordByPeriodRq, SetRecordRq, UpdateRecordRq, DeleteRecordRq, AddRecordRq } from "../models/Record";
import {isEmail, isEmpty} from 'validator';

class GetRecordRequestValidator extends SuperValidator {
    constructor() {
        super(new GetRecordRq());
    };

    validateAndConvertRequest(request: any): GetRecordRq | null {
        this.checkRequestEmpty(request);

        let instance = JSHelperInstance._converter.deserializeObject(request, GetRecordRq);
        if (!isEmail(instance.employerEmail) || !isEmail(instance.serviceProviderEmail)) {
            this.throwError(null, 'Email is invalid')
        }
        return instance;
    }
}

class GetRecordByPeriodRequestValidator extends SuperValidator {
    constructor() {
        super(new GetRecordByPeriodRq());
    };

    validateAndConvertRequest(request: any): GetRecordByPeriodRq | null {
        this.checkRequestEmpty(request);

        let instance = JSHelperInstance._converter.deserializeObject(request, GetRecordByPeriodRq);
        if (!isEmail(instance.employerEmail) || !isEmail(instance.serviceProviderEmail)) {
            this.throwError(null, 'Email is invalid')
        }
        if (!instance.from || !instance.to) {
            this.throwError(null, 'Period must not be empty');
        }

        return instance;
    }
}

class SetRecordRequestValidator extends SuperValidator {
    constructor() {
        super(new SetRecordRq());
    };

    validateAndConvertRequest(request: any): SetRecordRq | null {
        this.checkRequestEmpty(request);

        let instance = JSHelperInstance._converter.deserializeObject(request, SetRecordRq);
        if (!isEmail(instance.employerEmail) || !isEmail(instance.serviceProviderEmail)) {
            this.throwError(null, 'Email is invalid')
        }
        if (!instance.recordTime) {
            this.throwError(null, 'Record time must not be empty');
        }
        if (!instance.type) {
            this.throwError(null, 'Type must not be empty');
        }

        return instance;
    }
}

class AddRecordRequestValidator extends SuperValidator {
    constructor() {
        super(new AddRecordRq());
    };

    validateAndConvertRequest(request: any): AddRecordRq | null {
        this.checkRequestEmpty(request);

        let instance = JSHelperInstance._converter.deserializeObject(request, AddRecordRq);
        if (!isEmail(instance.employerEmail) || !isEmail(instance.serviceProviderEmail)) {
            this.throwError(null, 'Email is invalid')
        }
        if (!instance.updateBy) {
            this.throwError(null, 'Update by must not be empty');
        }
        if (!instance.startTime) {
            this.throwError(null, 'Start time must not be empty');
        }
        if (!instance.endTime) {
            this.throwError(null, 'End time must not be empty');
        }
        return instance;
    }
}

class UpdateRecordRequestValidator extends SuperValidator {
    constructor() {
        super(new UpdateRecordRq());
    };

    validateAndConvertRequest(request: any): UpdateRecordRq | null {
        this.checkRequestEmpty(request);

        let instance = JSHelperInstance._converter.deserializeObject(request, UpdateRecordRq);
        if (!instance.recordId) {
            this.throwError(null, 'Record ID must not be empty')
        }
        if (!instance.startTime) {
            this.throwError(null, 'Start time must not be empty');
        }
        if (!instance.endTime) {
            this.throwError(null, 'End time must not be empty');
        }
        if (!instance.updatedBy || !instance.updatedBy.length) {
            this.throwError(null, 'Updated by must not be empty')
        }

        return instance;
    }
}

class DeleteRecordRequestValidator extends SuperValidator {
    constructor() {
        super(new DeleteRecordRq());
    };

    validateAndConvertRequest(request: any): DeleteRecordRq | null {
        this.checkRequestEmpty(request);

        let instance = JSHelperInstance._converter.deserializeObject(request, DeleteRecordRq);
        if (!instance.recordId) {
            this.throwError(null, 'Record ID must not be empty')
        }

        return instance;
    }
}

export { GetRecordRequestValidator, GetRecordByPeriodRequestValidator, SetRecordRequestValidator, UpdateRecordRequestValidator, DeleteRecordRequestValidator, AddRecordRequestValidator }