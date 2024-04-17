import UserModels from "../models/userModels";

class UserControllers {
  models: UserModels;

  constructor() {
    this.models = new UserModels();
  }

  async getUser(req: any, res: any) {
    const user = await this.models.getUser(req.params.username);
    res.send(user);
  }

  async getUsers(req: any, res: any) {
    const users = await this.models.getUsers(req.params.email);
    res.send(users);
  }

  async addUser(req: any, res: any) {
    const response = await this.models.addUser(req.body);
    response ? res.sendStatus(200) : res.sendStatus(400);
  }

  async editUser(req: any, res: any) {
    const response = await this.models.editUser(req.body);
    response ? res.sendStatus(200) : res.sendStatus(400);
  }

  async isUserRegistered(req: any, res: any) {
    const { ownerEmail, username } = req.body;
    const response = await this.models.isUserRegistered(ownerEmail, username);
    res.send(response);
  }

  async deleteUser(req: any, res: any) {
    const {username, email} = req.params;
    const response = await this.models.deleteUser(email, username);
    response ? res.sendStatus(200) : res.sendStatus(400);
  }

  async startRecord(req: any, res: any) {
    const { username } = req.body;
    const response = await this.models.startRecord(username);
    response ? res.sendStatus(200) : res.sendStatus(400);
  }

  async endRecord(req: any, res: any) {
    const { username } = req.body;
    const response = await this.models.endRecord(username);
    response ? res.sendStatus(200) : res.sendStatus(400);
  }

  async getHistory(req: any, res: any) {
    const { username } = req.params;
    const response = await this.models.getHistory(username);
  }
}

export default UserControllers;
