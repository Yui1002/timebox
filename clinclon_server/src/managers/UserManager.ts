import UserRepo from "../repositories/UserRepo";
import {
  GetUserRq,
  GetUserRs,
  SetUserRq,
  SignInUserRq,
  ResetPasswordRq,
  UserRawDB,
  RefreshTokenRq,
  GetUserByIdRq,
} from "../models/User";
import ResponseException from "../models/ResponseException";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { SetOTPRq } from "../models/OTP";
import OTPManager from "./OTPManager";
import { TokenResponse, RefreshTokenResponse } from "../interfaces/Token";
dotenv.config();

interface IUserManager {
  getUser(rq: GetUserRq): Promise<GetUserRs>;
  getUserById(rq: GetUserByIdRq): Promise<GetUserRs>
  setUser(userRq: SetUserRq): Promise<TokenResponse>;
  signInUser(userRq: SignInUserRq): Promise<TokenResponse>;
  refreshToken(refreshToken: RefreshTokenRq): Promise<RefreshTokenResponse>;
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

  async getUserById(rq: GetUserByIdRq): Promise<GetUserRs> {
    let userDB = await this._userRepo.getUserById(rq.id);
    if (!userDB) {
      throw new ResponseException(null, 400, "data not found");
    }
    return new GetUserRs(userDB);
  }

  async setUser(userRq: SetUserRq): Promise<TokenResponse> {
    userRq.password = await this.hashPassword(userRq.password);
    await this._userRepo.setUser(userRq);

    let user = await this._userRepo.getUser(userRq.email);

    if (!user) {
      throw new ResponseException(null, 400, "User not found");
    }

    const tokens = this.generateTokens(user);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresIn: 3600, // 1 hour
      user: new GetUserRs(user),
    };
  }

  async signInUser(userRq: SignInUserRq): Promise<TokenResponse> {
    let user = await this._userRepo.getUser(userRq.email);

    if (!user) {
      throw new ResponseException(null, 400, "Incorrect email or password");
    }

    if (!(await this.comparePassword(userRq.password, user.password))) {
      throw new ResponseException(null, 400, "Incorrect email or password");
    }

    const tokens = this.generateTokens(user);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresIn: 3600,
      user: new GetUserRs(user)
    };
  }

  async refreshToken(refreshToken: RefreshTokenRq): Promise<RefreshTokenResponse> {
    try {
      const decoded = jwt.verify(refreshToken.refreshToken, process.env.JWT_REFRESH_SECRET) as any;
      const user = await this._userRepo.getUserById(decoded.id);

      if (!user) {
        throw new ResponseException(null, 401, "Invalid refresh token");
      }

      const tokens = this.generateTokens(user);
      return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: 3600
      }
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new ResponseException(null, 401, "Invalid refresh token");
      }
      throw error;
    }
  }

  async signUpUser(userRq: SetUserRq): Promise<void> {
    const user = await this._userRepo.getUser(userRq.email);
    if (user) {
      throw new ResponseException(null, 409, "User already exists");
    }

    userRq.password = await this.hashPassword(userRq.password);

    await this._userRepo.setTempUser(userRq);
    await this._otpManager.setOTP({
      email: userRq.email,
      otp: "",
    } as SetOTPRq);
  }

  async resetPassword(passwordRq: ResetPasswordRq): Promise<void> {
    let user = await this._userRepo.getUser(passwordRq.email);
    if (!user) {
      throw new ResponseException(null, 400, "no data found");
    }

    if (await this.comparePassword(passwordRq.newPassword, user.password)) {
      throw new ResponseException(
        null,
        400,
        "You cannot reuse the previous password"
      );
    }

    passwordRq.newPassword = await this.hashPassword(passwordRq.newPassword);
    await this._userRepo.resetPassword(passwordRq);
  }

  generateTokens(user: UserRawDB): {accessToken: string, refreshToken: string} {
    const accessToken = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "30d" }
    );

    return { accessToken, refreshToken };
  }

  async hashPassword(password: string) {
    return await bcrypt.hash(password, Number(process.env.SALT_ROUNDS));
  }

  async comparePassword(password1: string, password2: string) {
    return await bcrypt.compare(password1, password2);
  }

  async verifyEmail(email: string): Promise<boolean> {
    const user = await this._userRepo.getUser(email);
    if (!user) {
      throw new ResponseException(null, 400, "Email not verified");
    }
    return true;
  }
}

export default UserManager;
