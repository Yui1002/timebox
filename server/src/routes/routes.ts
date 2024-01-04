import AuthControllers from "../controllers/authControllers";
import UserControllers from "../controllers/userControllers";
import ActivityControllers from "../controllers/activityControllers";

class Routes {
    authControllers: AuthControllers;
    userControllers: UserControllers;
    activityControllers: ActivityControllers;

    constructor() {
        this.authControllers = new AuthControllers();
        this.userControllers = new UserControllers();
        this.activityControllers = new ActivityControllers();
    }

    applyRouting(app: any) {
        // auth routes
        app.post('/signUp', this.authControllers.signUpOwner.bind(this.authControllers));
        app.post('/signIn', this.authControllers.signInOwner.bind(this.authControllers));
        app.post('/OTP/create', this.authControllers.issueOTP.bind(this.authControllers));
        app.post('/OTP/validate', this.authControllers.validateOTP.bind(this.authControllers));
        app.post('/OTP/resend', this.authControllers.resendOTP.bind(this.authControllers));
        app.post('/user/reset', this.authControllers.sendResetPasswordCode.bind(this.authControllers));
        app.post('/user/code', this.authControllers.validateCode.bind(this.authControllers));
        app.post('/user/validate/password', this.authControllers.validatePassword.bind(this.authControllers));
        app.post('/user/reset/password', this.authControllers.resetPassword.bind(this.authControllers));

        // user routes
        app.get('/users/:email', this.userControllers.getUsers.bind(this.userControllers));
        app.get('/user/:username', this.userControllers.getUser.bind(this.userControllers));
        app.post('/user', this.userControllers.addUser.bind(this.userControllers));
        app.post('/edit/user', this.userControllers.editUser.bind(this.userControllers));
        app.post('/user/duplicate', this.userControllers.isUserRegistered.bind(this.userControllers));
        app.delete('/user/:username/:email', this.userControllers.deleteUser.bind(this.userControllers));

        // activity routes
        app.post('/activity', this.activityControllers.addActivity.bind(this.activityControllers));
        app.get('/activity/:email/:name', this.activityControllers.getSpecificActivity.bind(this.activityControllers));
        app.get('/activities/:email', this.activityControllers.getActivities.bind(this.activityControllers));
        app.delete('/activity/:email/:name', this.activityControllers.deleteActivity.bind(this.activityControllers));
        app.post('/edit/activity', this.activityControllers.editActivity.bind(this.activityControllers));
    }
}

export default Routes;