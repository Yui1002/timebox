import Repositories from "./repositories";

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
    const sql =
      "SELECT service_provider_id FROM user_transaction WHERE employer_user_id = $1;";
    return (await this.repositories.queryDB(sql, [userId])).rows[0];
  }

  async getUserTransactionId(employerId: number, serviceProviderId: number) {
    const sql =
      "SELECT user_transaction_id FROM user_transaction WHERE employer_user_id = $1 AND service_provider_id = $2;";
    return (
      await this.repositories.queryDB(sql, [employerId, serviceProviderId])
    ).rows[0].user_transaction_id;
  }

  async checkUserExists(email: string) {
    const sql = "SELECT COUNT (*) FROM users WHERE email_address = $1;";
    return (await this.repositories.queryDB(sql, [email])).rowCount > 0;
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
    const sql = `SELECT u.first_name, u.last_name, u.email_address FROM users u
                  INNER JOIN user_transaction ut ON u.user_id = ut.service_provider_id
                  WHERE employer_user_id = $1;`
    return (await this.repositories.queryDB(sql, [employerId])).rows;
  }

  async getServiceProvider(transactionId: string) {
    const sql = `SELECT ut.rate, ut.rate_type, ut.status, us.day, us.start_time, us.end_time FROM user_transaction ut
                  INNER JOIN user_schedule us ON ut.user_transaction_id = us.user_transaction_id
                  WHERE ut.user_transaction_id = $1;`;
    return (await this.repositories.queryDB(sql, [transactionId])).rows;
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

  /**
   * First get the original user transaction
   * @param req {key: value}
   */
  async updateUserTransaction(req: any) {
    let queryArgs = [];
    queryArgs.push(req.employer_user_id, req.service_provider_id);
    const sql = `INSERT INTO user_transaction
                  VALUES (DEFAULT, 10, 'hourly', NULL, DEFAULT, CURRENT_TIMESTAMP, 'whoever', $1, $2, NULL)
                  ON CONFLICT (employer_user_id, service_provider_id) DO UPDATE SET`;
    const builder = this.updateUserBuilderQuery(sql, req);
    queryArgs = queryArgs.concat(builder.queryArgs);
    await this.repositories.queryDB(builder.baseQuery, queryArgs);
    return true;
  }

  private updateUserBuilderQuery(
    baseQuery: string,
    req: any
  ): { baseQuery: string; queryArgs: any } {
    const columnsToUpdate = ["rate", "rate_type", "status"];
    const queryArgs = [];
    let counter = 3;

    for (const col of columnsToUpdate) {
      if (req[col]) {
        baseQuery += ` ${col} = $${counter++},`;
        queryArgs.push(req[col]);
      }
    }
    baseQuery = baseQuery.substring(0, baseQuery.length - 1);
    return { baseQuery: baseQuery + ";", queryArgs };
  }

  async updateUserSchedule(req: any, spId: string, transactionId: number) {
    let queryArgs = [];
    queryArgs.push(req.day, req.start_time, req.end_time, spId, transactionId);
    const sql = `INSERT INTO user_schedule
                  VALUES (DEFAULT, $1, $2, $3, $4, $5)
                  ON CONFLICT (day, user_transaction_id) DO UPDATE SET`;
    const builder = this.updateUserScheduleBuilderrQuery(sql, req);
    queryArgs = queryArgs.concat(builder.queryArgs);
    await this.repositories.queryDB(builder.baseQuery, queryArgs)
  }

  private updateUserScheduleBuilderrQuery(baseQuery: string, req: any) {
    const columnsToUpdate = ['day', 'start_time', 'end_time'];
    let counter = 6;
    const queryArgs = [];

    for (const col of columnsToUpdate) {
      if (req[col]) {
        baseQuery += ` ${col} = $${counter++},`;
        queryArgs.push(req[col]);
      }
    }
    baseQuery = baseQuery.substring(0, baseQuery.length - 1);
    return { baseQuery: baseQuery + ";", queryArgs };
  }

  async getUser(email: string) {
    const sql =
      "SELECT first_name, last_name, email_address FROM users WHERE email_address = $1;";
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

  async deleteServiceProvider(transactionId: number) {
    const sql = "DELETE FROM user_transaction WHERE user_transaction_id = $1;";
    return await this.repositories.queryDB(sql, [transactionId]);
  }

  async deleteSchedules(transactionId: number) {
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
      "INSERT INTO time_record (status, start_time, end_time, update_date, update_by, id_user_transaction) VALUES (DEFAULT, CURRENT_TIMESTAMP, NULL, CURRENT_TIMESTAMP, $1, $2) RETURNING start_time";
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
    const sql =
      "SELECT start_time, end_time FROM time_record WHERE id_user_transaction = $1 AND (start_time::DATE = CURRENT_DATE AND end_time::DATE = CURRENT_DATE);";
    return (await this.repositories.queryDB(sql, [transactionId])).rows[0];
  }

  async getRecordByPeriod(transactionId: string, from: string, to: string) {
    const sql =
      "SELECT start_time, end_time FROM time_record WHERE id_user_transaction = $1 AND start_time::DATE >= $2 AND start_time::DATE <= $3;";
    return (await this.repositories.queryDB(sql, [transactionId, from, to]))
      .rows;
  }

  async searchByDateYear(year: string, month: string, userId: string) {
    const sql =
      "SELECT start_time, end_time FROM time_record_v2 WHERE date_part('year', start_time) = $1 AND date_part('month', start_time) = $2 AND user_id = $3;";
    const data = (await this.repositories.queryDB(sql, [year, month, userId]))
      .rows;
    return data;
  }

  async emailHasBeenSent(receiver: string, sender: number) {
    const sql =
      "SELECT COUNT (*) FROM requests WHERE receiver = $1 AND sender = $2;";
    const data = await this.repositories.queryDB(sql, [receiver, sender]);
    return data.rows[0].count > 0;
  }

  async storeRequest(
    receiver: string,
    sender: number,
    rate: number,
    rateType: number,
    request: any
  ) {
    const sql =
      "INSERT INTO requests (sender, receiver, is_approved, request_date, request_rate, request_rate_type, request_schedule_day, request_schedule_start_time, request_schedule_end_time) VALUES ($1, $2, NULL, CURRENT_TIMESTAMP, $3, $4, $5, $6, $7);";
    await this.repositories.queryDB(sql, [
      sender,
      receiver,
      rate ? rate : null,
      rateType ? rateType : null,
      request ? request.day : null,
      request ? request.startTime : null,
      request ? request.endTime : null,
    ]);
    return true;
  }

  async getNotification(receiver: string) {
    const sql =
      "SELECT u.first_name, u.last_name, u.email_address, r.request_rate, r.request_rate_type, r.request_schedule_day, r.request_schedule_start_time, r.request_schedule_end_time FROM users u INNER JOIN requests r on u.user_id = r.sender WHERE r.receiver = $1 AND r.is_approved IS NULL;";
    const data = await this.repositories.queryDB(sql, [receiver]);
    return data.rows;
  }

  async updateRequest(sender: number, receiver: string, isApproved: boolean) {
    const sql =
      "UPDATE requests SET is_approved = $1 WHERE sender = $2 AND receiver = $3;";
    await this.repositories.queryDB(sql, [isApproved, sender, receiver]);
    return true;
  }

  async addToUserTransaction(
    employerId: number,
    serviceProviderId: number,
    request: any,
    receiver: string
  ) {
    const { request_rate, request_rate_type } = request;
    const sql =
      "INSERT INTO user_transaction (rate, rate_type, currency, status, update_date, update_by, employer_user_id, service_provider_id, mode) VALUES ($1, $2, NULL, DEFAULT, CURRENT_TIMESTAMP, $3, $4, $5, $6) RETURNING user_transaction_id;";
    const transactionId = (
      await this.repositories.queryDB(sql, [
        request_rate,
        request_rate_type,
        receiver,
        employerId,
        serviceProviderId,
        null,
      ])
    ).rows[0].user_transaction_id;
    return transactionId;
  }

  async addToUserSchedule(
    schedule: any,
    serviceProviderId: number,
    transactionId: number
  ) {
    const { day, start_time, end_time } = schedule;
    const sql =
      "INSERT INTO user_schedule (day, start_time, end_time, service_provider_id, user_transaction_id) VALUES ($1, $2, $3, $4, $5);";
    await this.repositories.queryDB(sql, [
      day,
      start_time,
      end_time,
      serviceProviderId,
      transactionId,
    ]);
  }
}

export default UserRepositories;
