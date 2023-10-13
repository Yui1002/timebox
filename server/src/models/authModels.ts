import AuthRepositories from "../repositories/authRepositories";
import { OwnerInterface } from "../interfaces/OwnerInterface";
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

  async isOwnerRegistered(email: string) {
    return await this.repositories.isOwnerRegistered(email);
  }

  async isPasswordMatch(email: string, password: string) {
    const hashedPassword = await this.repositories.getOwnerPassword(email);
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
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
      text: `Enter the following code when prompted: ${code}`,
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

  async setNewPassword(req: any) {
    const {newPassword, ownerEmail} = req;
    const ownerId = await this.repositories.getOwnerId(ownerEmail);
    // decode encrypted password 
    const originalPassword = await this.repositories.getOwnerPassword(ownerEmail);
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    if (originalPassword === hashedPassword) {
      // user typed in the prev password
      return { error: 'You cannot set the previous password'};
    }
    const response = await this.repositories.setNewPassword(ownerId, hashedPassword)
    // compare and see if the new pw is same pw as prev one
    // if yes return false
    // otherwise encrypt the new pw
    // store to db 
  }
}

export default AutheModels;
