import {OTPController} from "../../controllers/OTPController";
import OTPManager from "../../managers/OTPManager";
import Validator from "../../validators/Validator";
import TestResponse from "./testResponse";
import { GetOTPRq, GetOTPRs, OTPRawDB, SetOTPRq } from "../../models/OTP";
import {BaseRequest} from "../../models/BaseRequest";

let controller = new OTPController();
let mockRes: TestResponse;
let mockNext: any;

let getRequest: any;
let verifyRequest: any;
let handleRequest: any;

describe("test get otp", () => {
    beforeEach(() => {
        mockRes = new TestResponse();
        mockNext = jest.fn();
        getRequest = {
            body: {
                email: 'test@gmail.com'
            }
        };
    });

    test("should get otp", async () => {
        // let otp = new OTPRawDB();

        // jest.spyOn(Validator.prototype, 'validate').mockImplementation((req: any, objectType: BaseRequest) => {
        //     return new GetOTPRq();
        // })

        // jest.spyOn(OTPManager.prototype, 'getOTP').mockImplementation((otpRq: GetOTPRq) => {
        //     return Promise.resolve(otp);
        // });

        // await controller.getOTP(getRequest, mockRes, mockNext);
        // expect(mockRes.getStatus()).toBe(200);
        // expect(mockRes.getData()).toStrictEqual(otp);
    });

    test("should throw an exception", async () => {
        // jest.spyOn(OTPManager.prototype, 'getOTP').mockImplementationOnce((otpRq: GetOTPRq) => {
        //     throw 'error';
        // });
        // await controller.getOTP(getRequest, mockRes, mockNext);
        // expect(mockNext).toHaveBeenCalledTimes(1);
        // expect(mockNext).toHaveBeenLastCalledWith('error');
    })
});

describe("test verify OTP", () => {
    beforeEach(() => {
        mockRes = new TestResponse();
        mockNext = jest.fn();
        verifyRequest = {
            body: {
                email: "test@gmail.com",
                otp: '123456'
            }
        };
    });

    test("should verify otp", async () => {
        // jest.spyOn(Validator.prototype, 'validate').mockImplementationOnce((req: any, objectType: BaseRequest) => {
        //     return new SetOTPRq();
        // });
        // jest.spyOn(OTPManager.prototype, 'verifyOTP').mockImplementation((otpRq: SetOTPRq) => {
        //     return Promise.resolve();
        // });
        // await controller.verifyOTP(verifyRequest, mockRes, mockNext);
        // expect(mockRes.getStatus()).toBe(200);
    });

    test("should throw an exception", async () => {
        // jest.spyOn(OTPManager.prototype, 'verifyOTP').mockImplementationOnce((otpRq: SetOTPRq) => {
        //     throw 'error';
        // });

        // await controller.verifyOTP(verifyRequest, mockRes, mockNext);
        // expect(mockNext).toHaveBeenCalledTimes(1);
        // expect(mockNext).toHaveBeenLastCalledWith('error');
    });
});