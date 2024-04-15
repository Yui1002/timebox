import pkg from "pg";
import { Pool } from "pg";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
dotenv.config();
import { OwnerInterface } from "../interfaces/OwnerInterface";

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

class AuthRepositories {
  async isOwnerRegistered(email: string): Promise<boolean> {
    const client = await pool.connect();
    try {
      const sql = "SELECT * FROM public.owners WHERE email_address = $1;";
      const data = await client.query(sql, [email]);
      return data.rowCount > 0;
    } catch (err) {
      return err;
    } finally {
      client.release();
    }
  }

  async isNannyRegistered(username: string) {
    const client = await pool.connect();
    try {
      const sql = "SELECT * FROM public.users WHERE user_name = $1;";
      const data = await client.query(sql, [username]);
      return data.rowCount > 0;
    } catch (err) {
      return err;
    } finally {
      client.release();
    }
  }

  async registerOwner(owner: OwnerInterface) {
    const client = await pool.connect();
    const uuid = uuidv4();

    try {
      const sql =
        "INSERT INTO public.owners (owner_id, first_name, last_name, email_address, status, create_date, owner_password) VALUES ($1, $2, $3, $4, $5, $6, $7);";
      const data = await client.query(sql, [
        uuid,
        owner.firstName,
        owner.lastName,
        owner.email,
        owner.status,
        owner.createDate,
        owner.password,
      ]);
      return data.rowCount > 0;
    } catch (err) {
      return err;
    } finally {
      client.release();
    }
  }

  async getOwnerPassword(email: string) {
    const client = await pool.connect();

    try {
      const sql =
        "SELECT owner_password FROM public.owners WHERE email_address = $1;";
      const data = await client.query(sql, [email]);
      return data.rows[0].owner_password;
    } catch (err) {
      return err;
    } finally {
      client.release();
    }
  }

  async storeResetPasswordCode(code: number, ownerId: string) {
    const client = await pool.connect();
    const currentDate = new Date();
    try {
      const sql = "INSERT INTO reset_password_code (owner_id, reset_password_code, create_date) VALUES ($1, $2, $3);";
      await client.query(sql, [ownerId, code, currentDate]);
      return true;
    } catch (err) {
      console.log(err);
      return err;
    } finally {
      client.release();
    }
  }

  async getOwnerId(email: string) {
    const client = await pool.connect();

    try {
      const sql =
        "SELECT owner_id FROM owners WHERE email_address = $1;";
      const data = await client.query(sql, [email]);
      return data.rows[0].owner_id;
    } catch (err) {
      return err;
    } finally {
      client.release();
    }
  }

  async validateCodeExpiration(ownerId: string, submittedDate: Date) {
    const client = await pool.connect();
    try {
      const sql = "SELECT COUNT (*) FROM owners WHERE owner_id = $1 AND create_date + INTERVAL '10 Minutes' >= $2;";
      const data = await client.query(sql, [ownerId, submittedDate]);
      return data.rowCount > 0;
    } catch (err) {
      return err;
    } finally {
      client.release();
    }
  }

  async validateCodeMatch(ownerId: string, code: string) {
    const client = await pool.connect();
    try {
      const sql = "SELECT COUNT (*) FROM reset_password_code WHERE owner_id = $1 AND reset_password_code = $2;";
      const data = await client.query(sql, [ownerId, code]);
      return data.rowCount > 0;
    } catch (err) {
      return err;
    } finally {
      client.release();
    }
  }

  async isPasswordSame(ownerId: string, password: string) {
    const client = await pool.connect();
    try {
      const sql = "SELECT COUNT (*) FROM owners WHERE owner_id = $1 AND owner_password = $2;";
      const data = await client.query(sql, [ownerId, password]);
      return data.rowCount > 0; // password is same
    } catch (err) {
      return err;
    } finally {
      client.release();
    }
  }

  async resetPassword(ownerId: string, newPassword: string) {
    const client = await pool.connect();
    try {
      const sql = "UPDATE owners SET owner_password = $1 WHERE owner_id = $2;";
      await client.query(sql, [newPassword, ownerId]);
      return true;
    } catch (err) {
      return err;
    } finally {
      client.release();
    }
  }
}

export default AuthRepositories;
