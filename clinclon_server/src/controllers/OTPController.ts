import OTPManager from '../managers/OTPManager';
import SuperController from './SuperController';
import { GetOTPRq, SetOTPRq, GetOTPRs } from '../models/OTP';
import {
    Body,
    Get,
    Post,
    Queries,
    Route,
    Security
  } from "tsoa";
import Validate from '../validators/CustomValidator';
import { JWT } from '../config';

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
    @Security(JWT)
    @Validate
    public async getOTP(@Queries() rq: GetOTPRq): Promise<GetOTPRs> {
        return await this._OTPManager.getOTP(rq);
    }

    @Post()
    @Security(JWT)
    @Validate
    public async setOTP(@Body() request: SetOTPRq): Promise<void> {
        await this._OTPManager.setOTP(request);
    }
    
    @Post('/verify')
    @Security(JWT)
    @Validate
    public async verifyOTP(@Body() request: SetOTPRq): Promise<void> {
        await this._OTPManager.verifyOTP(request);
    }
}
