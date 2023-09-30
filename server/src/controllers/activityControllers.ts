import ActivityModels from "../models/activityModels";

class ActivityControllers {
    models: ActivityModels;

    constructor() {
        this.models = new ActivityModels();
    }

    async getActivities(req: any, res: any) {
        const activities = await this.models.getActivities(req.params.email);
        res.send(activities);
    }

    async getSpecificActivity(req: any, res: any) {
        const { name, email } = req.params;
        const activity = await this.models.getSpecificActivity(name, email);
        res.send(activity);
    }

    async addActivity(req: any, res: any) {
        const response = await this.models.addActivity(req.body);
        if (response === 1) {
            res.status(200).send('Activity registered successfully');
        } else {
            res.status(400).send('Failed to register activity');
        }
    }

    async deleteActivity(req: any, res:any) {
        const { email, name } = req.params;
        const response = await this.models.deleteActivity(email, name);
        if (response === 1) {
            res.status(200).send('The activity has been deleted successfully');
        } else {
            res.status(400).send('Failed to delete the activity');
        }
    }

    async editActivity(req: any, res: any) {
        const response = await this.models.editActivity(req.body);
        if (response === 1) {
            res.status(200).send('The activity has been editted successfully');
        } else {
            res.status(400).send('Failed to edit the activity');
        }
    }
}

export default ActivityControllers;