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

    async getUsers(req: any, res:any) {
        const users = await this.models.getUsers(req.params.email);
        res.send(users);
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
}

export default UserControllers;