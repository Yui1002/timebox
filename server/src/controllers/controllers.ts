import Models from "../models/models"

class Controllers {
    models: Models;

    constructor() {
        this.models = new Models();
    }

    async signUpOwner(req: any, res: any) {
        const isRegistered = await this.models.isOwnerRegistered(req.body.email);
        if (isRegistered) {
            res.status(400).json({error: 'This email is already used'});
        } else {
            const response = await this.models.signUpOwner(req.body);
            response ? res.sendStatus(200) : res.status(400).json({error: 'Failed to sign up'});
        }
    }

    async signInOwner(req: any, res: any) {
        const {email, password} = req.body;
        const isRegistered = await this.models.isOwnerRegistered(email);
        if (!isRegistered) {
            res.status(400).json({error: 'Incorrect email address or password'});
        } else {
            const isPasswordMatch = await this.models.isPasswordMatch(email, password);
            if (!isPasswordMatch) {
                res.status(400).json({error: 'Incorrect email address or password'});
                return;
            }
            res.status(200).send('successfully login')
        }
    }

    async getAuthType(req: any, res: any) {
        const authType = await this.models.getOwnerAuthType(req.params.email);
        res.send(authType);
    }

    async getUser(req: any, res: any) {
        const user = await this.models.getUser(req.params.username);
        res.send(user);
    }

    async getUsers(req: any, res:any) {
        const users = await this.models.getUsers(req.params.email);
        res.send(users);
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

    async addUser(req: any, res: any) {
        const isRegistered = await this.models.isUserRegistered(req.body.username);
        if (isRegistered) {
            res.status(400).send('User is already registered');
        } else {
            const response = await this.models.addUser(req.body);
            Number(response) > 0 ? res.sendStatus(200) : res.sendStatus(400);
        }
    }

    async updateUser(req: any, res: any) {
        const response = await this.models.updateUser(req.body);
        res.status(200).send('Successfully updated');
    }

    async addActivity(req: any, res: any) {
        const response = await this.models.addActivity(req.body);
        if (response === 1) {
            res.status(200).send('Activity registered successfully');
        } else {
            res.status(400).send('Failed to register activity');
        }
    }

    async checkEmailExists(req: any, res: any) {
        const response = await this.models.checkEmailExists(req.params.email);
        if (response) {
            res.sendStatus(200);
        } else {
            res.sendStatus(401);
        }
    }

    async startRecord(req: any, res: any) {
        // co/nst response = await this.models.startRecord()
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

export default Controllers;