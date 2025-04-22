import UserRepo from "../repositories/UserRepo";
import OTPRepo from "../repositories/OTPRepo";
import {
  GetUserRq,
  GetUserRs,
  SetUserRq,
  SignInUserRq,
  ResetPasswordRq,
  UserRawDB,
} from "../models/User";
import ResponseException from "../models/ResponseException";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { SetOTPRq } from "../models/OTP";
import OTPManager from "./OTPManager";
dotenv.config();

interface IUserManager {
  getUser(rq: GetUserRq): Promise<GetUserRs>;
  setUser(userRq: SetUserRq): Promise<void>;
  signInUser(userRq: SignInUserRq): Promise<{ token: string; user: GetUserRs }>;
  resetPassword(passwordRq: ResetPasswordRq): Promise<void>;
}

class UserManager implements IUserManager {
  private _userRepo: UserRepo;
  private _otpManager: OTPManager;

  constructor() {
    this._userRepo = new UserRepo();
    this._otpManager = new OTPManager();
  }

  async getUser(rq: GetUserRq): Promise<GetUserRs> {
    let userDB = await this._userRepo.getUser(rq.email);
    if (!userDB) {
      throw new ResponseException(null, 400, "data not found");
    }
    return new GetUserRs(userDB);
  }

  async setUser(userRq: SetUserRq): Promise<void> {
    userRq.password = await bcrypt.hash(
      userRq.password,
      Number(process.env.SALT_ROUNDS)
    );
    await this._userRepo.setUser(userRq);
  }

  async signInUser(
    userRq: SignInUserRq
  ): Promise<{ token: string; user: GetUserRs }> {
    let user = await this._userRepo.getUser(userRq.email);

    if (!user) {
      throw new ResponseException(null, 400, "Incorrect email or password");
    }

    let passwordMatch = await bcrypt.compare(userRq.password, user.password);
    if (!passwordMatch) {
      throw new ResponseException(null, 400, "Incorrect email or password");
    }

    return {
      token: this.generateJsonWebToken(user),
      user: new GetUserRs(user),
    };
  }

  async resetPassword(passwordRq: ResetPasswordRq): Promise<void> {
    let userExists = await this._userRepo.getUser(passwordRq.email);
    if (!userExists) {
      throw new ResponseException(null, 400, "no data found");
    }

    let oldPassword = userExists.password;
    let passwordMatch = await bcrypt.compare(
      passwordRq.newPassword,
      oldPassword
    );

    if (passwordMatch) {
      throw new ResponseException(
        null,
        400,
        "You cannot reuse the previous password"
      );
    }

    passwordRq.newPassword = await bcrypt.hash(
      passwordRq.newPassword,
      Number(process.env.SALT_ROUNDS)
    );
    await this._userRepo.resetPassword(passwordRq);
  }

  generateJsonWebToken(user: UserRawDB) {
    return jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
  }

  async signUpUser(userRq: SetUserRq): Promise<void> {
    const user = await this._userRepo.getUser(userRq.email);
    if (user) {
      throw new ResponseException(null, 409, "User already exists");
    }

    await this._userRepo.setTempUser(userRq);
    await this._otpManager.setOTP({
      email: userRq.email,
      otp: ""
    } as SetOTPRq);
  }
}

export default UserManager;
