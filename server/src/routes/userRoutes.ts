import UserControllers from "../controllers/userControllers";

class UserRoutes {
    userControllers: UserControllers;

    constructor() {
        this.userControllers = new UserControllers();
    }

    applyRouting(app: any) {
        app.get('/users/:email', this.userControllers.getUsers.bind(this.userControllers));
        app.get('/user/:username', this.userControllers.getUser.bind(this.userControllers));
        app.post('/user', this.userControllers.addUser.bind(this.userControllers));
        app.post('/edit/user', this.userControllers.editUser.bind(this.userControllers));
        app.post('/user/duplicate', this.userControllers.isUserRegistered.bind(this.userControllers));
        app.delete('/user/:username/:email', this.userControllers.deleteUser.bind(this.userControllers));
    }
}

export default UserRoutes;