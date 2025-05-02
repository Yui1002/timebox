import dotenv from "dotenv";
import JSHelperInstance from "../helpers/JsonConverterHelper";
import ResponseException from "../models/ResponseException";
import {
  GetServiceProviderRs,
  UpdateServiceProviderRq,
  GetInactiveServiceProviderRs,
  GetServiceProviderRsMini
} from "../models/ServiceProvider";
import { GetUserTransactionRs } from "../models/UserTransaction";
import { GetUserScheduleRs } from "../models/UserSchedule";
import Repositories from "./Repositories";
dotenv.config();


interface IServiceProviderRepo {
  getServiceProvider(employerId: number): Promise<GetServiceProviderRs>;
  getInactiveServiceProvider(senderEmail: string): Promise<GetServiceProviderRs>;
  updateUserTransaction(fieldsToUpdate: Partial<UpdateServiceProviderRq>, transactionId: number): Promise<void>;
}

class ServiceProviderRepo extends Repositories implements IServiceProviderRepo {

  public async getServiceProvider(employerId: number): Promise<GetServiceProviderRs> {
    try {
      const sql = `SELECT 
                    u.user_id AS id, 
                    u.first_name,
                    u.last_name,
                    u.email_address AS email,
                    u.status,
                    ut.rate,
                    ut.rate_type,
                    ut.mode AS allow_edit,
                    us.user_schedule_id AS schedule_id
                  FROM users u
                  INNER JOIN user_transaction ut ON u.user_id = ut.service_provider_id
                  LEFT JOIN user_schedule us ON us.service_provider_id = ut.service_provider_id
                  WHERE ut.employer_user_id = $1;`;
      const data = await this.queryDB(sql, [employerId]);
      if (data?.rows.length <= 0) {
        return null;
      }
      return JSHelperInstance._converter.deserializeObject(data, GetServiceProviderRs);
    } catch (e) {
      throw new ResponseException(e, 500, "unable to get from db");
    }
  } 

  async getInactiveServiceProvider(senderEmail: string): Promise<GetServiceProviderRs> {
    try {
      const sql = `SELECT DISTINCT 
                    u.user_id AS id,
                    u.first_name,
                    u.last_name,
                    r.receiver_email AS email,
                    r.status,
                    r.request_rate AS rate,
                    r.request_rate_type AS rate_type,
                    r.request_mode
                  FROM users u 
                  RIGHT JOIN requests r ON u.email_address = r.receiver_email
                  WHERE r.status IN ('PENDING', 'REJECTED') AND r.sender_email = $1;`;
      const data = await this.queryDB(sql, [senderEmail]);
      if (data?.rows.length <= 0) {
        return null;
      }
      return JSHelperInstance._converter.deserializeObject(data, GetServiceProviderRs);
    } catch (e: any) {
      throw new ResponseException(e, 500, "unable to get from db");
    }
  }

  public async getTransaction(employerId: number, serviceProviderId: number) {
    try {
      const sql =
        "SELECT user_transaction_id AS id, rate, rate_type, status, mode FROM user_transaction WHERE employer_user_id = $1 AND service_provider_id = $2;";
      const data = await this.queryDB(sql, [employerId, serviceProviderId]);
      if (data?.rows.length <= 0) {
        return null;
      }

      return JSHelperInstance._converter.deserializeObject(
        data?.rows[0],
        GetUserTransactionRs
      );
    } catch (e) {
      throw new ResponseException(e, 500, "unable to get from db");
    }
  }

  public async updateUserTransaction(
    fieldsToUpdate: Partial<UpdateServiceProviderRq>,
    transactionId: number
  ): Promise<void> {
    try {
      const sql = this.buildUpdateQuery(fieldsToUpdate, "user_transaction", "user_transaction_id");
      await this.queryDB(sql, [...Object.values(fieldsToUpdate), transactionId]);
    } catch (e) {
      throw new ResponseException(e, 500, "unable to update db");
    }
  }

  private buildUpdateQuery(fields: Partial<UpdateServiceProviderRq>, tableName: string, idColumn: string): string {
    const columns = Object.keys(fields);
    if (columns.length === 0) {
      throw new ResponseException(null, 500, 'No fields to update');
    }

    const setClause = columns.map((col, index) => `${col} = $${index+1}`).join(", ");
    const finalClause = `${setClause}, update_date = CURRENT_TIMESTAMP`

    return `UPDATE ${tableName} SET ${finalClause} WHERE ${idColumn} = $${columns.length+1}`;
  }

  public async getSchedule(scheduleId: number): Promise<GetUserScheduleRs> {
    try {
        const sql = "SELECT user_schedule_id AS id, day, start_time, end_time FROM user_schedule WHERE user_schedule_id = $1;";
        const data = await this.queryDB(sql, [scheduleId]);
        if (data?.rows.length <= 0) {
            return null;
        }

        return JSHelperInstance._converter.deserializeObject(data?.rows[0], GetUserScheduleRs)
    } catch (e) {
        throw new ResponseException(e, 500, 'unable to get from db');
    }
  }

  public async updateSchedule(fieldsToUpdate: {}, scheduleId: number): Promise<void> {
    try {
      const sql = this.updateScheduleBuilder(fieldsToUpdate);
      await this.queryDB(sql, [...Object.values(fieldsToUpdate), scheduleId]);
    } catch (e) {
      throw new ResponseException(e, 500, "unable to update db");
    }
  }

  public updateScheduleBuilder(req: any) {
    const columnsToUpdate = ['day', 'start_time', 'end_time'];
    let query = 'UPDATE user_schedule SET';
    let counter = 1;

    for (const col of columnsToUpdate) {
        if (req[col]) {
            query += ` ${col} = $${counter++},`;
        } 
    }
    query = `${query.substring(0, query.length - 1)} WHERE user_schedule_id = $${counter}`;
    return query;
  }

  public async deleteSchedule(scheduleId: number) {
    try {
        const sql = "DELETE FROM user_schedule WHERE user_schedule_id = $1;";
        await this.queryDB(sql, [scheduleId]);
    } catch (e) {
        throw new ResponseException(e, 500, 'unable to delete from db');
    }
  }
}

export default ServiceProviderRepo;
