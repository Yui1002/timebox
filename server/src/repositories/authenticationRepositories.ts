import pkg from "pg";
import { Pool } from "pg";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
dotenv.config();
import { OwnerInterface } from "../interfaces/OwnerInterface";
import { UserInterface } from "../interfaces/UserInterface";
import { ActivityInterface } from "../interfaces/ActivityInterface";

const pool = new Pool({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: Number(process.env.PORT),
});

class AuthenticationRepositories {
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
}

export default AuthenticationRepositories;
