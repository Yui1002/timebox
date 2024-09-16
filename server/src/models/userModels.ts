import UserRepositories from "../repositories/userRepositories";
import { ServiceProviderInterface } from "../interfaces/ServiceProviderInterface";
import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";
import moment from "moment";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

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
    const userId = await this.repositories.getUserId(employerEmail);
    return await this.repositories.getServiceProviders(userId);
  }

  async getUser(email: string) {
    return await this.repositories.getUser(email);
  }

  async checkUserExists(email: string) {
    return await this.repositories.checkUserExists(email);
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

  async deleteServiceProvider(
    employerEmail: string,
    serviceProviderEmail: string
  ) {
    const employerId = await this.repositories.getUserId(employerEmail);
    const serviceProviderId = await this.repositories.getUserId(
      serviceProviderEmail
    );
    const transactionId = await this.repositories.getUserTransactionId(
      employerId,
      serviceProviderId
    );
    await this.repositories.deleteSchedules(transactionId);
    return await this.repositories.deleteServiceProvider(transactionId);
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
          userTransactionId
        )
      : await this.repositories.endRecord(userTransactionId);
  }

  async getTodaysRecord(req: any) {
    const { employerEmail, serviceProviderEmail } = req;
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

  async getRecordByPeriod(req: any) {
    const { employerEmail, serviceProviderEmail } = req;
    let { from, to } = req;

    if (from.length > 0 && to.length < 1) {
      to = moment(from).add(1, "month").format("YYYY-MM-DD");
    } else if (from.length < 1 && to.length > 0) {
      from = moment(to).subtract(1, "month").format("YYYY-MM-DD");
    } else if (from.length < 1 && to.length < 1) {
      from = moment(new Date()).subtract(1, "month").format("YYYY-MM-DD");
      to = moment(new Date()).format("YYYY-MM-DD");
    }

    const serviceProviderId = await this.repositories.getUserId(
      serviceProviderEmail
    );
    const employerId = await this.repositories.getUserId(employerEmail);
    const userTransactionId = await this.repositories.getUserTransactionId(
      employerId,
      serviceProviderId
    );
    return await this.repositories.getRecordByPeriod(
      userTransactionId,
      from,
      to
    );
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

  async sendRequestViaEmail(
    receiver: string,
    sender: { firstName: string; lastName: string; email: string },
    request: any
  ) {
    const { firstName, lastName, email } = sender;
    const mailOptions = {
      from: email,
      to: receiver,
      subject: `${firstName} ${lastName} requested you as a service provider`,
      text: request
        ? `${firstName} ${lastName} requested you as a service provider. Please open the app and approve this, otherwise ignore it.`
        : `${firstName} ${lastName} requested you as a service provider. Download the app from this link: `,
    };
    try {
      await transporter.sendMail(mailOptions);
      return true;
    } catch (err) {
      return new Error(`Failed to send a request to ${receiver}`);
    } finally {
      transporter.close();
    }
  }

  async storeRequest(receiver: string, sender: number, request: any) {
    if (!request) {
      return await this.repositories.storeRequest(
        receiver,
        sender,
        null,
        null,
        null
      );
    } else {
      if (request.shifts.length === 0) {
        return await this.repositories.storeRequest(
          receiver,
          sender,
          request.rate,
          request.rate_type,
          null
        );
      } else {
        return request.shifts.map(async (r: any) => {
          await this.repositories.storeRequest(
            receiver,
            sender,
            request.rate,
            request.rate_type,
            r
          );
        });
      }
    }
  }

  async emailHasBeenSent(receiver: string, sender: number) {
    return await this.repositories.emailHasBeenSent(receiver, sender);
  }

  async getNotification(receiver: string) {
    return await this.repositories.getNotification(receiver);
  }

  async updateRequest(sender: string, receiver: string, isApproved: boolean) {
    const senderId = await this.repositories.getUserId(sender);
    return await this.repositories.updateRequest(
      senderId,
      receiver,
      isApproved
    );
  }

  async acceptRequest(sender: string, receiver: string, request: any) {
    // add to user_transaction
    const employerId = await this.repositories.getUserId(sender);
    const serviceProviderId = await this.repositories.getUserId(receiver);
    const transactionId = await this.repositories.addToUserTransaction(
      employerId,
      serviceProviderId,
      request,
      receiver
    );
    // add to user_schedule
    request.shifts.map(async (s: any) => {
      await this.repositories.addToUserSchedule(
        s,
        serviceProviderId,
        transactionId
      );
    });
    return true;
  }
}

export default UserModels;
