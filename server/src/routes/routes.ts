import Controllers from "../controllers/controllers";
import {auth} from '../authenticate';

class Routes {
    controllers: Controllers;

    constructor() {
        this.controllers = new Controllers();
    }

    applyRouting(app: any) {
        app.post('/register', this.controllers.registerOwner.bind(this.controllers));
        app.post('/signin', this.controllers.signInOwner.bind(this.controllers));
        app.get('/authType/:email', this.controllers.getAuthType.bind(this.controllers));
        app.get('/users/:email', this.controllers.getUsers.bind(this.controllers));
        app.get('/user/:username', this.controllers.getUser.bind(this.controllers));
        app.post('/user', this.controllers.addUser.bind(this.controllers));
        app.post('/activity', this.controllers.addActivity.bind(this.controllers));
        app.get('/activity/:email/:name', this.controllers.getSpecificActivity.bind(this.controllers));
        app.get('/activities/:email', this.controllers.getActivities.bind(this.controllers));
        app.get('/email/:email', this.controllers.checkEmailExists.bind(this.controllers));
        app.post('/updateUser', this.controllers.updateUser.bind(this.controllers));

        // record time
        app.post('/startRecord', this.controllers.startRecord.bind(this.controllers));
    }
}

export default Routes;