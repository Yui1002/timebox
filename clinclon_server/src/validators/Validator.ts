import {BaseRequest} from "../models/BaseRequest";
import ResponseException from "../models/ResponseException";
import SuperValidator from "./SuperValidator";

//SINGLETON CLASS
class Validator {
    private static _instance: Validator
    private _validators: SuperValidator[];
    
    private constructor() {
        this._validators = [];
    }
    addValidators(validators: SuperValidator[]) {
        this._validators.push(...validators); 
    }

    /**
     * Validate and return object of type T if valid
     *  The right validator is selected based on the the type T passed in
     * If no validator matches the request, 
     *  an exception will be thrown since we cannot convert the json object to class
     * If the validation fails, an exception will be thrown
     * 
     * @param request raw json object
     * @param objectType instance of type T
     * @returns object of type T (specified by caller)
     */
    // validateBody<T extends BaseRequest>(request: any, objectType: T): T {
    //     let selectedValidators = this._validators.filter(x => x.getType().getInstanceName() === objectType.getInstanceName());
    //     if (selectedValidators.length != 1) {
    //         throw new ResponseException(null, 500, "Unable to parse validators");
    //     }
    //     let validator = selectedValidators[0];
    //     if (!request)
    //         return validator.validateAndConvertRequest(objectType);
    //     return validator.validateAndConvertRequest(request)
    // }

    validateBody(request: any, instanceName: string): any {
        let selectedValidators = this._validators.filter(x => x.getType().getInstanceName() === instanceName);
        if (selectedValidators.length != 1) {
            throw new ResponseException(null, 500, "Unable to parse validators");
        }
        let validator = selectedValidators[0];

        return validator.validateAndConvertRequest(request)
    }


    public static get Instance() {
        return this._instance || (this._instance = new this());
    }
}


export default Validator;