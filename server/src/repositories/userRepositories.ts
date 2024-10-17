import Repositories from "./repositories";

class UserRepositories extends Repositories {
  constructor() {
    super();
  }

  async getUserId(email: string) {
    const sql = "SELECT user_id FROM users WHERE email_address = $1;";
    const data = (await this.queryDB(sql, [email])).rows;
    return data[0].user_id;
  }

  async getServiceProviderId(email: string) {
    const sql =
      "SELECT id FROM service_provider WHERE EXISTS (SELECT id FROM application_user WHERE email_address = $1);";
    return (await this.queryDB(sql, [email])).rows[0].id;
  }

  async getServiceProviderIds(userId: string) {
    const sql =
      "SELECT service_provider_id FROM user_transaction WHERE employer_user_id = $1;";
    return (await this.queryDB(sql, [userId])).rows[0];
  }

  async getUserTransactionId(employerId: number, serviceProviderId: number) {
    const sql =
      "SELECT user_transaction_id FROM user_transaction WHERE employer_user_id = $1 AND service_provider_id = $2;";
    return (await this.queryDB(sql, [employerId, serviceProviderId])).rows[0]
      .user_transaction_id;
  }

  async checkUserExists(email: string) {
    const sql = "SELECT COUNT (*) FROM users WHERE email_address = $1;";
    return (await this.queryDB(sql, [email])).rowCount > 0;
  }

  // ---------------------  Users  --------------------------------
  async getEmployers(serviceProviderId: string) {
    const sql = `SELECT u.first_name, u.last_name, u.email_address, ut.mode
        FROM users u
        INNER JOIN user_transaction ut
        ON ut.employer_user_id = u.user_id
        WHERE ut.service_provider_id = $1;`;
    return (await this.queryDB(sql, [serviceProviderId])).rows;
  }

  async getServiceProviders(employerId: string) {
    const sql = `SELECT u.first_name, u.last_name, u.email_address, ut.status FROM users u
                  INNER JOIN user_transaction ut ON u.user_id = ut.service_provider_id
                  WHERE employer_user_id = $1;`;
    return (await this.queryDB(sql, [employerId])).rows;
  }

  async getServiceProvider(transactionId: number) {
    const sql = `SELECT
                  ut.rate, ut.rate_type, ut.status,
                  us.day, us.start_time, us.end_time FROM user_transaction ut
                  LEFT JOIN user_schedule us ON ut.user_transaction_id = us.user_transaction_id
                  WHERE ut.user_transaction_id = $1;`;
    const data = await this.queryDB(sql, [transactionId]);
    return data.rows;
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
    await this.queryDB(builder.baseQuery, queryArgs);
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
    console.log("req", req);
    let queryArgs = [];
    queryArgs.push(
      req ? req.day : null,
      req ? req.start_time : null,
      req ? req.end_time : null,
      spId,
      transactionId
    );
    console.log("query args", queryArgs);
    const sql = `INSERT INTO user_schedule
                  VALUES (DEFAULT, $1, $2, $3, $4, $5)
                  ON CONFLICT (day, user_transaction_id) DO UPDATE SET`;
    const builder = this.updateUserScheduleBuilderrQuery(sql, req);
    queryArgs = queryArgs.concat(builder.queryArgs);
    // console.log("query", queryArg);
    await this.queryDB(builder.baseQuery, queryArgs);
  }

  private updateUserScheduleBuilderrQuery(baseQuery: string, req: any) {
    const columnsToUpdate = ["day", "start_time", "end_time"];
    let counter = 6;
    const queryArgs = [];

    for (const col of columnsToUpdate) {
      // if (req[col]) {
      if (req.hasOwnProperty(col)) {
        baseQuery += ` ${col} = $${counter++},`;
        queryArgs.push(req ? [col] : null);
      } else {
        baseQuery += ` ${col} = $${counter++},`;
        queryArgs.push(null);
      }
    }
    baseQuery = baseQuery.substring(0, baseQuery.length - 1);
    console.log('base query', baseQuery)
    console.log('args', queryArgs)
    return { baseQuery: baseQuery + ";", queryArgs };
  }

  async getUser(email: string) {
    const sql =
      "SELECT first_name, last_name, email_address FROM users WHERE email_address = $1;";
    return (await this.queryDB(sql, [email])).rows;
  }

  async deleteServiceProvider(transactionId: string) {
    const sql = "DELETE FROM user_transaction WHERE user_transaction_id = $1;";
    return await this.queryDB(sql, [transactionId]);
  }

  async deleteSchedules(transactionId: string) {
    const sql = "DELETE FROM user_schedule WHERE user_transaction_id = $1;";
    return await this.queryDB(sql, [transactionId]);
  }

  // ---------------------  Record  --------------------------------
  async startRecord(
    start: string,
    email: string,
    transactionId: string,
    mode: string
  ) {
    const d = new Date(start);
    const date = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    const addSql = `INSERT INTO time_record VALUES (
                      DEFAULT, DEFAULT, $1, NULL, CURRENT_TIMESTAMP, $2, $3)
                      RETURNING start_time, end_time;`;
    const overWriteSql = `UPDATE time_record SET start_time = $1, update_by = $2
                            WHERE id_user_transaction = $3 AND start_time::DATE = $4
                            RETURNING start_time, end_time;`;
    if (mode === "add") {
      const data = await this.queryDB(addSql, [start, email, transactionId]);
      return data.rows;
    } else if (mode === "overwrite") {
      const data = await this.queryDB(overWriteSql, [
        start,
        email,
        transactionId,
        date,
      ]);
      return data.rows;
    } else {
      return null;
    }
  }

  async endRecord(start: string, end: string, transactionId: string) {
    const sql = `UPDATE time_record SET end_time = $1
        WHERE id_user_transaction = $2 AND
              start_time::DATE = $3 RETURNING start_time, end_time;`;
    const data = await this.queryDB(sql, [end, transactionId, start]);
    return data.rows;
  }

  async getTodaysRecord(transactionId: number) {
    const sql = `SELECT start_time, end_time
        FROM time_record
        WHERE id_user_transaction = $1 AND
        (start_time::DATE = CURRENT_DATE OR end_time::DATE = CURRENT_DATE);`;
    return (await this.queryDB(sql, [transactionId])).rows;
  }

  async getRecordByPeriod(transactionId: number, from: string, to: string) {
    const sql = `SELECT start_time, end_time
                  FROM time_record
                  WHERE id_user_transaction = $1 AND
                        start_time::DATE >= $2 AND
                        start_time::DATE <= $3;`;
    return (await this.queryDB(sql, [transactionId, from, to])).rows;
  }

  async getRecordByDay(transactionId: number, date: Date) {
    const sql = `SELECT start_time, end_time FROM time_record
                  WHERE id_user_transaction = $1 AND
                        start_time::DATE = $2 OR
                        end_time::DATE = $3;`;
    return (await this.queryDB(sql, [transactionId, date, date])).rows;
  }

  async checkDuplicate2(type: string, date: string, transactionId: string) {
    const d = new Date(date);
    const match = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    const startSql = `SELECT start_time FROM time_record
                  WHERE start_time::DATE = $1 AND id_user_transaction = $2;`;
    const endSql = `SELECT end_time FROM time_record
                  WHERE end_time::DATE = $1 AND id_user_transaction = $2;`;
    if (type === "start") {
      return (await this.queryDB(startSql, [match, transactionId])).rows;
    } else if (type === "end") {
      return (await this.queryDB(endSql, [match, transactionId])).rows;
    } else {
      return null;
    }
  }

  async checkDuplicate(date: string, transactionId: number) {
    const d = new Date(date);
    const match = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    const sql = `SELECT start_time, end_time FROM time_record
                  WHERE start_time::DATE = $1 AND id_user_transaction = $2;`;
    const data = await this.queryDB(sql, [match, transactionId]);
    return data.rows;
  }

  async emailHasBeenSent(receiver: string, sender: number) {
    const sql =
      "SELECT COUNT (*) FROM requests WHERE receiver = $1 AND sender = $2;";
    const data = await this.queryDB(sql, [receiver, sender]);
    return data.rows[0].count > 0;
  }

  async storeRequest(
    receiver: string,
    sender: number,
    rate: number | null,
    rateType: string | null,
    mode: boolean | null,
    shift: {
      day: string;
      startTime: string;
      endTime: string;
    } | null
  ) {
    const sql = `INSERT INTO requests
        VALUES (DEFAULT, $1, $2, NULL, CURRENT_TIMESTAMP, $3, $4, $5, $6, $7, $8);`;
    await this.queryDB(sql, [
      sender,
      receiver,
      rate,
      rateType,
      shift ? shift.day : null,
      shift ? shift.startTime : null,
      shift ? shift.endTime : null,
      mode,
    ]);
    return true;
  }

  async getNotification(receiver: string) {
    const sql = `SELECT
        u.first_name,
        u.last_name,
        u.email_address,
        r.request_date,
        r.request_rate,
        r.request_rate_type,
        r.request_schedule_day,
        r.request_schedule_start_time,
        r.request_schedule_end_time,
        r.request_mode
      FROM users u INNER JOIN requests r on u.user_id = r.sender
      WHERE r.receiver = $1 AND r.is_approved IS NULL;`;
    const data = await this.queryDB(sql, [receiver]);
    return data.rows;
  }

  async updateRequest(sender: number, receiver: string, isApproved: boolean) {
    console.log(sender, receiver, isApproved);
    const sql =
      "UPDATE requests SET is_approved = $1 WHERE sender = $2 AND receiver = $3;";
    await this.queryDB(sql, [isApproved, sender, receiver]);
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
      await this.queryDB(sql, [
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
    await this.queryDB(sql, [
      day,
      start_time,
      end_time,
      serviceProviderId,
      transactionId,
    ]);
  }
}

export default UserRepositories;
