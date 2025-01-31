import dotenv from "dotenv";
import JSHelperInstance from "../helpers/JsonConverterHelper";
import ResponseException from "../models/ResponseException";
import {
  GetServiceProviderRs,
  UpdateServiceProviderRq,
} from "../models/ServiceProvider";
import { GetUserTransactionRs } from "../models/UserTransaction";
import { GetUserScheduleRs } from "../models/UserSchedule";
import Repositories from "./repositories";
dotenv.config();


interface IServiceProviderRepo {
  getServiceProvider(employerId: number): Promise<GetServiceProviderRs>;
}

class ServiceProviderRepo extends Repositories implements IServiceProviderRepo {
  public async getServiceProvider(employerId: number): Promise<GetServiceProviderRs> {
    try {
      const sql = `SELECT 
                    u2.user_id AS id, 
                    u2.first_name, 
                    u2.last_name, 
                    u2.email_address AS email, 
                    u2.status,
                    ut.rate,
                    ut.rate_type,
                    ut.mode AS allow_edit,
                    us.user_schedule_id AS schedule_id,
                    us.day,
                    us.start_time,
                    us.end_time
                FROM user_transaction ut
                INNER JOIN users u ON u.user_id = ut.employer_user_id
                INNER JOIN users u2 ON u2.user_id = ut.service_provider_id
                LEFT JOIN user_schedule us ON ut.user_transaction_id = us.user_transaction_id
                WHERE u.user_id = $1`;
      const data = await this.queryDB(sql, [employerId]);
      console.log('data', data)
      if (data?.rows.length <= 0) {
        return null;
      }

      console.log('data original', data)
      return JSHelperInstance._converter.deserializeObject(data, GetServiceProviderRs);
    } catch (e) {
      console.log(e);
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
    serviceProvider: UpdateServiceProviderRq,
    transactionId: number
  ): Promise<void> {
    try {
      const sql =
        "UPDATE user_transaction SET rate = $1, rate_type = $2, update_date = CURRENT_TIMESTAMP WHERE user_transaction_id = $3";
      await this.queryDB(sql, [
        serviceProvider.rate,
        serviceProvider.rateType,
        transactionId,
      ]);
    } catch (e) {
      throw new ResponseException(e, 500, "unable to update db");
    }
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
