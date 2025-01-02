import { UserController } from "../../controllers/userController";
import UserManager from "../../managers/userManager";
import Validator from "../../validators/Validator";
import { GetUserRq, GetUserRs, UserRawDB, SetUserRq, SignInUserRq } from "../../models/User";
import {BaseRequest} from "../../models/BaseRequest";
import TestResponse from "./testResponse";

let controller = new UserController();
let mockRes: TestResponse;
let mockNext: any;

let getRequest: any;
let setRequest: any;
let verifyRequest: any;
let signInRequest: any;

enum Status {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
}

describe("test get user", () => {
    beforeEach(() => {
        mockRes = new TestResponse();
        mockNext = jest.fn();
        getRequest = {
            body: {
                email: 'test@gmail.com'
            }
        }
    })
    // test("should get user based on email", async () => {
    //     let user = new GetUserRs(new UserRawDB());
    //     jest.spyOn(UserManager.prototype, 'getUser').mockImplementation((userRq: GetUserRq) => {
    //         return Promise.resolve(user);
    //     });
    //     jest.spyOn(Validator.prototype, "validate").mockImplementation((req: any, objectType: BaseRequest) => {
    //         return new GetUserRq();
    //     })
        
    //     await controller.getUser(getRequest, mockRes, mockNext);
    //     expect(mockRes.getStatus()).toBe(200);
    //     expect(mockRes.getData()).toStrictEqual(user);
    // });

    // test("should throw an exception", async () => {
    //     jest.spyOn(UserManager.prototype, 'getUser').mockImplementation((userRq: GetUserRq) => {
    //         throw 'error';
    //     });
    //     await controller.getUser(getRequest, mockRes, mockNext);
    //     expect(mockNext).toHaveBeenCalledTimes(1);
    //     expect(mockNext).toHaveBeenLastCalledWith('error');
    // });
});

describe("test set user", () => {
    beforeEach(() => {
        mockRes = new TestResponse();
        mockNext = jest.fn();
        setRequest = {
            body: {
                first_name: 'yui',
                last_name: 'dayo',
                email: 'test2@gmail.com',
                password: 'password'
            }
        }
    })
    // test("should set user", async () => {
    //     jest.spyOn(Validator.prototype, 'validate').mockImplementation((req: any, objectType: BaseRequest) => {
    //         return new SetUserRq();
    //     });
    //     jest.spyOn(UserManager.prototype, 'setUser').mockImplementation((userRq: SetUserRq) => {
    //         return Promise.resolve();
    //     });
    //     await controller.setUser(setRequest, mockRes, mockNext);
    //     expect(mockRes.getStatus()).toBe(200);
    // });

    // test("should throw an exception", async () => {
    //     jest.spyOn(UserManager.prototype, 'setUser').mockImplementation((userRq: SetUserRq) => {
    //         throw 'error';
    //     });
    //     await controller.setUser(setRequest, mockRes, mockNext);
    //     expect(mockNext).toHaveBeenCalledTimes(1);
    //     expect(mockNext).toHaveBeenLastCalledWith('error');
    // })
});

describe("test verify user", () => {
    beforeEach(() => {
        mockRes = new TestResponse();
        mockNext = jest.fn();
        verifyRequest = {
            body: {
               email: 'test@gmail.com' 
            }
        }
    })
    // test("should verify user", async () => {
    //     let result = new GetUserRs(new UserRawDB());

    //     jest.spyOn(Validator.prototype, 'validate').mockImplementation((req: any, objectType: BaseRequest) => {
    //         return new GetUserRq();
    //     });
    //     jest.spyOn(UserManager.prototype, 'verifyUser').mockImplementation((userRq: GetUserRq) => {
    //         return Promise.resolve(true);
    //     });
    //     await controller.verifyUser(verifyRequest, mockRes, mockNext);
    //     expect(mockRes.getStatus()).toBe(200);
    // });

    // test("should throw an exception if verification fails", async () => {
    //     jest.spyOn(UserManager.prototype, 'verifyUser').mockImplementation((userRq: GetUserRq) => {
    //         throw 'error'
    //     });

    //     await controller.verifyUser(verifyRequest, mockRes, mockNext);
    //     expect(mockNext).toHaveBeenCalledTimes(1);
    //     expect(mockNext).toHaveBeenLastCalledWith('error');
    // })
});

describe("test sign in user", () => {
    beforeEach(() => {
        mockRes = new TestResponse();
        mockNext = jest.fn();
        signInRequest = {
            email: "helloworld@gmail.com",
            password: "helloworld123"
        }
    })
    // test("should sign in user", async () => {
    //     jest.spyOn(Validator.prototype, 'validate').mockImplementation((userRq: SignInUserRq) => {
    //         return new SignInUserRq();
    //     });
    //     jest.spyOn(UserManager.prototype, 'signInUser').mockImplementation((userRq: SignInUserRq) => {
    //         return Promise.resolve(new GetUserRs(new UserRawDB()));
    //     });

    //     await controller.signInUser(signInRequest, mockRes, mockNext);
    //     expect(mockRes.getStatus()).toBe(200);
    // });

    // test("should throw an exception", async () => {
    //     jest.spyOn(UserManager.prototype, 'signInUser').mockImplementation((userRq: GetUserRq) => {
    //         throw 'error'
    //     });

    //     await controller.signInUser(signInRequest, mockRes, mockNext);
    //     expect(mockNext).toHaveBeenCalledTimes(1);
    //     expect(mockNext).toHaveBeenLastCalledWith('error');
    // });
});





