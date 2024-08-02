import AuthRepositories from "../repositories/authRepositories";
import { EmployerInterface } from "../interfaces/EmployerInterface";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";

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

  async isUserRegistered(email: string) {
    return await this.repositories.isUserRegistered(email);
  }

  async getName(email: string) {
    return await this.repositories.getName(email);
  }

  async signUp(req: any) {
    const password = req.password;
    if (password === null) return;
    const hashedPassword = await this.generateHashedPassword(password);
    return await this.repositories.signUp(req, hashedPassword);
  }

  async isPasswordMatch(email: string, password: string) {
    const hashedPassword = await this.repositories.getPassword(email);
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
  }

  async generateHashedPassword(password: string) {
    const hashedPassword = await bcrypt.hash(
      password,
      Number(process.env.SALT_ROUNDS)
    );
    return hashedPassword;
  }

  generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async sendOtp(email: string, otp: string) {
    const mailOptions = {
      from: process.env.MAIL_USER,
      to: email,
      subject: "Sending Reset Password Code",
      text: `Enter the following code when prompted: ${otp}. It will be expired in 10 minutes.`,
    };
    try {
      await transporter.sendMail(mailOptions);
      return true;
    } catch (err) {
      return false;
    } finally {
      transporter.close();
    }
  }

  async verifyOtp(email: string, inputOtp: string) {
    return this.repositories.verifyOtp(email, inputOtp)
  }

  async storeOtp(email: string, otp: string) {
    const otpExist = await this.repositories.checkOtpExists(email);
    return otpExist
      ? this.repositories.updateOtp(otp, email)
      : this.repositories.storeOtp(otp, email);
  }

  async validateCodeExpiration(req: any) {
    const { ownerEmail, submittedDate } = req;
    const ownerId = await this.repositories.getUserId(ownerEmail);
    const isValid = await this.repositories.validateCodeExpiration(
      ownerId,
      submittedDate
    );
    return isValid;
  }

  async resetPassword(req: any) {
    const { email, password } = req;
    const hashedPassword = await bcrypt.hash(
      password,
      Number(process.env.SALT_ROUNDS)
    );
    return await this.repositories.resetPassword(email, hashedPassword);
  }
}

export default AutheModels;
