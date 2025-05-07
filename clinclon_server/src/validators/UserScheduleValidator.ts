import SuperValidator from "./SuperValidator";
import JSHelperInstance from "../helpers/JsonConverterHelper";
import {isEmail} from "validator";
import { GetUserScheduleRq, SetUserScheduleRq, UpdateUserScheduleRq, UserSchedule } from "../models/UserSchedule";

class GetUserScheduleRequestValidator extends SuperValidator {
    constructor() {
        super(new GetUserScheduleRq());
    }

    validateAndConvertRequest(request: any): GetUserScheduleRq | null {
        this.checkRequestEmpty(request);
        let instance = JSHelperInstance._converter.deserializeObject(request, GetUserScheduleRq);

        if (!isEmail(instance.employerEmail) || !isEmail(instance.serviceProviderEmail)) {
            this.throwError(null, 'Email is invalid')
        }

        return instance;
    }
}

class SetUserScheduleRequestValidator extends SuperValidator {
    constructor() {
        super(new SetUserScheduleRq());
    }

    validateAndConvertRequest(request: any): SetUserScheduleRq | null {
        this.checkRequestEmpty(request);

        const scheduleConverter = (o: any) => JSHelperInstance._converter.deserializeObject(o, UserSchedule);
        const scheduleInstance: UserSchedule[] = request.schedules.map(scheduleConverter);

        let instance = JSHelperInstance._converter.deserializeObject(request, SetUserScheduleRq)
        instance.schedules = scheduleInstance;

        return instance;
    }
}

class UpdateUserScheduleRequestValidator extends SuperValidator {
    constructor() {
        super(new UpdateUserScheduleRq());
    }

    validateAndConvertRequest(request: any): UpdateUserScheduleRq | null {
        this.checkRequestEmpty(request);

        let instance = JSHelperInstance._converter.deserializeObject(request, UpdateUserScheduleRq);

        if (instance.id && typeof instance.id !== 'number') {
            this.throwError('Id must be a number');
        }

        if (instance.day && typeof instance.day !== 'string') {
            this.throwError('Day must be a string');
        }

        if (instance.start_time && typeof instance.start_time !== 'string') {
            this.throwError('Start time must be a string');
        }

        if (instance.end_time && typeof instance.end_time !== 'string') {
            this.throwError('End time must be a string');
        }

        return instance;

    }
}

export {GetUserScheduleRequestValidator, SetUserScheduleRequestValidator, UpdateUserScheduleRequestValidator};