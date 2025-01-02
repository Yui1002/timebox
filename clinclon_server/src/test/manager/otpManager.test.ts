import OTPManager from "../../managers/OTPManager";
import OTPRepo from "../../repositories/OTPRepo";
import ResponseException from "../../models/ResponseException";
import { GetOTPRq, OTPRawDB, SetOTPRq } from "../../models/OTP";
import { createTransport } from "nodemailer";
import Mailer from 'nodemailer/lib/mailer';

let manager = new OTPManager();

describe("test get OTP", () => {
    // test("test get OTP", async () => {
    //     let req = new GetOTPRq();
    //     let otp = new OTPRawDB();

    //     jest.spyOn(OTPRepo.prototype, 'getOTP').mockImplementation((email: string) => {
    //         return Promise.resolve(otp);
    //     });

    //     let response = await manager.getOTP(req);
    //     expect(response).toHaveProperty('id');
    //     expect(response).toHaveProperty('otp');
    //     expect(response).toHaveProperty('email');
    //     expect(response).toHaveProperty('createDate');
    // });
});

describe("test generate OTP", () => {
    test("test generate OTP", async () => {
        let otp = manager.generateOTP();
        expect(otp).toHaveLength(6);
        expect(typeof otp).toBe("string");
    })
});

describe("test send OTP via email", () => {
    test("should send OTP via mail", async () => {
        let req = new SetOTPRq();

        jest.spyOn(Mailer.prototype, 'sendMail').mockImplementation(() => {
            return Promise.resolve(true);
        });
    
        let response = await manager.sendOTPViaMail(req);
        expect(response).toBeUndefined();
    });

    test("throw an exception", async () => {
        let req = new SetOTPRq();
        let exception = new ResponseException(null, 500, 'failed to send an email');

        jest.spyOn(Mailer.prototype, 'sendMail').mockImplementation(() => {
            return Promise.resolve(null);
        });
    
        await expect(manager.sendOTPViaMail(req)).rejects.toThrow(exception);
    });
});

describe("test verify OTP", () => {
    test("test verify OTP", async () => {
        let req = new SetOTPRq();
        let otp = new OTPRawDB();

        jest.spyOn(OTPRepo.prototype, 'getOTP').mockImplementation((email: string) => {
            return Promise.resolve(otp);
        });

        let response = await manager.verifyOTP(req);
        expect(response).toBeUndefined();
    });

    test("test failed verification due to not existing OTP", async () => {
        let req = new SetOTPRq();
        let exception = new ResponseException(null, 500, "no data found");

        jest.spyOn(OTPRepo.prototype, 'getOTP').mockImplementation((email: string) => {
            return Promise.resolve(null);
        });

        await expect(manager.verifyOTP(req)).rejects.toThrow(exception);
    });

    test("test failed verification due to OTP mismatch", async () => {
        let req = new SetOTPRq();
        req.otp = '123456';

        let otp = new OTPRawDB();
        otp.otp = '654321'
        let exception = new ResponseException(null, 400, 'otp does not match');

        jest.spyOn(OTPRepo.prototype, 'getOTP').mockImplementation((email: string) => {
            return Promise.resolve(otp);
        });

        await expect(manager.verifyOTP(req)).rejects.toThrow(exception);
    });
})