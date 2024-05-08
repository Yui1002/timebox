import { v4 as uuidv4 } from "uuid";
import Repositories from "./repositories";

class UserRepositories {
  repositories: Repositories;

  constructor() {
    this.repositories = new Repositories();
  }

  // ---------------------  Owners  --------------------------------
  async getOwnerId(email: string) {
    const sql = "SELECT owner_id FROM public.owners WHERE email_address = $1;";
    return (await this.repositories.queryDB(sql, [email])).rows[0].owner_id;
  }

  // ---------------------  Users  --------------------------------
  async getUsers(ownerId: string) {
    const sql =
      "SELECT first_name, last_name, user_name, rate, rate_type, status, day, start_time, end_time FROM users u LEFT JOIN users_schedule us ON u.user_id = us.user_id WHERE u.owner_id = $1 ORDER BY update_date DESC;";
    return (await this.repositories.queryDB(sql, [ownerId])).rows;
  }

  async getUser(username: string) {
    const sql = "SELECT * FROM users WHERE user_name=$1;";
    return (await this.repositories.queryDB(sql, [username])).rows;
  }

  async getUserId(username: string) {
    const sql = "SELECT user_id from users WHERE user_name = $1;";
    return (await this.repositories.queryDB(sql, [username])).rows[0].user_id;
  }

  async getInfoForNanny(userId: string) {
    const sql =
      "SELECT rate, rate_type, day, start_time, end_time FROM users u INNER join users_schedule us ON u.user_id = us.user_id where u.user_id = $1;";
    return (await this.repositories.queryDB(sql, [userId])).rows;
  }

  async addUser(user: any, ownerId: string) {
    const uuid = uuidv4();
    const { username, rate, rateType, ownerEmail } = user;
    const sql =
      "INSERT INTO public.users (user_id, owner_id, first_name, last_name, user_name, rate, rate_type, status, update_date, update_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING user_id;";
    return (
      await this.repositories.queryDB(sql, [
        uuid,
        ownerId,
        null,
        null,
        username,
        rate,
        rateType,
        "active",
        new Date(),
        ownerEmail,
      ])
    ).rows[0].user_id;
  }

  async editUser(req: any, userId: string) {
    const {
      updatedUsername,
      updatedRate,
      updatedRateType,
      updatedStatus,
      finalShifts,
    } = req;
    const sql =
      "UPDATE public.users SET first_name=$1, last_name=$2, user_name=$3, rate=$4, rate_type=$5, status=$6, update_date=$7 WHERE user_id=$8;";
    await this.repositories.queryDB(sql, [
      null,
      null,
      updatedUsername,
      updatedRate,
      updatedRateType,
      updatedStatus,
      finalShifts,
      userId,
    ]);
    return true;
  }

  async deleteUser(ownerId: string, userId: string) {
    const deleteUserSql =
      "DELETE FROM users WHERE owner_id = $1 AND user_id = $2;";
    await this.repositories.queryDB(deleteUserSql, [ownerId, userId]);
    return true;
  }

  async isUserRegistered(ownerId: string, username: string) {
    const sql = "SELECT * FROM users WHERE owner_id = $1 AND user_name = $2;";
    return (await this.repositories.queryDB(sql, [ownerId, username])).rowCount > 0;
  }

  // ---------------------  Schedule  --------------------------------
  async getScheduleByUserId(userId: string) {
    const sql =
      "SELECT day, start_time, end_time FROM public.users_schedule WHERE user_id=$1;";
    return (await this.repositories.queryDB(sql, [userId])).rows;
  }

  async addSchedule(userId: string, schedules: []) {
    const sql =
      "INSERT INTO public.users_schedule VALUES ($1, $2, $3, $4, $5);";
    const premises = schedules.map(async ({ day, start, end }) => {
      await this.repositories.queryDB(sql, [uuidv4(), userId, day, start, end]);
    });
    return await Promise.all(premises).then(() => {
      return true;
    });
  }

  async editSchedule(userId: string, shift: any) {
    const uuid = uuidv4();
    const sql =
      "INSERT INTO users_schedule VALUES ($1, $2, $3, $4, $5) ON DUPLICATE KEY UPDATE day = $6, start_time = $7, end_time = $8;";
    await this.repositories.queryDB(sql, [uuid, userId, shift.day, shift.start_time, shift.end_time])
    return true;
  }

  async deleteSchedule(userId: string) {
    const sql = "DELETE FROM users_schedule WHERE user_id = $1;";
    await this.repositories.queryDB(sql, [userId]);
    return true;
  }

  // ---------------------  Record  --------------------------------
  async startRecord(userId: string, checkedInTime: string) {
    const uuid = uuidv4();
    const sql =
      "INSERT INTO time_record VALUES ($1, $2, $3, $4, CURRENT_DATE, $5, $6, $7, CURRENT_TIMESTAMP, $8, $9)";
    await this.repositories.queryDB(sql, [
      uuid,
      null,
      userId,
      null,
      checkedInTime,
      null,
      "active",
      userId,
      null,
    ]);
    return true;
  }

  async endRecord(userId: string, checkedOutTime: string) {
    const sql =
      "SELECT time_record_id FROM time_record WHERE user_id = $1 AND record_date = CURRENT_DATE;";
    const sql2 =
      "UPDATE time_record SET end_time = $1, update_by = $2, update_date = CURRENT_TIMESTAMP WHERE time_record_id = $3;";
    const id = (await this.repositories.queryDB(sql, [userId])).rows[0].time_record_id;
    await this.repositories.queryDB(sql2, [checkedOutTime, userId, id]);
    return true;
  }

  async getTodaysRecord(userId: string) {
    const sql =
      "SELECT start_time, end_time FROM time_record WHERE user_id = $1 AND record_date = CURRENT_DATE;";
    return (await this.repositories.queryDB(sql, [userId])).rows;
  }

  async getHistory(userId: string) {
    const sql =
      "SELECT record_date, record_time FROM time_record WHERE user_id = $1;";
    return (await this.repositories.queryDB(sql, [userId])).rows;
  }

  async searchByPeriod(from: string, to: string, userId: string) {
    const sql =
      "SELECT record_date, start_time, end_time FROM time_record WHERE user_id = $1 AND record_date >= $2 AND record_date <= $3;";
    return (await this.repositories.queryDB(sql, [userId, from, to])).rows;
  }
}

export default UserRepositories;
