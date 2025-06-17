import RequestRepo from "../repositories/RequestRepo";
import UserRepo from "../repositories/UserRepo";
import {
  GetRequestByEmailRq,
  GetRequestByStatusRq,
  GetRequestRq,
  GetRequestRs,
  GetRequestRsMini,
  RequestRawDB,
  SetRequestRq,
  UpdateRequestRq,
} from "../models/Request";
import ResponseException from "../models/ResponseException";
import dotenv from "dotenv";
import sgMail from "@sendgrid/mail";
import { ServiceProviderMiniRs } from "../models/ServiceProvider";
import { RequestStatus, UserStatus } from "../helpers/enum";
import UserTransactionRepo from "../repositories/UserTransactionRepo";
import UserTransactionManager from "./UserTransactionManager";
import UserScheduleManager from "./UserScheduleManager";
import { SetUserTransactionRq } from "../models/UserTransaction";
import { SetUserScheduleRq } from "../models/UserSchedule";
dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

interface IRequestManager {
  getRequests(requestRq: GetRequestRq): Promise<GetRequestRs>;
  getRequestByEmail(requestRq: GetRequestByEmailRq): Promise<GetRequestRs>;
  getRequestsByStatus(
    requestRq: GetRequestByStatusRq
  ): Promise<GetRequestRsMini[]>;
  setRequest(request: SetRequestRq): Promise<void>;
  updateRequest(requestRq: UpdateRequestRq): Promise<void>;
  sendRequestViaMail(requestRq: SetRequestRq): Promise<void>;
}

class RequestManager implements IRequestManager {
  private _requestRepo: RequestRepo;
  private _userRepo: UserRepo;
  private _userTransactionRepo: UserTransactionRepo;
  private _userTransactionManager: UserTransactionManager;
  private _userScheduleManager: UserScheduleManager;

  constructor() {
    this._requestRepo = new RequestRepo();
    this._userRepo = new UserRepo();
    this._userTransactionRepo = new UserTransactionRepo();
    this._userTransactionManager = new UserTransactionManager();
    this._userScheduleManager = new UserScheduleManager();
  }

  async getRequests(requestRq: GetRequestRq): Promise<GetRequestRs> {
    let requestDB = await this._requestRepo.getRequests(
      requestRq.receiverEmail
    );
    if (!requestDB) {
      throw new ResponseException(null, 400, "no data found");
    }
    return requestDB;
  }

  async getRequestByEmail(
    requestRq: GetRequestByEmailRq
  ): Promise<GetRequestRs> {
    let requestDB = await this._requestRepo.getRequestByEmail(requestRq);
    if (!requestDB) {
      throw new ResponseException(null, 400, "no data found");
    }
    return requestDB;
  }

  async getRequestsByStatus(
    requestRq: GetRequestByStatusRq
  ): Promise<GetRequestRsMini[]> {
    let requestDB = await this._requestRepo.getRequestsByStatus(requestRq);
    if (!requestDB) {
      throw new ResponseException(null, 400, "no data found");
    }

    return requestDB.requests.map(
      (request: RequestRawDB) => new GetRequestRsMini(request)
    );
  }

  async setRequest(requestRq: SetRequestRq): Promise<void> {
    if (requestRq.schedules.length <= 0) {
      await this._requestRepo.setRequest(requestRq);
    } else {
      requestRq.schedules.map(async (schedule) => {
        await this._requestRepo.setRequest(requestRq, schedule);
      });
    }
    await this.sendRequestViaMail(requestRq);
  }

  async sendRequestViaMail(requestRq: SetRequestRq): Promise<void> {
    const sender = await this._userRepo.getUser(requestRq.senderEmail);

    if (!sender) {
      throw new ResponseException(null, 400, "no data found");
    }

    const msg = {
      to: requestRq.receiverEmail,
      from: process.env.SENDGRID_SENDER,
      subject: `Action Needed: Service Request from ${sender.first_name} ${sender.last_name}`,
      text: `${sender.first_name} ${sender.last_name} has requested you as a service provider. Please sign in and visit your notifications page to view the request details and choose to accept or decline.`,
    };

    try {
      await sgMail.send(msg);
    } catch (error) {
      throw new ResponseException(null, 500, "failed to send an request");
    }
  }

  async updateRequest(requestRq: UpdateRequestRq): Promise<void> {
    await this._requestRepo.updateRequest(requestRq);

    if (requestRq.status === RequestStatus.APPROVED) {
      Promise.all([
        await this._userTransactionManager.setUserTransaction({
          rate: requestRq.rate,
          rateType: requestRq.rateType,
          employerEmail: requestRq.senderEmail,
          serviceProviderEmail: requestRq.receiverEmail,
          status: UserStatus.ACTIVE,
          allowEdit: requestRq.allowEdit,
        } as SetUserTransactionRq),
        await this._userScheduleManager.setUserSchedule({
          employerEmail: requestRq.senderEmail,
          serviceProviderEmail: requestRq.receiverEmail,
          schedules: requestRq.schedules,
        } as SetUserScheduleRq),
      ]);
    }
  }

  async isRequestValid(
    requestRq: GetRequestByEmailRq
  ): Promise<ServiceProviderMiniRs> {
    let recordData = await this._requestRepo.getRequestByEmail(requestRq);
    let serviceProvider = await this._userRepo.getUser(requestRq.receiverEmail);

    if (recordData) {
      throw new ResponseException(null, 400, "Duplicate request");
    }

    if (!serviceProvider) {
      throw new ResponseException(
        null,
        400,
        "This email address was not found. The person you are trying to request as a service provider must be a registered user of the app."
      );
    }

    return new ServiceProviderMiniRs(serviceProvider);
  }
}

export default RequestManager;
