import { v4 as uuidv4 } from "uuid";
import { OwnerInterface } from "../interfaces/OwnerInterface";
import Repositories from "./repositories";

class AuthRepositories {
  repositories: Repositories;

  constructor() {
    this.repositories = new Repositories();
  }

  async isOwnerRegistered(email: string) {
    const sql = "SELECT * FROM public.owners WHERE email_address = $1;";
    return (await this.repositories.queryDB(sql, [email])).rowCount > 0;
  }

  async isNannyRegistered(username: string) {
    const sql = "SELECT COUNT (*) FROM public.users WHERE user_name = $1;";
    return (await this.repositories.queryDB(sql, [username])).rows[0].count;
  }

  async registerOwner(owner: OwnerInterface) {
    const { email, status, createDate, password } = owner;
    const sql =
      "INSERT INTO public.owners (owner_id, first_name, last_name, email_address, status, create_date, owner_password) VALUES ($1, $2, $3, $4, $5, $6, $7);";
    const uuid = uuidv4();
    return (
      (
        await this.repositories.queryDB(sql, [
          uuid,
          null,
          null,
          email,
          status,
          createDate,
          password,
        ])
      ).rowCount > 0
    );
  }

  async getOwnerPassword(email: string) {
    const sql =
      "SELECT owner_password FROM public.owners WHERE email_address = $1;";
    return (await this.repositories.queryDB(sql, [email])).rows[0]
      .owner_password;
  }

  async storeResetPasswordCode(code: number, ownerId: string) {
    const sql =
      "INSERT INTO reset_password_code (owner_id, reset_password_code, create_date) VALUES ($1, $2, $3);";
    await this.repositories.queryDB(sql, [ownerId, code, new Date()]);
    return true;
  }

  async getOwnerId(email: string) {
    const sql = "SELECT owner_id FROM owners WHERE email_address = $1;";
    return (await this.repositories.queryDB(sql, [email])).rows[0].owner_id;
  }

  async validateCodeExpiration(ownerId: string, submittedDate: Date) {
    const sql =
      "SELECT COUNT (*) FROM owners WHERE owner_id = $1 AND create_date + INTERVAL '10 Minutes' >= $2;";
    return (
      (await this.repositories.queryDB(sql, [ownerId, submittedDate]))
        .rowCount > 0
    );
  }

  async validateCodeMatch(ownerId: string, code: string) {
    const sql =
      "SELECT COUNT (*) FROM reset_password_code WHERE owner_id = $1 AND reset_password_code = $2;";
    return (await this.repositories.queryDB(sql, [ownerId, code])).rowCount > 0;
  }

  async isPasswordSame(ownerId: string, password: string) {
    const sql =
      "SELECT COUNT (*) FROM owners WHERE owner_id = $1 AND owner_password = $2;";
    return (
      (await this.repositories.queryDB(sql, [ownerId, password])).rowCount > 0
    );
  }

  async resetPassword(ownerId: string, newPassword: string) {
    const sql = "UPDATE owners SET owner_password = $1 WHERE owner_id = $2;";
    await this.repositories.queryDB(sql, [newPassword, ownerId]);
    return true;
  }
}

export default AuthRepositories;
