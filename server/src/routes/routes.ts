import Controllers from "../controllers/controllers";
import AuthenticationControllers from '../controllers/authenticationControllers';

class Routes {
    controllers: Controllers;
    authControllers: AuthenticationControllers;

    constructor() {
        this.controllers = new Controllers();
        this.authControllers = new AuthenticationControllers();
    }

    applyRouting(app: any) {
        app.post('/signUp', this.authControllers.signUpOwner.bind(this.controllers));
        app.post('/signIn', this.authControllers.signInOwner.bind(this.controllers));
        app.get('/authType/:email', this.controllers.getAuthType.bind(this.controllers));
        app.get('/users/:email', this.controllers.getUsers.bind(this.controllers));
        app.get('/user/:username', this.controllers.getUser.bind(this.controllers));
        app.post('/user', this.controllers.addUser.bind(this.controllers));
        app.post('/activity', this.controllers.addActivity.bind(this.controllers));
        app.get('/activity/:email/:name', this.controllers.getSpecificActivity.bind(this.controllers));
        app.get('/activities/:email', this.controllers.getActivities.bind(this.controllers));
        app.get('/email/:email', this.controllers.checkEmailExists.bind(this.controllers));
        app.post('/updateUser', this.controllers.updateUser.bind(this.controllers));
        app.delete('/activity/:email/:name', this.controllers.deleteActivity.bind(this.controllers));
        app.post('/edit/activity', this.controllers.editActivity.bind(this.controllers));

        // record time
        app.post('/startRecord', this.controllers.startRecord.bind(this.controllers));
    }
}

export default Routes;