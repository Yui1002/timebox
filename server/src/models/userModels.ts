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

  async emailToNotFoundUser(email: string, userInfo: any) {
    // const { firstName, lastName, userEmail } = userInfo;
    // const mailOptions = {
    //   from: userEmail,
    //   to: email,
    //   subject: `Request from ${firstName} ${lastName}`,
    //   text: `${firstName} ${lastName} want to add you as a service provider. If you approve this request, download the app from this link: `,
    // };
    // try {
    //   const userId = await this.repositories.getUserId(userEmail)
    //   const emailHasBeenSent = await this.repositories.emailHasBeenSent(email, userId)
    //   if (emailHasBeenSent) {
    //     return false;
    //   }
    //   await this.repositories.storeRequest(email, userId);
    //   await transporter.sendMail(mailOptions);
    //   return true;
    // } catch (err) {
    //   return false;
    // } finally {
    //   transporter.close();
    // }
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
    let {from, to} = req;

    if (from.length > 0 && to.length < 1) {
      to = moment(from).add(1, 'month').format('YYYY-MM-DD')
    } else if (from.length < 1 && to.length > 0) {
      from = moment(to).subtract(1, 'month').format('YYYY-MM-DD')
    } else if (from.length < 1 && to.length < 1) {
      from = moment(new Date()).subtract(1, 'month').format('YYYY-MM-DD')
      to = moment(new Date()).format('YYYY-MM-DD')
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

  async sendEmailToServiceProvider(
    emailTo: string,
    employer: { firstName: string; lastName: string; email: string }
  ) {
    const { firstName, lastName, email } = employer;
    const mailOptions = {
      from: email,
      to: emailTo,
      subject: `${firstName} ${lastName} requested you as a service provider`,
      text: `${firstName} ${lastName} requested you as a service provider. Please open the app and approve this, otherwise ignore it.`,
    };
    try {
      await transporter.sendMail(mailOptions);
      return true;
    } catch (err) {
      return false;
    } finally {
      transporter.close();
    }
  }

  async storeRequest(receiver: string, sender: number, request: any) {
    return request.shifts.map(async (r: any) => {
      await this.repositories.storeRequest(receiver, sender, r);
    })
  }

  async emailHasBeenSent(receiver: string, sender: number) {
    return await this.repositories.emailHasBeenSent(receiver, sender);
  }

  async getNotification(receiver: string) {
    return await this.repositories.getNotification(receiver);
  }
}

export default UserModels;
