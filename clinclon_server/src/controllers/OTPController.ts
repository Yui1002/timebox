import OTPManager from '../managers/OTPManager';
import SuperController from './SuperController';
import { GetOTPRq, SetOTPRq, GetOTPRs } from '../models/OTP';
import {
    Body,
    Get,
    Post,
    Query,
    Route,
  } from "tsoa";

interface IOTPController {
    getOTP(email: string): Promise<GetOTPRs>;
    setOTP(request: SetOTPRq): Promise<void>;
    verifyOTP(request: SetOTPRq): Promise<void>;
}

@Route("otp")
export class OTPController extends SuperController implements IOTPController {
    private _OTPManager: OTPManager;

    constructor() {
        super();
        this._OTPManager = new OTPManager();
    }

    @Get()
    public async getOTP(@Query() email: string): Promise<GetOTPRs> {
        this._validator.validateBody<GetOTPRq>(email, new GetOTPRq());
        return await this._OTPManager.getOTP(email);
    }

    @Post()
    public async setOTP(@Body() request: SetOTPRq): Promise<void> {
        let parsedRq = this._validator.validateBody(request, new SetOTPRq());
        await this._OTPManager.setOTP(parsedRq);
    }
    
    @Post('/verify')
    public async verifyOTP(@Body() request: SetOTPRq): Promise<void> {
        let parsedRq = this._validator.validateBody<SetOTPRq>(request, new SetOTPRq());
        await this._OTPManager.verifyOTP(parsedRq);
    }
}
