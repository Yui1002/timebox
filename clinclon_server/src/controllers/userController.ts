import { Body, Get, Post, Route, Queries } from "tsoa";
import UserManager from '../managers/userManager';
import SuperController from './SuperController';
import { GetUserRq, GetUserRs, SetUserRq, SignInUserRq, ResetPasswordRq } from '../models/User';
import Validate from "../validators/CustomValidator";

interface IUserController {
    getUser(rq: GetUserRq): Promise<GetUserRs>;
    setUser(request: SetUserRq): Promise<void>;
    signInUser(request: SignInUserRq): Promise<GetUserRs>;
    resetPassword(request: ResetPasswordRq): Promise<void>;
}

@Route('user')
export class UserController extends SuperController implements IUserController {
    private _userManager: UserManager;

    constructor() {
        super();
        this._userManager = new UserManager();
    }

    @Get()
    @Validate
    public async getUser(@Queries() rq: GetUserRq): Promise<GetUserRs> {
        return await this._userManager.getUser(rq);
    }

    @Post()
    @Validate
    public async setUser(@Body() rq: SetUserRq): Promise<void> {
        await this._userManager.setUser(rq);
    }

    @Post('/signIn')
    @Validate
    public async signInUser(@Body() rq: SignInUserRq): Promise<GetUserRs> {
        return await this._userManager.signInUser(rq);
    }  
    
    @Post('/resetPassword')
    @Validate
    public async resetPassword(@Body() rq: ResetPasswordRq): Promise<void> {
        await this._userManager.resetPassword(rq);
    } 
}