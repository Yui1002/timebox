import { Body, Get, Post, Route, Queries } from "tsoa";
import UserManager from '../managers/userManager';
import SuperController from './SuperController';
import { GetUserRq, GetUserRs, SetUserRq, SignInUserRq, ResetPasswordRq } from '../models/User';

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
    public async getUser(@Queries() rq: GetUserRq): Promise<GetUserRs> {
        const parsedRq = this._validator.validateBody<GetUserRq>(rq, new GetUserRq());
        return await this._userManager.getUser(parsedRq.email);
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