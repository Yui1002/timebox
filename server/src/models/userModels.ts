import UserRepositories from "../repositories/userRepositories";
import { Employer } from "../interfaces/Employer";
import { User } from "../interfaces/User"
import { ServiceProvider } from "../interfaces/ServiceProvider";
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

  async getEmployers(email: string): Promise<Employer> {
    const spId: number = (await this.repositories.getUser(email))?.user_id;
    return await this.repositories.getEmployers(spId);
  }

  async getUser(email: string): Promise<User> {
    return await this.repositories.getUser(email);
  }

  async getServiceProviders(email: string): Promise<ServiceProvider> {
    return await this.repositories.getServiceProviders(email);
  }

  async getRequests(email: string) {
    const senderId: number = (await this.repositories.getUser(email)).user_id;
    return await this.repositories.getRequests(senderId);
  }

  async getServiceProvider(req: any) {
    const { spEmail, epEmail } = req;
    const spId: number = (await this.repositories.getUser(spEmail)).user_id;
    const epId: number = (await this.repositories.getUser(epEmail)).user_id;
    const transactionId = await this.repositories.getUserTransactionId(
      epId,
      spId
    );
    return await this.repositories.getServiceProvider(transactionId);
  }


  async getUserId(email: string) {
    // return await this.repositories.getUserId(email);
  }

  async editServiceProvider(req: any) {
    const { params, spEmail, epEmail } = req;
    const epId: number = (await this.repositories.getUser(epEmail)).user_id;
    const spId: number = (await this.repositories.getUser(spEmail)).user_id;
    await this.editUserTransaction(params, epId, spId);
    await this.editUserSchedule(params, epId, spId);
    return true;
    // const { params, spEmail, epEmail } = req;
    // const data: { [key: string]: string | number } = {};

    // try {
    //   const epId = await this.repositories.getUserId(epEmail);
    //   const spId = await this.repositories.getUserId(spEmail);

    //   if (epId && spId) {
    //     data.employer_user_id = epId;
    //     data.service_provider_id = spId;

    //     const properties = ["rate", "rate_type", "status"];
    //     for (const prop of properties) {
    //       if (params.hasOwnProperty(prop)) data[prop] = params[prop];
    //     }
    //     if (Object.keys(data).length > 2) {
    //       await this.repositories.updateUserTransaction(data);
    //     }
    //   }
    //   if (req.params.hasOwnProperty("shift")) {
    //     const transactionId = await this.repositories.getUserTransactionId(
    //       epId,
    //       spId
    //     );
    //     if (req.params.shift.length > 0) {
    //       req.params.shift.map(async (s: any) => {
    //         await this.repositories.updateUserSchedule(s, spId, transactionId);
    //       });
    //     } else {
    //       await this.repositories.updateUserSchedule({}, spId, transactionId)
    //     }
    //   }
    //   return true;
    // } catch (err) {
    //   throw new Error("transaction id not found");
    // }
  }

  async editUserTransaction(params: any, epId: number, spId: number) {
    if (
      !params.hasOwnProperty("rate") &&
      !params.hasOwnProperty("rate_type") &&
      !params.hasOwnProperty("status")
    ) {
      return;
    }
    const data: { [key: string]: string | number } = {};

    try {
      data.employer_user_id = epId;
      data.service_provider_id = spId;

      const properties = ["rate", "rate_type", "status"];
      for (const prop of properties) {
        if (params.hasOwnProperty(prop)) data[prop] = params[prop];
      }
      if (Object.keys(data).length > 2) {
        return await this.repositories.updateUserTransaction(data);
      }
    } catch (err) {
      return err;
    }
  }

  async editUserSchedule(params: any, epId: number, spId: number) {
    if (!params.hasOwnProperty("shift")) return;
    const transactionId = await this.repositories.getUserTransactionId(
      epId,
      spId
    );
    try {
      const deleted = await this.repositories.deleteSchedules(transactionId);
      if (deleted) {
        params.shift.map(async (s: any) => {
          await this.repositories.updateUserSchedule(s, spId, transactionId);
        })
      }
    } catch (err) {
      return err;
    }
  }


  async deleteServiceProvider(epEmail: string, spEmail: string) {
    const epId: number = (await this.repositories.getUser(epEmail)).user_id;
    const spId: number = (await this.repositories.getUser(spEmail)).user_id;
    const transactionId = await this.repositories.getUserTransactionId(
      epId,
      spId
    );
    await this.repositories.deleteSchedules(transactionId);
    return await this.repositories.deleteServiceProvider(transactionId);
  }

  async recordTime(req: any) {
    const { type, start, end, epEmail, spEmail, mode } = req;
    const spId: number = (await this.repositories.getUser(spEmail)).user_id;
    const epId: number = (await this.repositories.getUser(epEmail)).user_id;
    const transactionId = await this.repositories.getUserTransactionId(
      epId,
      spId
    );
    return type === "start"
      ? await this.repositories.startRecord(start, spEmail, transactionId, mode)
      : await this.repositories.endRecord(start, end, transactionId);
  }

  async getTodaysRecord(req: any) {
    const { epEmail, spEmail } = req;
    const spId: number = (await this.repositories.getUser(spEmail)).user_id;
    const epId: number = (await this.repositories.getUser(epEmail)).user_id;
    const transactionId = await this.repositories.getUserTransactionId(
      epId,
      spId
    );
    return await this.repositories.getTodaysRecord(transactionId);
  }

  async getRecordByPeriod(req: any) {
    const { epEmail, spEmail } = req;
    let { from, to } = req;

    if (from.length > 0 && to.length < 1) {
      to = moment(from).add(1, "month").format("YYYY-MM-DD");
    } else if (from.length < 1 && to.length > 0) {
      from = moment(to).subtract(1, "month").format("YYYY-MM-DD");
    } else if (from.length < 1 && to.length < 1) {
      from = moment(new Date()).subtract(1, "month").format("YYYY-MM-DD");
      to = moment(new Date()).format("YYYY-MM-DD");
    }

    const spId: number = (await this.repositories.getUser(spEmail)).user_id;
    const epId: number = (await this.repositories.getUser(epEmail)).user_id;
    const transactionId = await this.repositories.getUserTransactionId(
      epId,
      spId
    );
    return await this.repositories.getRecordByPeriod(transactionId, from, to);
  }

  async getRecordByDay(req: any) {
    const { date, epEmail, spEmail } = req;
    const spId: number = (await this.repositories.getUser(spEmail)).user_id;
    const epId: number = (await this.repositories.getUser(epEmail)).user_id;
    const transactionId = await this.repositories.getUserTransactionId(
      epId,
      spId
    );
    return await this.repositories.getRecordByDay(transactionId, date);
  }

  async checkRecordDuplicate(req: any) {
    const { type, date, epEmail, spEmail } = req;
    const spId: number = (await this.repositories.getUser(spEmail)).user_id;
    const epId: number = (await this.repositories.getUser(epEmail)).user_id;
    const transactionId = await this.repositories.getUserTransactionId(
      epId,
      spId
    );
    const rows = await this.repositories.checkDuplicate2(
      type,
      date,
      transactionId
    );
    return rows.length > 0;
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
        ? `${firstName} ${lastName} requested you as a service provider.
          Open the app, check notification page and approve or decline the request.`
        : `${firstName} ${lastName} requested you as a service provider.
          Download the app and create an account using this email address: ${receiver}.
          After sign in, go to notification page to approve or decline the request.`,
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

  async storeRequest(receiver: string, senderId: number, request: any) {
    if (!request) {
      return await this.repositories.storeRequest(
        receiver,
        senderId,
        null,
        null,
        null,
        null
      );
    } else {
      const { rate, rate_type, mode, shifts } = request;
      if (shifts.length > 0) {
        shifts.map(
          async (shift: {
            day: string;
            startTime: string;
            endTime: string;
          }) => {
            await this.repositories.storeRequest(
              receiver,
              senderId,
              rate,
              rate_type,
              mode,
              shift
            );
          }
        );
      } else {
        await this.repositories.storeRequest(
          receiver,
          senderId,
          rate,
          rate_type,
          mode,
          null
        );
      }
    }
  }

  async emailHasBeenSent(receiver: string, sender: number) {
    return await this.repositories.emailHasBeenSent(receiver, sender);
  }

  async getRequestStatus(sender: number, receiver: string) {
    return await this.repositories.getRequestStatus(sender, receiver)
  }

  async getNotification(receiver: string) {
    return await this.repositories.getNotification(receiver);
  }

  async updateRequest(sender: string, receiver: string, isApproved: boolean) {
    const senderId: number = (await this.repositories.getUser(sender)).user_id;
    return await this.repositories.updateRequest(
      senderId,
      receiver,
      isApproved
    );
  }

  async acceptRequest(sender: string, receiver: string, request: any) {
    // add to user_transaction
    const spId: number = (await this.repositories.getUser(sender)).user_id;
    const epId: number = (await this.repositories.getUser(receiver)).user_id;
    const transactionId = await this.repositories.addToUserTransaction(
      epId,
      spId,
      request,
      receiver
    );
    // add to user_schedule
    request.shifts.map(async (s: any) => {
      await this.repositories.addToUserSchedule(
        s,
        spId,
        transactionId
      );
    });
    return true;
  }
}

export default UserModels;
