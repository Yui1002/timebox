import { Body, Get, Post, Query, Route } from "tsoa";
import UserManager from '../managers/userManager';
import SuperController from './SuperController';
import { GetUserRq, GetUserRs, SetUserRq, SignInUserRq, ResetPasswordRq } from '../models/User';

interface IUserController {
    getUser(email: string): Promise<GetUserRs>;
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
    public async getUser(@Query() email: string): Promise<GetUserRs> {
        this._validator.validateBody<GetUserRq>(email, new GetUserRq());
        return await this._userManager.getUser(email);
    }

    @Post()
    public async setUser(@Body() request: SetUserRq): Promise<void> {
        let parsedRq = this._validator.validateBody<SetUserRq>(request, new SetUserRq());
        await this._userManager.setUser(parsedRq);
    }

    @Post('/signIn')
    public async signInUser(@Body() request: SignInUserRq): Promise<GetUserRs> {
        let parsedRq = this._validator.validateBody<SignInUserRq>(request, new SignInUserRq());
        return await this._userManager.signInUser(parsedRq);
    }  
    
    @Post('/resetPassword')
    public async resetPassword(@Body() request: ResetPasswordRq): Promise<void> {
        let parsedRq = this._validator.validateBody<ResetPasswordRq>(request, new ResetPasswordRq());
        await this._userManager.resetPassword(parsedRq);
    } 
}