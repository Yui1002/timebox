import { v4 as uuidv4 } from "uuid";
import Repositories from "./repositories";
import { ServiceProviderInterface } from "../interfaces/ServiceProviderInterface";

class UserRepositories {
  repositories: Repositories;

  constructor() {
    this.repositories = new Repositories();
  }

  // ---------------------  Owners  -------------------------------
  async getUserId(email: string) {
    const sql = "SELECT user_id FROM users WHERE email_address = $1;";
    const data = (await this.repositories.queryDB(sql, [email])).rows;
    return data[0].user_id;
  }

  async getEmployerId(email: string) {
    const sql = "SELECT user_id FROM users WHERE email_address = $1;";
    return (await this.repositories.queryDB(sql, [email])).rows[0].user_id;
  }

  async getServiceProviderId(email: string) {
    const sql =
      "SELECT id FROM service_provider WHERE EXISTS (SELECT id FROM application_user WHERE email_address = $1);";
    return (await this.repositories.queryDB(sql, [email])).rows[0].id;
  }

  async getServiceProviderIds(userId: string) {
    const sql = "SELECT service_provider_id FROM user_transaction WHERE employer_user_id = $1;";
    return (await this.repositories.queryDB(sql, [userId])).rows[0];
  }

  async getUserTransactionId(employerId: string, serviceProviderId: string) {
    const sql =
      "SELECT user_transaction_id FROM user_transaction WHERE employer_user_id = $1 AND service_provider_id = $2;";
    return (
      await this.repositories.queryDB(sql, [employerId, serviceProviderId])
    ).rows[0].user_transaction_id;
  }

  async checkUserExists(email: string) {
    const sql = "SELECT COUNT (*) FROM users WHERE email_address = $1;";
    return (await this.repositories.queryDB(sql, [email])).rowCount > 0
  }

  // ---------------------  Users  --------------------------------
  async getEmployers(serviceProviderId: string) {
    const sql =
      "SELECT u.first_name, u.last_name, u.email_address FROM users u INNER JOIN user_transaction ut ON ut.employer_user_id = u.user_id WHERE ut.service_provider_id = $1;";
    return (await this.repositories.queryDB(sql, [serviceProviderId])).rows;
  }

  async getUsers(ownerId: string) {
    const sql =
      "SELECT first_name, last_name, user_name, rate, rate_type, status, day, start_time, end_time FROM users u LEFT JOIN users_schedule us ON u.user_id = us.user_id WHERE u.owner_id = $1 ORDER BY update_date DESC;";
    return (await this.repositories.queryDB(sql, [ownerId])).rows;
  }

  async getServiceProviders(employerId: string) {
    const sql = "SELECT u.first_name, u.last_name, u.email_address, ut.rate, ut.rate_type, us.day, us.start_time, us.end_time FROM users u INNER JOIN user_transaction ut ON u.user_id = ut.service_provider_id INNER JOIN user_schedule us ON ut.service_provider_id = us.service_provider_id WHERE employer_user_id = $1;";
    return (await this.repositories.queryDB(sql, [employerId])).rows;
  }

  async addServiceProviderInfo(
    firstName: string,
    lastName: string,
    email: string
  ) {
    const sql =
      "INSERT INTO users VALUES (gen_random_uuid(), $1, $2, $3, NULL, DEFAULT, CURRENT_TIMESTAMP) RETURNING user_id;";
    return (await this.repositories.queryDB(sql, [firstName, lastName, email]))
      .rows[0].user_id;
  }

  async updateServiceProviderInfo(
    firstName: string,
    lastName: string,
    email: string,
    status: string
  ) {
    const sql =
      "UPDATE users SET first_name = $1, last_name = $2, email_address = $3, status = $4 WHERE user_id = $5;";
    await this.repositories.queryDB(sql, [firstName, lastName, email, status]);
    return true;
  }

  async addRateInfo(
    rate: string,
    rateType: string,
    employerEmail: string,
    employerId: string,
    serviceProviderId: string
  ) {
    const sql =
      "INSERT INTO user_transaction VALUES (gen_random_uuid(), $1, $2, $3, DEFAULT, CURRENT_TIMESTAMP, $4, $5, $6) RETURNING user_transaction_id;";
    return (
      await this.repositories.queryDB(sql, [
        Number(rate),
        rateType,
        null,
        employerEmail,
        employerId,
        serviceProviderId,
      ])
    ).rows[0].user_transaction_id;
  }

  async updateRateInfo(
    rate: string,
    rateType: string,
    status: string,
    serviceProviderId: string
  ) {
    const sql =
      "UPDATE user_transaction SET rate = $1, rate_type = $2, status = $3, update_date = CURRENT_TIMESTAMP WHERE service_provider_id = $4;";
    await this.repositories.queryDB(sql, [
      rate,
      rateType,
      status,
      serviceProviderId,
    ]);
    return true;
  }

  async updateSchedule() {
    const sql = "UPDATE user_schedule SET ";
  }

  async getUser(email: string) {
    const sql = "SELECT first_name, last_name, email_address FROM users WHERE email_address = $1;";
    return (await this.repositories.queryDB(sql, [email])).rows;
  }

  async addUser(user: any, ownerId: string) {
    const { username, rate, rateType, ownerEmail } = user;
    const sql =
      "INSERT INTO users VALUES (uuid_generate_v4(), $1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING user_id;";
    return (
      await this.repositories.queryDB(sql, [
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
    const { updatedUsername, updatedRate, updatedRateType, updatedStatus } =
      req;
    const sql =
      "UPDATE users SET first_name=$1, last_name=$2, user_name=$3, rate=$4, rate_type=$5, status=$6, update_date=$7 WHERE user_id=$8;";
    await this.repositories.queryDB(sql, [
      null,
      null,
      updatedUsername,
      updatedRate,
      updatedRateType,
      updatedStatus,
      new Date(),
      userId,
    ]);
    return true;
  }

  async deleteServiceProvider(transactionId: string) {
    const sql = "DELETE FROM user_transaction WHERE user_transaction_id = $1;";
    return await this.repositories.queryDB(sql, [transactionId]);
  }

  async deleteSchedules(transactionId: string) {
    const sql = "DELETE FROM user_schedule WHERE user_transaction_id = $1;";
    return await this.repositories.queryDB(sql, [transactionId]);
  }

  async isUserRegistered(ownerId: string, username: string) {
    const sql = "SELECT * FROM users WHERE owner_id = $1 AND user_name = $2;";
    return (
      (await this.repositories.queryDB(sql, [ownerId, username])).rowCount > 0
    );
  }

  // ---------------------  Schedule  --------------------------------
  async getScheduleByUserId(userId: string) {
    const sql =
      "SELECT day, start_time, end_time FROM public.users_schedule WHERE user_id=$1;";
    return (await this.repositories.queryDB(sql, [userId])).rows;
  }

  async addSchedule(userId: string, serviceProviderId: string, schedules: []) {
    const sql =
      "INSERT INTO user_schedule VALUES (gen_random_uuid(), $1, $2, $3, $4, $5);";
    const premises = schedules.map(async ({ day, start, end }) => {
      await this.repositories.queryDB(sql, [
        userId,
        day,
        start,
        end,
        serviceProviderId,
      ]);
    });
    return await Promise.all(premises).then(() => {
      return true;
    });
  }

  async editSchedule(userId: string, shift: any) {
    const { day, start_time, end_time } = shift;
    const sql =
      "INSERT INTO users_schedule VALUES (uuid_generate_v4(), $1, $2, $3, $4) ON CONFLICT (user_id, day) DO UPDATE SET start_time = $5, end_time = $6;";
    await this.repositories.queryDB(sql, [
      userId,
      day,
      start_time,
      end_time,
      start_time,
      end_time,
    ]);
    return true;
  }

  // ---------------------  Record  --------------------------------
  async startRecord(serviceProviderEmail: string, transactionId: string) {
    const sql =
      "INSERT INTO time_record VALUES (gen_random_uuid(), DEFAULT, CURRENT_TIMESTAMP, $1, $2, CURRENT_TIMESTAMP, NULL) RETURNING start_time;";
    return (
      await this.repositories.queryDB(sql, [
        serviceProviderEmail,
        transactionId,
      ])
    ).rows[0].start_time;
  }

  async endRecord(transactionId: string) {
    const sql =
      "UPDATE time_record SET end_time = CURRENT_TIMESTAMP WHERE id_user_transaction = $1 AND start_time::DATE = CURRENT_DATE RETURNING end_time;";
    return (await this.repositories.queryDB(sql, [transactionId])).rows[0]
      .end_time;
  }

  async getTodaysRecord(transactionId: string) {
    const sql = "SELECT start_time, end_time FROM time_record WHERE id_user_transaction = $1 AND (start_time::DATE = CURRENT_DATE AND end_time::DATE = CURRENT_DATE);";
    return (await this.repositories.queryDB(sql, [transactionId])).rows[0];
  }

  async getRecordByPeriod(transactionId: string, from: string, to: string) {
    const sql = "SELECT start_time, end_time FROM time_record WHERE id_user_transaction = $1 AND start_time::DATE >= $2 AND start_time::DATE <= $3;";
    return (await this.repositories.queryDB(sql, [transactionId, from, to])).rows;
  }

  async searchByPeriod(from: string, to: string, userId: string) {
    const sql =
      "SELECT start_time, end_time FROM time_record WHERE user_id = $1 AND start_time::DATE >= $2 AND start_time::DATE <= $3;";
    return (await this.repositories.queryDB(sql, [userId, from, to])).rows;
  }

  async searchByDateYear(year: string, month: string, userId: string) {
    const sql =
      "SELECT start_time, end_time FROM time_record_v2 WHERE date_part('year', start_time) = $1 AND date_part('month', start_time) = $2 AND user_id = $3;";
    const data = (await this.repositories.queryDB(sql, [year, month, userId]))
      .rows;
    return data;
  }

  async emailHasBeenSent(email: string, addedBy: string) {
    const sql = "SELECT * FROM email_user_sent WHERE email = $1 AND added_by = $2;";
    return (await this.repositories.queryDB(sql, [email, addedBy])).rowCount > 0;
  }
}

export default UserRepositories;
