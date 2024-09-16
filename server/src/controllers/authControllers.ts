import AutheModels from "../models/authModels";
import log4js from "log4js";

class AuthControllers {
  models: AutheModels;

  constructor() {
    this.models = new AutheModels();
  }

  // async logFile(req: any, res: any) {
  //   log4js.configure({
  //     appenders: {
  //       app: { type: "file", filename: "app.log" },
  //     },
  //     categories: {
  //       default: {
  //         appenders: ["app"],
  //         level: "info",
  //       },
  //     },
  //   });

  //   const logger = log4js.getLogger();
  //   logger.info("This is my first log4js");

  //   res.send("success");
  // }

  async isUserRegistered(req: any, res: any) {
    const { email } = req.params;
    const isUserRegistered = await this.models.isUserRegistered(email);
    if (isUserRegistered) {
      res.status(400).json({ error: "This email is already used" });
      return;
    }
    // send otp
    const otpSuccess = await this.models.handleOtp(email);
    otpSuccess ? res.sendStatus(200) : res.sendStatus(400);
  }

  async isEmailRegistered(req: any, res: any) {
    const { email } = req.query;
    const emailRegistered = await this.models.isUserRegistered(email);
    if (emailRegistered) {
      const name = await this.models.getName(email);
      res.status(200).send(name);
      return;
    }
    res.sendStatus(400);
  }

  async signUp(req: any, res: any) {
    (await this.models.signUp(req.body))
      ? res.sendStatus(200)
      : res.status(400).json({ error: "Failed to sign up" });
  }

  async signIn(req: any, res: any) {
    const { email, password } = req.body;
    const usersname = await this.models.getName(email);
    if (!usersname.length) {
      res.status(400).json({ error: "Incorrect email address or password" });
      return;
    }
    const isPasswordMatch = await this.models.isPasswordMatch(email, password);
    if (!isPasswordMatch) {
      res.status(400).json({ error: "Incorrect email address or password" });
      return;
    }
    res.status(200).send({
      firstName: usersname[0].first_name,
      lastName: usersname[0].last_name,
    });
  }

  async resendOtp(req: any, res: any) {
    const {email} = req.body;
    const otpSuccess = await this.models.handleOtp(email);
    otpSuccess ? res.sendStatus(200) : res.sendStatus(400);
  }

  async verifyOTP(req: any, res: any) {
    const { otp, email } = req.body;
    const isOtpVerified = await this.models.verifyOtp(email, otp);
    if (isOtpVerified) {
      await this.models.deleteOtp(email);
      res.sendStatus(200);
      return;
    }

    res.status(400).json({ error: "Entered OTP is invalid or expired" });
  }

  async resetPassword(req: any, res: any) {
    const response = await this.models.resetPassword(req.body);
    if (response.name === 'Error') {
      res.status(400).json({ error: response.message });
      return;
    }
    res.sendStatus(200)
  }
}

export default AuthControllers;
