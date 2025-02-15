import dotenv from "dotenv";
import { SetOTPRq, OTPRawDB, GetOTPRq } from "../models/OTP";
import JSHelperInstance from "../helpers/JsonConverterHelper";
import ResponseException from "../models/ResponseException";
import Repositories from "./Repositories";
dotenv.config();


interface IOTPRepo {
    getOTP(email: string): Promise<OTPRawDB>;
    setOTP(otpRq: SetOTPRq): Promise<void>;
    updateOTP(otpRq: SetOTPRq): Promise<void>;
    deleteOTP(otp: SetOTPRq): Promise<void>
}

class OTPRepo extends Repositories implements IOTPRepo {

    async getOTP(email: string): Promise<OTPRawDB> {
        try {
            const sql = "SELECT otp_id AS id, otp, email_address, create_date FROM otp WHERE email_address = $1;";
            const data = await this.queryDB(sql, [email]);
            if (data?.rows.length <= 0) {
                return null;
            }
            return JSHelperInstance._converter.deserializeObject(data?.rows[0], OTPRawDB);
        } catch (e) {
            throw new ResponseException(e, 500, "unable to get from db");
        }
    }

    async setOTP(otpRq: SetOTPRq): Promise<void> {
        try {
            const sql = "INSERT INTO otp (otp_id, otp, email_address, create_date) VALUES (DEFAULT, $1, $2, CURRENT_TIMESTAMP);";
            await this.queryDB(sql, [otpRq.otp, otpRq.email]);
        } catch (e) {
            throw new ResponseException(e, 500, "unable to insert into db");
        } 
    }

    async updateOTP(otpRq: SetOTPRq): Promise<void> {
        try {
            const sql = "UPDATE otp SET otp = $1, create_date = CURRENT_TIMESTAMP WHERE email_address = $2;";
            await this.queryDB(sql, [otpRq.otp, otpRq.email]);
        } catch (e) {
            throw new ResponseException(e, 500, "unable to update data");
        }
    }

    async deleteOTP(otpRq: SetOTPRq): Promise<void> {
        try {
            const sql = "DELETE FROM otp WHERE email_address = $1;";
            await this.queryDB(sql, [otpRq.email]);
        } catch (e) {
            throw new ResponseException(e, 500, "unable to delete from db");
        }
      }

} 

export default OTPRepo;