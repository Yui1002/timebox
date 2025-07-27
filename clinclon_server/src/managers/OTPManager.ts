import OTPRepo from "../repositories/OTPRepo";
import { GetOTPRq, GetOTPRs, SetOTPRq } from "../models/OTP";
import ResponseException from "../models/ResponseException";
import dotenv from "dotenv";
import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";
import { generateOTPEmail } from "../templates/emailTemplates";
dotenv.config();

interface IOTPManager {
  getOTP(rq: GetOTPRq): Promise<GetOTPRs>;
  setOTP(otpRq: SetOTPRq): Promise<void>;
  verifyOTP(otpRq: SetOTPRq): Promise<void>;
  generateOTP(): string;
  sendOTPViaMail(otpRq: SetOTPRq): Promise<void>;
}

class OTPManager implements IOTPManager {
  private _OTPRepo: OTPRepo;
  private mailerSend: MailerSend;
  private sender: Sender;

  constructor() {
    this._OTPRepo = new OTPRepo();
    this.initializeEmail();
  }

  initializeEmail() {
    const apiToken = process.env.MAILERSEND_API_KEY;
    if (!apiToken) {
      throw new Error("Token is not configured");
    }

    this.mailerSend = new MailerSend({
      apiKey: apiToken,
    });

    this.sender = new Sender(
      process.env.MAILERSEND_SENDER,
      process.env.MAILERSEND_SENDER_NAME
    );
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
    try {
      const recipient = [new Recipient(otpRq.email)];
      const htmlContent = generateOTPEmail(otpRq.otp);
      const emailParams = new EmailParams()
        .setFrom(this.sender)
        .setTo(recipient)
        .setSubject("One-time Password")
        .setHtml(htmlContent)
        .setText("");
      await this.mailerSend.email.send(emailParams);
    } catch (err) {
      throw new ResponseException(null, 500, 'Sending email failed')
    }
  }
}

export default OTPManager;
