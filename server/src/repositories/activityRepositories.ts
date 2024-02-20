import pkg from "pg";
import { Pool } from "pg";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import { Error } from "../interfaces/ErrorInterface"
dotenv.config();
import { ActivityInterface } from "../interfaces/ActivityInterface";

const pool = new Pool({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: Number(process.env.PORT),
});

class ActivityRepositories {

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

  async getActivityId(ownerId: string, activityName: string) {
    const client = await pool.connect();

    try {
      const sql = "SELECT activity_id FROM public.activities WHERE activity_name = $1 AND owner_id = $2;";
      const data = await client.query(sql, [activityName, ownerId]);
      return data.rows[0].activity_id;
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

  async getActivities(ownerId: string) {
    const client = await pool.connect();

    try {
      const sql =
        "SELECT activity_id, activity_name, rate, rate_type, end_time_required, status FROM public.activities WHERE owner_id = $1;";
      const data = await client.query(sql, [ownerId]);
      return data.rows;
    } catch (err) {
      return err;
    } finally {
      client.release();
    }
  }

  async getSpecificActivity(activity: string, ownerId: string) {
    const client = await pool.connect();
    try {
      const sql = "SELECT activity_id FROM public.activities WHERE owner_id = $1 AND activity_name = $2;";
      const data = await client.query(sql, [ownerId, activity]);
      return data.rows;
    } catch (err) {
      console.log(err)
      return err;
    } finally {
      client.release();
    }
  }

  // async getOwnerPassword(email: string) {
  //   const client = await pool.connect();

  //   try {
  //     const sql =
  //       "SELECT owner_password FROM public.owners WHERE email_address = $1;";
  //     const data = await client.query(sql, [email]);
  //     return data.rows[0].owner_password;
  //   } catch (err) {
  //     return err;
  //   } finally {
  //     client.release();
  //   }
  // }
  async getOwnerPassword(email: string) {
    const sql = "SELECT owner_password FROM public.owners WHERE email_address = $1;"
    const [result, error] = await this.queryAsync(sql, email)
    if (error) {
      return error;
    } else {
      return result.rows[0].owner_password
    }
  }

  async addActivity(activity: ActivityInterface) {
    const uuid = uuidv4();
    const client = await pool.connect();

    try {
        const sql = "INSERT INTO public.activities (activity_id, owner_id, activity_name, rate, rate_type, end_time_required, status, update_date, update_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);";
        const { ownerId, activityName, rate, rateType, endTimeRequired, status, updateDate, updateBy } = activity;
        const data = await client.query(sql, [uuid, ownerId, activityName, rate, rateType, endTimeRequired, status, updateDate, updateBy]);
        return data.rowCount;
    } catch (err) {
        return err;
    } finally {
        client.release();
    }
  }

  async deleteActivity(ownerId: string, activityName: string) {
    const client = await pool.connect();

    try {
      const sql = "DELETE FROM public.activities WHERE owner_id = $1 AND activity_name = $2;";
      const data = await client.query(sql, [ownerId, activityName]);
      return data.rowCount;
    } catch (err) {
      return err;
    } finally {
      client.release();
    }
  }

  async editActivity(req: any, activityId: string) {
    const client = await pool.connect();
    const { activityName, rate, rateType, endTimeRequired, status, updateDate } = req;

    try {
      const sql = "UPDATE public.activities SET activity_name = $1, rate = $2, rate_type = $3, end_time_required = $4, status = $5, update_date = $6 WHERE activity_id = $7;";
      const data = await client.query(sql, [activityName, rate, rateType, endTimeRequired, status, updateDate, activityId]);
      return data.rowCount;
    } catch (err) {
      console.log(err);
      return err;
    } finally {
      client.release();
    }
  }

  // executes async
  // returns generic query result
  // if error occurs, returns null for return and an error object instead
  async queryAsync(sql: string, ...bindingParams: string[]): Promise<[pkg.QueryResult<any>, Error]> {
    const client = await pool.connect();
    try {
      const result = await client.query(sql, bindingParams)
      return [result, null]
    } catch (err) {
      return [null, new Error(err, 500)]
    } finally {
      client.release();
    }
  }
}

export default ActivityRepositories;
