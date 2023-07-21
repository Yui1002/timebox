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

class Repositories {
  async isOwnerRegistered(email: string) {
    const client = await pool.connect();
    try {
      const sql = "SELECT * FROM owners WHERE email_address = $1;";
      const data = await client.query(sql, [email]);
      return data.rowCount;
    } catch (err) {
      return err;
    } finally {
      client.release();
    }
  }

  async isUserRegistered(username: string) {
    const client = await pool.connect();
    try {
      const sql = "SELECT * FROM users WHERE username = $1;";
      const data = await client.query(sql, [username]);
      return data.rowCount;
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
      return data.rowCount;
    } catch (err) {
      return err;
    } finally {
      client.release();
    }
  }

  async addUser(user: UserInterface) {
    const client = await pool.connect();
    const uuid = uuidv4();

    try {
      const sql =
        "INSERT INTO public.users (user_id, owner_id, first_name, last_name, user_name, rate, rate_type, status, update_date, update_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);";
      const data = await client.query(sql, [
        uuid,
        user.ownerId,
        user.firstName,
        user.lastName,
        user.username,
        user.rate,
        user.rateType,
        user.status,
        user.updateDate,
        user.updateBy,
      ]);
      return data.rowCount;
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

  async getOwnerAuthType(email: string) {
    const client = await pool.connect();

    try {
        const sql = "SELECT owner_password FROM owners WHERE email_address = $1;";
        const data = await client.query(sql, [email]);
        return data.rows[0].owner_password;
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

  async getActivities(ownerId: string) {
    const client = await pool.connect();

    try {
      const sql =
        "SELECT activity_name, status FROM activities WHERE owner_id = $1;";
      const data = await client.query(sql, [ownerId]);
      return data.rows;
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

  async addActivity(activity: ActivityInterface) {
    const uuid = uuidv4();
    const client = await pool.connect();

    try {
        const sql = "INSERT INTO public.activities (activity_id, owner_id, activity_name, rate, rate_type, end_time_required, status, update_date, update_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);";
        const { ownerId, name, rate, rateType, endTimeRequired, status, updateDate, updateBy } = activity;
        const data = await client.query(sql, [uuid, ownerId, name, rate, rateType, endTimeRequired, status, updateDate, updateBy]);
        return data.rowCount;
    } catch (err) {
        return err;
    } finally {
        client.release();
    }
  }

  async checkEmailExists(email: string) {
    const client = await pool.connect();

    try {
        const sql = "SELECT * FROM public.owners WHERE email_address = $1;";
        const data = await client.query(sql, [email]);
        return data.rowCount;
    } catch (err) {
        return err;
    } finally {
        client.release();
    }
  }
}

export default Repositories;
