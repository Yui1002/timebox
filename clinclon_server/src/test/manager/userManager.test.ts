import UserManager from '../..//managers/UserManager';
import UserRepo from '../../repositories/UserRepo';
import ResponseException from '../../models/ResponseException';
import { GetUserRq, SetUserRq, SignInUserRq, UserRawDB } from '../../models/User';
import bcrypt from 'bcrypt';

let manager = new UserManager();

describe("test get user", () => {
    // test("test get user", async () => {
    //     let req = new GetUserRq();
    //     let user = new UserRawDB();
    //     jest.spyOn(UserRepo.prototype, 'getUser').mockImplementation((email: string) => {
    //         return Promise.resolve(user);
    //     });
    //     let response = await manager.getUser(req);
    //     expect(response).toHaveProperty('id')
    //     expect(response).toHaveProperty('first_name')
    //     expect(response).toHaveProperty('last_name')
    //     expect(response).toHaveProperty('email')
    //     expect(response).toHaveProperty('password')
    //     expect(response).toHaveProperty('status')
    // });
});

describe("test set user", () => {
    test("test set user", async () => {
        let req = new SetUserRq();

        jest.spyOn(UserRepo.prototype, 'setUser').mockImplementation((userRq: SetUserRq) => {
            return Promise.resolve();
        });

        let response = await manager.setUser(req);
        expect(response).toBeUndefined();
    });
});

describe("test sign in user", () => {
    test("test sign in user", async () => {
        let req = new SignInUserRq();
        let user = new UserRawDB();

        jest.spyOn(UserRepo.prototype, 'getUser').mockImplementation((email: string) => {
            return Promise.resolve(user);
        });

        jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => {
            return true;
        });

        let response = await manager.signInUser(req);
        expect(response).toHaveProperty('first_name');
        expect(response).toHaveProperty('last_name');
        expect(response).toHaveProperty('email');
    });

    test("test sign in fail due to not existing email", async () => {
        let req = new SignInUserRq();
        let exception = new ResponseException(null, 400, 'User does not exist!');
        
        jest.spyOn(UserRepo.prototype, 'getUser').mockImplementation((email: string) => {
            return null;
        });

        await expect(manager.signInUser(req)).rejects.toThrow(exception);
    });

    test("test sign in fail due to password mismatch", async () => {
        let req = new SignInUserRq();
        let user = new UserRawDB();
        let exception = new ResponseException(null, 400, 'Password not match');

        jest.spyOn(UserRepo.prototype, 'getUser').mockImplementation((email: string) => {
            return Promise.resolve(user);
        });

        jest.spyOn(bcrypt, 'compare').mockImplementation(() => {
            return false;
        })

        await expect(manager.signInUser(req)).rejects.toThrow(exception);
    })
});