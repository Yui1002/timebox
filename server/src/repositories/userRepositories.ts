import pkg from "pg";
import { Pool } from "pg";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
dotenv.config();
import { UserInterface } from "../interfaces/UserInterface";

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

class UserRepositories {

  async addUser(user: UserInterface) {
    const client = await pool.connect();
    const uuid = uuidv4();
    const {ownerId, firstName, lastName, username, rate, rateType, status, updateDate, updateBy} = user;

    try {
      const sql =
        "INSERT INTO public.users (user_id, owner_id, first_name, last_name, user_name, rate, rate_type, status, update_date, update_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);";
      const data = await client.query(sql, [
        uuid,
        ownerId,
        firstName,
        lastName,
        username,
        rate,
        rateType,
        status,
        updateDate,
        updateBy,
      ]);
      return true;
    } catch (err) {
      return err;
    } finally {
      client.release();
    }
  }

  async getOwnerId(email: string) {
    const client = await pool.connect();

    try {
      const sql =
        "SELECT owner_id FROM public.owners WHERE email_address = $1;";
      const data = await client.query(sql, [email]);
      return data.rows[0].owner_id;
    } catch (err) {
      return err;
    } finally {
      client.release();
    }
  }

  async getUser(username: string) {
    const client = await pool.connect();

    try {
      const sql = "SELECT * FROM users WHERE user_name=$1;";
      const data = await client.query(sql, [username]);
      return data.rows;
    } catch (err) {
      return err;
    } finally {
      client.release();
    }
  }

  async getUsers(ownerId: string) {
    const client = await pool.connect();

    try {
      const sql =
        "SELECT first_name, last_name, user_name, rate, rate_type, status FROM users WHERE owner_id = $1;";
      const data = await client.query(sql, [ownerId]);
      return data.rows;
    } catch (err) {
      return err;
    } finally {
      client.release();
    }
  }

  async editUser(req: any, userId: string) {
    const {firstName, lastName, username, rate, rateType, status, updateDate} = req;
    const client = await pool.connect();
    try {
        const sql = "UPDATE public.users SET first_name=$1, last_name=$2, user_name=$3, rate=$4, rate_type=$5, status=$6, update_date=$7 WHERE user_id=$8;";
        const data = await client.query(sql, [firstName, lastName, username, rate, rateType, status, updateDate, userId]);
        return true;
    } catch (err) {
        return err;
    } finally {
        client.release();
    }
  }

  async getUserId(username: string) {
    const client = await pool.connect();
    try {
        const sql = "SELECT user_id FROM public.users WHERE user_name=$1;";
        const data = await client.query(sql, [username]);
        return data.rows[0].user_id;
    } catch (err) {
        return err;
    } finally {
        client.release();
    }
  }

  async isUserRegistered(ownerId: string, username: string) {
    const client = await pool.connect();
    try {
      const sql = "SELECT * FROM users WHERE owner_id = $1 AND user_name = $2;";
      const data = await client.query(sql, [ownerId, username]);
      return data.rowCount > 0;
    } catch (err) {
      return err;
    } finally {
      client.release();
    }
  }

  async deleteUser(ownerId: string, username: string) {
    const client = await pool.connect();
    try {
      const sql = "DELETE FROM users WHERE owner_id = $1 AND user_name = $2;";
      const data = await client.query(sql, [ownerId, username]);
      return true;
    } catch (err) {
      return err;
    } finally {
      client.release();
    }
  }

  async startRecord(userId: string) {
    const client = await pool.connect();
    const uuid = uuidv4();

    try {
      const sql = "INSERT INTO time_record VALUES ($1, $2, $3, $4, CURRENT_DATE, CURRENT_TIME, $5, $6, CURRENT_TIMESTAMP, $7);";
      await client.query(sql, [uuid, null, userId, 1, null, null, userId]);
      return true;
    } catch (err) {
      return err;
    } finally {
      client.release();
    }
  }

  async endRecord(userId: string) {
    const client = await pool.connect();
    const uuid = uuidv4();
    return 1;
    // try {
    //   const sql = "INSERT INTO time_record VALUES ($1, $2, $3, $4)"
    // }
  }
}

export default UserRepositories;
