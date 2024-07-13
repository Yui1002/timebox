import UserRepositories from "../repositories/userRepositories";
import { ServiceProviderInterface } from "../interfaces/ServiceProviderInterface";
import dotenv from "dotenv";
dotenv.config();

class UserModels {
  repositories: UserRepositories;

  constructor() {
    this.repositories = new UserRepositories();
  }

  async getEmployers(email: string) {
    const serviceProviderId = await this.repositories.getUserId(email);
    return await this.repositories.getEmployers(serviceProviderId);
  }

  async getEmployerId(email: string) {
    return await this.repositories.getEmployerId(email);
  }

  async getServiceProviderId(email: string) {
    return await this.repositories.getServiceProviderId(email);
  }

  async getServiceProviders(employerEmail: string) {
    const employerId = await this.repositories.getEmployerId(employerEmail);
    return await this.repositories.getServiceProviders(employerId);
  }

  async getUser(username: string) {
    return await this.repositories.getUser(username);
  }

  async addServiceProvider(req: any) {
    const {
      firstName,
      lastName,
      serviceProviderEmail,
      employerEmail,
      rate,
      rateType,
      lists,
    } = req;
    const userId = await this.repositories.addServiceProviderInfo(
      firstName,
      lastName,
      serviceProviderEmail
    );
    const employerId = await this.repositories.getEmployerId(employerEmail);
    const transactionId = await this.repositories.addRateInfo(
      rate,
      rateType,
      employerEmail,
      employerId,
      userId
    );
    return await this.repositories.addSchedule(userId, transactionId, lists);
  }

  async editServiceProvider(req: any) {
    // Frances wants to change
    const {
      email_address,
      updatedFirstName,
      updatedLastName,
      updatedEmail,
      updatedStatus,
    } = req;
    // update users table
    const userId = await this.repositories.getUserId(email_address);
    await this.repositories.updateServiceProviderInfo(
      updatedFirstName,
      updatedLastName,
      updatedEmail,
      updatedStatus
    );
    // update user_transaction table
    // update user_schedule table
  }

  async editUser(req: any) {
    const userId = await this.repositories.getUserId(req.user_name);
    await this.repositories.editUser(req, userId);
    const schedule = await this.repositories.getScheduleByUserId(userId);
    return req.finalShifts.map(
      async (s: { day: string; start_time: string; end_time: number }) => {
        await this.repositories.editSchedule(userId, s);
        // const isMatch = schedule.some((d: any) => d.day === s.day);
        // if (isMatch) {
        //   await this.repositories.editSchedule(userId, s);
        // }
      }
    );
  }

  async deleteServiceProvider(email: string) {
    return false;
  }

  async recordTime(req: any) {
    const { type, employerEmail, serviceProviderEmail } = req;
    const serviceProviderId = await this.repositories.getUserId(
      serviceProviderEmail
    );
    const employerId = await this.repositories.getUserId(employerEmail);
    const userTransactionId = await this.repositories.getUserTransactionId(
      employerId,
      serviceProviderId
    );
    return type === "checkin"
      ? await this.repositories.startRecord(
          serviceProviderEmail,
          userTransactionId,
        )
      : await this.repositories.endRecord(userTransactionId);
  }

  async getTodaysRecord(req: any) {
    const {employerEmail, serviceProviderEmail} = req;
    const serviceProviderId = await this.repositories.getUserId(
      serviceProviderEmail
    );
    const employerId = await this.repositories.getUserId(employerEmail);
    const userTransactionId = await this.repositories.getUserTransactionId(
      employerId,
      serviceProviderId
    );
    return await this.repositories.getTodaysRecord(userTransactionId);
  }

  async getHistory(username: string) {
    const userId = await this.repositories.getUserId(username);
    return await this.repositories.getHistory(userId);
  }

  async getInfoForNanny(username: string) {
    const userId = await this.repositories.getUserId(username);
    return await this.repositories.getInfoForNanny(userId);
  }

  async searchByPeriod(req: any) {
    const { from, to, username } = req;
    const userId = await this.repositories.getUserId(username);
    return await this.repositories.searchByPeriod(from, to, userId);
  }

  async searchByDateYear(req: any) {
    const { year, month, username } = req;
    const userId = await this.repositories.getUserId(username);
    return await this.repositories.searchByDateYear(year, month, userId);
  }

  async getRecord(username: string) {
    const currentYear = new Date().getFullYear().toString();
    const currentMonth = (new Date().getMonth() + 1).toString();
    const userId = await this.repositories.getUserId(username);
    return await this.repositories.searchByDateYear(
      currentYear,
      currentMonth,
      userId
    );
  }
}

export default UserModels;