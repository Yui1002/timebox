import UserRepositories from "../repositories/userRepositories";
import dotenv from "dotenv";
dotenv.config();

class UserModels {
  repositories: UserRepositories;

  constructor() {
    this.repositories = new UserRepositories();
  }

  async getOwnerId(email: string) {
    return await this.repositories.getOwnerId(email);
  }

  async getUsers(email: string) {
    const ownerId = await this.getOwnerId(email);
    return await this.repositories.getUsers(ownerId);
  }

  async getUser(username: string) {
    return await this.repositories.getUser(username);
  }

  async addUser(user: any) {
    const ownerId = await this.getOwnerId(user.ownerEmail);
    const newUserId = await this.repositories.addUser(user, ownerId)
    return this.addSchedule(newUserId, user.lists)
  }

  async addSchedule(userId: string, user: []) {
    return await this.repositories.addSchedule(userId, user);
  }

  async editUser(req: any) {
    const userId = await this.repositories.getUserId(req.user_name);
    await this.repositories.editUser(req, userId);
    return await this.repositories.editSchedule(userId, req.finalShifts)
  }

  async isUserRegistered(ownerEmail: string, username: string) {
    const ownerId = await this.getOwnerId(ownerEmail);
    return await this.repositories.isUserRegistered(ownerId, username);
  }

  async deleteUser(ownerEmail: string, username: string) {
    const ownerId = await this.getOwnerId(ownerEmail);
    return await this.repositories.deleteUser(ownerId, username);
  }

  async startRecord(req: any) {
    const { username, checkedInTime } = req;
    const userId = await this.repositories.getUserId(username);
    return await this.repositories.startRecord(userId, checkedInTime)
  }

  async endRecord(req: any) {
    const { username, checkedOutTime } = req;
    const userId = await this.repositories.getUserId(username);
    return await this.repositories.endRecord(userId, checkedOutTime)
  }

  async getTodaysRecord(username: string) {
    const userId = await this.repositories.getUserId(username);
    return await this.repositories.getTodaysRecord(userId);
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
    console.log(from, to, username)
    const userId = await this.repositories.getUserId(username);
    console.log('user id', userId)
    return await this.repositories.searchByPeriod(from, to, userId)
  }
}

export default UserModels;
