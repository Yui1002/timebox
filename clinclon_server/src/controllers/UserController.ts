import { Body, Get, Post, Route, Queries, Security } from "tsoa";
import UserManager from '../managers/UserManager';
import SuperController from './SuperController';
import { GetUserRq, GetUserRs, SetUserRq, SignInUserRq, ResetPasswordRq } from '../models/User';
import Validate from "../validators/CustomValidator";
import { JWT } from "../config";

interface IUserController {
    getUser(rq: GetUserRq): Promise<GetUserRs>;
    setUser(request: SetUserRq): Promise<void>;
    signInUser(request: SignInUserRq): Promise<{token: string, user: GetUserRs}>;
    resetPassword(request: ResetPasswordRq): Promise<void>;
    signUpUser(request: SetUserRq): Promise<void>;
}

@Route('user')
export class UserController extends SuperController implements IUserController {
    private _userManager: UserManager;

    constructor() {
        super();
        this._userManager = new UserManager();
    }

    @Get()
    @Security(JWT)
    @Validate
    public async getUser(@Queries() rq: GetUserRq): Promise<GetUserRs> {
        return await this._userManager.getUser(rq);
    }

    @Post()
    @Security(JWT)
    @Validate
    public async setUser(@Body() rq: SetUserRq): Promise<void> {
        await this._userManager.setUser(rq);
    }

    @Post('/signIn')
    @Validate
    public async signInUser(@Body() rq: SignInUserRq): Promise<{token: string, user: GetUserRs}> {
        return await this._userManager.signInUser(rq);
    }  
    
    @Post('/resetPassword')
    @Security(JWT)
    @Validate
    public async resetPassword(@Body() rq: ResetPasswordRq): Promise<void> {
        await this._userManager.resetPassword(rq);
    } 

    @Post('/signUp')
    @Validate
    public async signUpUser(@Body() rq: SetUserRq): Promise<void> {
        await this._userManager.signUpUser(rq);
    }
}