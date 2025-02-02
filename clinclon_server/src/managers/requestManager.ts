import RequestRepo from "../repositories/RequestRepo";
import UserRepo from "../repositories/UserRepo";
import { GetRequestByEmailRq, GetRequestByStatusRq, GetRequestRq, GetRequestRs, GetRequestRsMini, RequestRawDB, SetRequestRq, UpdateRequestStatusRq } from "../models/Request";
import ResponseException from "../models/ResponseException";
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { ServiceProviderMiniRs } from "../models/ServiceProvider";
import { RequestStatus } from "../helpers/enum";
import UserTransactionRepo from "../repositories/UserTransactionRepo";
dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

interface IRequestManager {
    getRequests(requestRq: GetRequestRq): Promise<GetRequestRs>;
    getRequestByEmail(requestRq: GetRequestByEmailRq): Promise<GetRequestRs>;
    getRequestsByStatus(requestRq: GetRequestByStatusRq): Promise<GetRequestRsMini[]>;
    setRequest(request: SetRequestRq): Promise<void>;
    updateRequestStatus(requestRq: UpdateRequestStatusRq): Promise<void>;
    sendRequestViaMail(requestRq: SetRequestRq): Promise<void>;
}

class RequestManager implements IRequestManager {
    private _requestRepo: RequestRepo;
    private _userRepo: UserRepo;
    private _userTransactionRepo: UserTransactionRepo

    constructor() {
        this._requestRepo = new RequestRepo();
        this._userRepo = new UserRepo();
        this._userTransactionRepo = new UserTransactionRepo();
    }

    async getRequests(requestRq: GetRequestRq): Promise<GetRequestRs> {
        let requestDB = await this._requestRepo.getRequests(requestRq.receiverEmail);
        if (!requestDB) {
            throw new ResponseException(null, 400, 'no data found');
        }
        return requestDB;
    }
    
    async getRequestByEmail(requestRq: GetRequestByEmailRq): Promise<GetRequestRs> {
        let requestDB = await this._requestRepo.getRequestByEmail(requestRq);
        if (!requestDB) {
            throw new ResponseException(null, 400, 'no data found');
        }
        return requestDB;
    }

    async getRequestsByStatus(requestRq: GetRequestByStatusRq): Promise<GetRequestRsMini[]> {
        let requestDB = await this._requestRepo.getRequestsByStatus(requestRq);
        if (!requestDB) {
            throw new ResponseException(null, 400, 'no data found');
        }

        return requestDB.requests.map((request: RequestRawDB) => new GetRequestRsMini(request))
    }

    async setRequest(requestRq: SetRequestRq): Promise<void> {
        requestRq.schedules.map(async (schedule) => {
            // await this._requestRepo.setRequest(requestRq, schedule);
        });

        await this.sendRequestViaMail(requestRq);
    }

    async sendRequestViaMail(requestRq: SetRequestRq): Promise<void> {
        const sender = await this._userRepo.getUser(requestRq.senderEmail);

        if (!sender) {
            throw new ResponseException(null, 400, 'no data found');
        }

        const mailOptions = {
            from: requestRq.senderEmail,
            to: requestRq.receiverEmail,
            subject: `${sender.first_name} ${sender.last_name} requested you as a service provider`,
            text: `${sender.first_name} ${sender.last_name} requested you as a service provider.
                If you don't have clin clon app, download from the below link to sign up. If you already have the app, 
                open the app, check notification page and approve or decline the request.`
        };

        let mail = await transporter.sendMail(mailOptions);
        if (!mail) {
            throw new ResponseException(null, 500, "failed to send an email");
        }
        transporter.close();
    }

    async updateRequestStatus(requestRq: UpdateRequestStatusRq): Promise<void> {
    // if request is accepted, 
        await this._requestRepo.updateRequestStatus(requestRq);

        if (requestRq.status === RequestStatus.APPROVED) {
            let [employerData, serviceProviderData] = await Promise.all(
                [this._userRepo.getUser(requestRq.senderEmail),
                this._userRepo.getUser(requestRq.receiverEmail)]);
            
            if (!employerData || !serviceProviderData) {
                throw new ResponseException(null, 400, 'no data found');
            }
            // need employerId + service provider id
            // this._userTransactionRepo.setUserTransaction(requestRq);
        }
      // means receiver becomes employee of the sender
      // create new data for user transaction 
      // create new data for user  schedule
    // if request is denied, 
      // just update request status 
        await this._requestRepo.updateRequestStatus(requestRq);
    }

    async isRequestValid(requestRq: GetRequestByEmailRq): Promise<ServiceProviderMiniRs> {
    /**
     * Decides whether the owner can send a request to service provider
     * 1) If there is a record in request table -> reject
     * 2) There is no record in request table and service provider is not a user -> send request
     * 3) There is no record in request table and service provider is a user -> set rate type -> send request
     * @returns 
     */
        let recordData = await this._requestRepo.getRequestByEmail(requestRq);
        let serviceProvider = await this._userRepo.getUser(requestRq.receiverEmail);

        if (recordData) {
            throw new ResponseException(null, 400, 'Duplicate request');
        }

        return new ServiceProviderMiniRs(serviceProvider);
    }
}

export default RequestManager;