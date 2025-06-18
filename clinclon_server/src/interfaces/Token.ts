import { GetUserRs } from "../models/User";

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: GetUserRs;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}
