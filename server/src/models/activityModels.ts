import ActivityRepositories from "../repositories/activityRepositories";
import { OwnerInterface } from "../interfaces/OwnerInterface";
import { UserInterface } from "../interfaces/UserInterface";
import { ActivityInterface } from "../interfaces/ActivityInterface";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

class ActivityModels {
    repositories: ActivityRepositories;

    constructor() {
        this.repositories = new ActivityRepositories();
    }

    async getOwnerId(email: string) {
        return await this.repositories.getOwnerId(email);
    }

    async getActivities(email: string) {
        const ownerId = await this.getOwnerId(email);
        return await this.repositories.getActivities(ownerId);
    }

    async getSpecificActivity(activity: string, email: string) {
        const ownerId = await this.getOwnerId(email);
        return await this.repositories.getSpecificActivity(activity, ownerId);
    }

    async addActivity(activity: ActivityInterface) {
        const ownerId = await this.getOwnerId(activity.ownerEmail);
        activity.ownerId = ownerId;
        activity.updateBy = activity.ownerEmail;
        return await this.repositories.addActivity(activity);
    }

    async deleteActivity(email: string, name: string) {
        const ownerId = await this.getOwnerId(email);
        return await this.repositories.deleteActivity(ownerId, name);
    }

    async getActivityId(email: string, activityName: string) {
        const ownerId = await this.getOwnerId(email);
        return await this.repositories.getActivityId(ownerId, activityName);
    }

    async editActivity(req: any) {
        const { ownerEmail, originalActivityName } = req;
        const activityId = await this.getActivityId(ownerEmail, originalActivityName);
        return await this.repositories.editActivity(req, activityId)
    }
}

export default ActivityModels;