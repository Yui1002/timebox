import { Body, Get, Post, Route, Queries, Security, Query } from "tsoa";
import UserManager from '../managers/UserManager';
import SuperController from './SuperController';
import { GetUserRq, GetUserRs, SetUserRq, SignInUserRq, ResetPasswordRq, RefreshTokenRq } from '../models/User';
import Validate from "../validators/CustomValidator";
import { JWT } from "../config";
import { TokenResponse, RefreshTokenResponse } from "../interfaces/Token";

interface IUserController {
    getUser(rq: GetUserRq): Promise<GetUserRs>;
    setUser(request: SetUserRq): Promise<TokenResponse>;
    signInUser(request: SignInUserRq): Promise<TokenResponse>;
    refreshToken(request: RefreshTokenRq): Promise<RefreshTokenResponse>;
    resetPassword(request: ResetPasswordRq): Promise<void>;
    signUpUser(request: SetUserRq): Promise<void>;
    verifyEmail(request: GetUserRq): Promise<boolean>;
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
    @Validate
    public async setUser(@Body() rq: SetUserRq): Promise<TokenResponse> {
        return await this._userManager.setUser(rq);
    }

    @Post('/signIn')
    @Validate
    public async signInUser(@Body() rq: SignInUserRq): Promise<TokenResponse> {
        return await this._userManager.signInUser(rq);
    }

    @Post('/refresh')
    @Validate
    public async refreshToken(@Body() rq: RefreshTokenRq): Promise<RefreshTokenResponse> {
        return await this._userManager.refreshToken(rq)
    }
    
    @Post('/resetPassword')
    @Validate
    public async resetPassword(@Body() rq: ResetPasswordRq): Promise<void> {
        await this._userManager.resetPassword(rq);
    } 

    @Post('/signUp')
    @Validate
    public async signUpUser(@Body() rq: SetUserRq): Promise<void> {
        await this._userManager.signUpUser(rq);
    }

    @Get('/verifyEmail')
    @Validate
    public async verifyEmail(@Queries() rq: GetUserRq): Promise<boolean> {
        return await this._userManager.verifyEmail(rq.email)
    }
} 