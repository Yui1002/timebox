import Validator from "../validators/Validator";

import { UserController } from "../controllers/UserController";
import {OTPController} from "../controllers/OTPController";
import {ServiceProviderController} from "../controllers/ServiceProviderController";
import { EmployerController } from "../controllers/EmployerController";
import {RecordController} from "../controllers/RecordController";
import {UserTransactionController} from "../controllers/UserTransactionController";
import {RequestController} from "../controllers/RequestController";

import { GetServiceProviderRequestValidator, UpdateServiceProviderRequestValidator } from '../validators/ServiceProviderRequestValidator';
import { GetUserRequestValidator, SetUserRequestValidator, SignInUserRequestValidator, ResetPasswordRequestValidator, GetUserByIdRequestValidator } from "../validators/UserRequestValidator";
import { GetOTPRequestValidator, SetOTPRequestValidator } from "../validators/OTPRequestValidator";
import { GetEmployerRequestValidator } from "../validators/EmployerRequestValidator";
import { GetRecordRequestValidator, GetRecordByPeriodRequestValidator, SetRecordRequestValidator } from "../validators/RecordRequestValidator";
import { GetUserTransactionRequestValidator } from "../validators/UserTransactionRequestValidator";
import { GetRequestsValidator, GetRequestByEmailValidator, SetRequestValidator, UpdateRequestValidator, GetRequestByStatuslValidator } from "../validators/RequestValidator";

interface IRoutes {
    applyRouting(app: any): void;
}

class Routes implements IRoutes  {
    private _userController: UserController;
    private _otpController: OTPController;
    private _serviceProviderController: ServiceProviderController;
    private _employerController: EmployerController;
    private _recordController: RecordController;
    private _userTransactionController: UserTransactionController;
    private _requestController: RequestController;
    private _validator: Validator;


    constructor() {
        this._userController = new UserController();
        this._otpController = new OTPController();
        this._serviceProviderController = new ServiceProviderController();
        this._employerController = new EmployerController();
        this._recordController = new RecordController();
        this._userTransactionController = new UserTransactionController();
        this._requestController = new RequestController();
        this.initializeValidator();
    }

    private initializeValidator() {
        this._validator = Validator.Instance;
        this._validator.addValidators([
            new GetUserRequestValidator(),
            new GetUserByIdRequestValidator(),
            new SetUserRequestValidator(),
            new SignInUserRequestValidator(),
            new ResetPasswordRequestValidator(),
            new GetOTPRequestValidator(),
            new SetOTPRequestValidator(),
            new GetServiceProviderRequestValidator(),
            new UpdateServiceProviderRequestValidator(),
            new GetEmployerRequestValidator(),
            new GetRecordRequestValidator(),
            new GetRecordByPeriodRequestValidator(),
            new SetRecordRequestValidator(),
            new GetUserTransactionRequestValidator(),
            new GetRequestsValidator(),
            new GetRequestByEmailValidator(),
            new SetRequestValidator(),
            new UpdateRequestValidator(),
            new GetRequestByStatuslValidator()
        ])
    }

    applyRouting(app: any) {
        app.post('/getUser', this._userController.getUser.bind(this._userController));
        app.get('/getUserById', this._userController.getUserById.bind(this._userController));
        app.post('/setUser', this._userController.setUser.bind(this._userController));
        app.post('/signInUser', this._userController.signInUser.bind(this._userController));
        app.post('/resetPassword', this._userController.resetPassword.bind(this._userController));

        app.post('/setOTP', this._otpController.setOTP.bind(this._otpController));
        app.post('/verifyOTP', this._otpController.verifyOTP.bind(this._otpController));

        app.post('/getUserTransaction', this._userTransactionController.getUserTransaction.bind(this._userTransactionController));

        app.post('/getServiceProvider', this._serviceProviderController.getServiceProvider.bind(this._serviceProviderController));
        app.post('/updateServiceProvider', this._serviceProviderController.updateServiceProvider.bind(this._serviceProviderController)); 

        app.post('/getEmployer', this._employerController.getEmployer.bind(this._employerController));

        app.post('/getRecordAll', this._recordController.getRecord.bind(this._recordController));
        app.post('/getRecordByPeriod', this._recordController.getRecordByPeriod.bind(this._recordController));
        app.post('/setRecord', this._recordController.setRecord.bind(this._recordController));

        app.post('/getRequests', this._requestController.getRequests.bind(this._requestController));
        app.post('/getRequestByEmail', this._requestController.getRequestByEmail.bind(this._requestController));
        app.post('/setRequest', this._requestController.setRequest.bind(this._recordController));
        app.post('/updateRequest', this._requestController.updateRequest.bind(this._requestController));
    }
}

export default Routes;