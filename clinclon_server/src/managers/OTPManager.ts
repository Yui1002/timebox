import OTPRepo from "../repositories/OTPRepo";
import { GetOTPRq, GetOTPRs, SetOTPRq } from "../models/OTP";
import ResponseException from "../models/ResponseException";
import dotenv from "dotenv";
import sgMail from "@sendgrid/mail";
dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

interface IOTPManager {
  getOTP(rq: GetOTPRq): Promise<GetOTPRs>;
  setOTP(otpRq: SetOTPRq): Promise<void>;
  verifyOTP(otpRq: SetOTPRq): Promise<void>;
  generateOTP(): string;
  sendOTPViaMail(otpRq: SetOTPRq): Promise<void>;
}

class OTPManager implements IOTPManager {
  private _OTPRepo: OTPRepo;

  constructor() {
    this._OTPRepo = new OTPRepo();
  }

  async getOTP(otpRq: GetOTPRq): Promise<GetOTPRs> {
    let otpDB = await this._OTPRepo.getOTP(otpRq.email);
    if (!otpDB) {
      throw new ResponseException(null, 400, "no data found");
    }

    return new GetOTPRs(otpDB);
  }

  async setOTP(otpRq: SetOTPRq): Promise<void> {
    otpRq.otp = this.generateOTP();
    let otpExists = await this._OTPRepo.getOTP(otpRq.email);

    if (otpExists) {
      await this._OTPRepo.updateOTP(otpRq);
    } else {
      await this._OTPRepo.setOTP(otpRq);
    }
    return await this.sendOTPViaMail(otpRq);
  }

  async verifyOTP(otpRq: SetOTPRq): Promise<void> {
    let otpDB = await this._OTPRepo.getOTP(otpRq.email);
    if (!otpDB) {
      throw new ResponseException(null, 400, "no data found");
    }
    if (otpDB.otp !== otpRq.otp) {
      throw new ResponseException(null, 400, "otp does not match");
    }

    let dateDB = new Date(otpDB.createDate);
    if (new Date() >= new Date(dateDB.setMinutes(dateDB.getMinutes() + 10))) {
      throw new ResponseException(null, 400, "otp expired");
    }
  }

  generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async sendOTPViaMail(otpRq: SetOTPRq): Promise<void> {
    const msg = {
      to: otpRq.email,
      from: process.env.SENDGRID_SENDER,
      subject: "Sending One Time Password",
      text: `Enter the following code when prompted: ${otpRq.otp}. It will be expired in 10 minutes.`,
    };

    try {
      await sgMail.send(msg);
    } catch (error) {
        console.log('error is', error.response?.body?.errors || error)
      throw new ResponseException(null, 500, "failed to send an OTP email");
    }
  }
}

export default OTPManager;
