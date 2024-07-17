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
    const response = await this.models.getEmployers(req.params.email);
    res.send(response);
  }

  async getServiceProviders(req: any, res: any) {
    const serviceProviders = await this.models.getServiceProviders(
      req.params.email
    );
    res.send(serviceProviders);
  }

  async addServiceProvider(req: any, res: any) {
    const response = await this.models.addServiceProvider(req.body);
    response ? res.sendStatus(200) : res.sendStatus(400);
  }

  async editServiceProvider(req: any, res: any) {
    const response = await this.models.editServiceProvider(req.body);
    // const response = await this.models.addServiceProvider(req.body);
    // response ? res.sendStatus(200) : res.sendStatus(400);
  }

  async deleteServiceProvider(req: any, res: any) {
    const { email } = req.params;
    const response = await this.models.deleteServiceProvider(email);
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

  async searchByPeriod(req: any, res: any) {
    const record = await this.models.searchByPeriod(req.body);
    res.send(record);
  }

  async searchByDateYear(req: any, res: any) {
    const record = await this.models.searchByDateYear(req.body);
    res.send(record);
  }

  async getRecord(req: any, res: any) {
    const { username } = req.params;
    const record = await this.models.getRecord(username);
    res.send(record);
  }
}

export default UserControllers;
