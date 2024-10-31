import UserModels from "../models/userModels";

class UserControllers {
  models: UserModels;

  constructor() {
    this.models = new UserModels();
  }

  async getUser(req: any, res: any) {
    const user = await this.models.getUser(req.params.email);
    res.send(user);
  }

  async getEmployers(req: any, res: any) {
    const response = await this.models.getEmployers(req.query.email);
    res.send(response);
  }

  async getServiceProviders(req: any, res: any) {
    const requests = await this.models.getRequests(req.query.email);
    const x = await requests.map(async (r: any) => {
      const sp = await this.models.getUser(r.receiver);
      // console.log("sp", sp);
      const status = r.is_approved
        ? "Active"
        : r.is_approved === null
        ? "Pending"
        : "Rejected";
      if (!sp.length) {
        const data: any = {};
        data.email_address = r.receiver;
        data.request_status = status;
        sp.push(data);
      } else {
        sp[0].request_status = status;
      }
      return sp[0]
    });
    // console.log('data', x)
    Promise.all(x).then((d) => res.send(d))
    // const serviceProviders = await this.models.getServiceProviders(email);
    // res.send(serviceProviders);
  }

  async getRequests(req: any, res: any) {
    const { email } = req.query;
    const requests = await this.models.getRequests(email);
    res.send(requests);
  }

  async getServiceProvider(req: any, res: any) {
    const response = await this.models.getServiceProvider(req.query);
    res.send(response);
  }

  async checkUserExists(req: any, res: any) {
    const user = await this.models.getUser(req.params.email);
    user.length > 0 ? res.status(200).send(user) : res.sendStatus(400);
  }

  async searchEmail(req: any, res: any) {
    try {
      const { receiver, sender } = req.query;
      const senderId = await this.models.getUserId(sender);
      const isRequestDuplicate = await this.models.emailHasBeenSent(
        receiver,
        senderId
      );
      if (isRequestDuplicate) {
        throw new Error("You cannot send the request multiple times");
      } else {
        const user = await this.models.getUser(receiver);
        user.length > 0
          ? res.status(200).send(user)
          : res.status(200).send("Email not found");
      }
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  }

  async sendRequest(req: any, res: any) {
    try {
      const { sender, receiver } = req.body;
      const senderId = await this.models.getUserId(sender.email);
      if (req.body.hasOwnProperty("request")) {
        const { request } = req.body;
        await this.models.storeRequest(receiver, senderId, request);
        await this.models.sendRequestViaEmail(receiver, sender, request);
        res.sendStatus(200);
      } else {
        await this.models.storeRequest(receiver, senderId, null);
        await this.models.sendRequestViaEmail(receiver, sender, null);
        res.sendStatus(200);
      }
    } catch (err) {
      res.status(400).send({ error: err });
    }
  }

  async editServiceProvider(req: any, res: any) {
    const response = await this.models.editServiceProvider(req.body);
    response ? res.sendStatus(200) : res.sendStatus(400);
  }

  async deleteServiceProvider(req: any, res: any) {
    const { epEmail, spEmail } = req.query;
    const response = await this.models.deleteServiceProvider(epEmail, spEmail);
    response ? res.sendStatus(200) : res.sendStatus(400);
  }

  async recordTime(req: any, res: any) {
    const response = await this.models.recordTime(req.body);
    res.send(response);
  }

  async getTodaysRecord(req: any, res: any) {
    const record = await this.models.getTodaysRecord(req.query);
    res.send(record);
  }

  async getRecordByPeriod(req: any, res: any) {
    const records = await this.models.getRecordByPeriod(req.query);
    res.send(records);
  }

  async getRecordByDay(req: any, res: any) {
    const record = await this.models.getRecordByDay(req.query);
    res.send(record);
  }

  async checkRecordDuplicate(req: any, res: any) {
    const isDuplicated = await this.models.checkRecordDuplicate(req.query);
    isDuplicated ? res.sendStatus(400) : res.sendStatus(200);
  }

  async getNotification(req: any, res: any) {
    const { receiver } = req.query;
    const notification = await this.models.getNotification(receiver);
    res.send(notification);
  }

  async updateRequest(req: any, res: any) {
    try {
      const { sender, receiver, isApproved, request } = req.body;
      await this.models.updateRequest(sender, receiver, isApproved);
      if (isApproved) {
        await this.models.acceptRequest(sender, receiver, request);
      }
      res.sendStatus(200);
    } catch (err) {
      res.status(400).json({ error: err });
    }
  }
}

export default UserControllers;
