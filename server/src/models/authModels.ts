import AuthRepositories from "../repositories/authRepositories";
import { OwnerInterface } from "../interfaces/OwnerInterface";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";
import jwt from 'jsonwebtoken';

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

class AutheModels {
  repositories: AuthRepositories;
  saltRounds: number;
  codeExpTime: number;

  constructor() {
    this.repositories = new AuthRepositories();
    this.saltRounds = 10;
    this.codeExpTime = 10;
  }

  async isOwnerRegistered(email: string) {
    return await this.repositories.isOwnerRegistered(email);
  }

  async isPasswordMatch(email: string, password: string) {
    const hashedPassword = await this.repositories.getOwnerPassword(email);
    return await bcrypt.compare(password, hashedPassword);
  }

  async signUpOwner(owner: OwnerInterface) {
    if (owner.password !== null) {
      const hashedPassword = await bcrypt.hash(owner.password, this.saltRounds);
      owner.password = hashedPassword;
    }
    return await this.repositories.registerOwner(owner);
  }

  async sendResetPasswordCode(ownerEmail: string) {
    const code = this.generateOTP();
    const mailOptions = this.setMailOptions(process.env.MAIL_USER, ownerEmail, "Sending Reset Password Code", code.toString(), this.codeExpTime)

    try {
      await transporter.sendMail(mailOptions);
      const ownerId = await this.repositories.getOwnerId(ownerEmail);
      return await this.repositories.storeResetPasswordCode(Number(code), ownerId);
    } catch (err) {
      return err;
    } finally {
      transporter.close();
    }
  }

  // ----------- OTP handling -----------------
  async handleOTP(ownerEmail: string) {
    const OTP = this.generateOTP();
    console.log('generated otp ', OTP)
    const ownerId = await this.repositories.getOwnerId(ownerEmail);
    await this.storeOTP(ownerId, OTP);
    await this.emailOTP(ownerEmail, OTP);
    return OTP;
  }

  generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async storeOTP(ownerId: string, OTP: string) {
    return await this.repositories.storeOTP(ownerId, OTP);
  }

  async emailOTP(email: string, code: string) {
    const mailOptions = this.setMailOptions(process.env.MAIL_USER, email, "Sending One Time Password", code, this.codeExpTime)
    try {
      await transporter.sendMail(mailOptions);
    } catch (err) {
      return err;
    } finally {
      transporter.close();
    }
  }
  // -----------------------------------------

  setMailOptions(from: string, to: string, subject: string, code: string, expirationTime: number) {
    return {
      from: `${from}`,
      to: `${to}`,
      subject: `${subject}`,
      text: `Enter the following code when prompted: ${code}. It will be expired in ${expirationTime} minutes.`
    };
  }

  async validateCodeExpiration(req: any) {
    const { ownerEmail, submittedDate } = req;
    const ownerId = await this.repositories.getOwnerId(ownerEmail);
    const isValid = await this.repositories.validateCodeExpiration(ownerId, submittedDate);
    return isValid;
  }

  async validateCodeMatch(req: any) {
    const { code, ownerEmail } = req;
    const ownerId = await this.repositories.getOwnerId(ownerEmail);
    const isCodeMatch = await this.repositories.validateCodeMatch(ownerId, code);
    return isCodeMatch;
  }

  async isPasswordSame(req: any) {
    const { ownerEmail, newPassword } = req;
    const ownerId = await this.repositories.getOwnerId(ownerEmail);
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    return await this.repositories.isPasswordSame(ownerId, hashedNewPassword);
  }

  async resetPassword(req: any) {
    const {newPassword, ownerEmail} = req;
    const ownerId = await this.repositories.getOwnerId(ownerEmail);
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    return await this.repositories.resetPassword(ownerId, hashedPassword)
  }

  async validateOTP(req: any) {
    const {ownerEmail, OTP} = req;
    const ownerId = await this.repositories.getOwnerId(ownerEmail);
    return await this.repositories.validateOTP(ownerId, OTP)
  }

  async resendOTP(req: any) {
    const {ownerEmail} = req;
    const OTP = this.generateOTP();
    const ownerId = await this.repositories.getOwnerId(ownerEmail);
    return await this.repositories.updateOTP(ownerId, OTP);
  }

  async generateJWTToken(email: string) {
    const data = {
      signInTime: Date.now(),
      email
    }
    const token = jwt.sign(data, process.env.JWT_SECRET)
    return token;
  }
}

export default AutheModels;
