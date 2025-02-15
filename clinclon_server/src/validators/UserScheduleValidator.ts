import SuperValidator from "./SuperValidator";
import JSHelperInstance from "../helpers/JsonConverterHelper";
import {isEmail} from "validator";
import { GetUserScheduleRq, SetUserScheduleRq, UserSchedule } from "../models/UserSchedule";

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

export {GetUserScheduleRequestValidator, SetUserScheduleRequestValidator};