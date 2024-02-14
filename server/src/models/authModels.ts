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

  constructor() {
    this.repositories = new AuthRepositories();
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
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(owner.password, saltRounds);
      owner.password = hashedPassword;
    }
    return await this.repositories.registerOwner(owner);
  }

  async sendResetPasswordCode(ownerEmail: string) {
    const code = Math.floor(100000 + Math.random() * 900000);

    const mailOptions = {
      from: process.env.MAIL_USER,
      to: ownerEmail,
      subject: "Sending Reset Password Code",
      text: `Enter the following code when prompted: ${code}. It will be expired in 10 minutes.`,
    };

    try {
      const result = await transporter.sendMail(mailOptions);
      const ownerId = await this.repositories.getOwnerId(ownerEmail);
      return await this.repositories.storeResetPasswordCode(code, ownerId);
    } catch (err) {
      console.log(err);
      return err;
    } finally {
      transporter.close();
    }
  }

  async issueOTP(ownerEmail: string) {
    // generate OTP
    const OTP = this.generateOTP();
    const ownerId = await this.repositories.getOwnerId(ownerEmail);

    // store OTP
    await this.repositories.storeOTP(ownerId, OTP);

    // send OTP
    const mailOptions = {
      from: process.env.MAIL_USER,
      to: ownerEmail,
      subject: "Sending One Time Password",
      text: `Enter the following code when prompted: ${OTP}. It will be expired in 10 minutes.`,
    };

    try {
      await transporter.sendMail(mailOptions);
      return OTP;
    } catch (err) {
      console.log(err);
    } finally {
      transporter.close()
    }
  }

  generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
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
