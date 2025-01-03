import OTPManager from '../managers/OTPManager';
import SuperController from './SuperController';
import { GetOTPRq, SetOTPRq, GetOTPRs } from '../models/OTP';
import {
    Body,
    Get,
    Post,
    Queries,
    Route,
  } from "tsoa";
import validate from '../validators/CustomValidator';

interface IOTPController {
    getOTP(rq: GetOTPRq): Promise<GetOTPRs>;
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
    @validate
    public async getOTP(@Queries() rq: GetOTPRq): Promise<GetOTPRs> {
        return await this._OTPManager.getOTP(rq);
    }

    @Post()
    @validate
    public async setOTP(@Body() request: SetOTPRq): Promise<void> {
        await this._OTPManager.setOTP(request);
    }
    
    @Post('/verify')
    @validate
    public async verifyOTP(@Body() request: SetOTPRq): Promise<void> {
        await this._OTPManager.verifyOTP(request);
    }
}
