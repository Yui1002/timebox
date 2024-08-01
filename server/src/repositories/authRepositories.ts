import { EmployerInterface } from "../interfaces/EmployerInterface";
import Repositories from "./repositories";

class AuthRepositories extends Repositories {
  // repositories: Repositories;

  constructor() {
    super();
    // this.repositories = new Repositories();
  }

  async signUp(req: any, hashedPass: string) {
    const { firstName, lastName, email } = req;
    const sql =
      "INSERT INTO users VALUES (gen_random_uuid(), $1, $2, $3, $4, DEFAULT, CURRENT_TIMESTAMP);";
    await this.queryDB(sql, [
      firstName,
      lastName,
      email,
      hashedPass,
    ]);
    return true;
  }

  async getName(email: string) {
    const sql = "SELECT first_name, last_name FROM users WHERE email_address = $1;";
    return (await this.queryDB(sql, [email])).rows;
  }

  async getPassword(email: string) {
    const sql = "SELECT password FROM users WHERE email_address = $1;";
    return (await this.queryDB(sql, [email])).rows[0].password;
  }

  async isUserRegistered(email: string) {
    const sql = "SELECT * FROM users WHERE email_address = $1;";
    return (await this.queryDB(sql, [email])).rowCount > 0;
  }

  async getUserId(email: string) {
    const sql = "SELECT user_id FROM users WHERE email_address = $1;";
    return (await this.queryDB(sql, [email])).rows[0].user_id;
  }

  async storeOtp(otp: string, email: string) {
    const sql =
      "INSERT INTO otp VALUES (gen_random_uuid(), $1, CURRENT_TIMESTAMP, $2);";
    await this.queryDB(sql, [otp, email]);
    return true;
  }

  async updateOtp(otp: string, email: string) {
    const sql =
      "UPDATE otp SET otp = $1 AND create_date = CURRENT_TIMESTAMP WHERE email_address = $2;";
    await this.queryDB(sql, [otp, email]);
    return true;
  }

  async validateCodeExpiration(ownerId: string, submittedDate: Date) {
    const sql =
      "SELECT COUNT (*) FROM owners WHERE owner_id = $1 AND create_date + INTERVAL '10 Minutes' >= $2;";
    return (
      (await this.queryDB(sql, [ownerId, submittedDate]))
        .rowCount > 0
    );
  }

  async validateCodeMatch(ownerId: string, code: string) {
    const sql =
      "SELECT COUNT (*) FROM reset_password_code WHERE owner_id = $1 AND reset_password_code = $2;";
    return (await this.queryDB(sql, [ownerId, code])).rowCount > 0;
  }

  async resetPassword(email: string, password: string) {
    const sql = "UPDATE users SET password = $1 WHERE email_address = $2;";
    await this.queryDB(sql, [password, email]);
    return true;
  }
}

export default AuthRepositories;
