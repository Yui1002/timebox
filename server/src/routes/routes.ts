import AuthControllers from "../controllers/authControllers";
import UserControllers from "../controllers/userControllers";

class Routes {
    authControllers: AuthControllers;
    userControllers: UserControllers;

    constructor() {
        this.authControllers = new AuthControllers();
        this.userControllers = new UserControllers();
    }

    applyRouting(app: any) {
        // auth routes
        // app.get('/log', this.authControllers.logFile.bind(this.authControllers))
        app.get('/user/exists/:email', this.authControllers.isUserRegistered.bind(this.authControllers));
        app.get('/email/exists', this.authControllers.isEmailRegistered.bind(this.authControllers));
        app.post('/signUp', this.authControllers.signUp.bind(this.authControllers));
        app.post('/signIn', this.authControllers.signIn.bind(this.authControllers));
        app.post('/resetPassword', this.authControllers.resetPassword.bind(this.authControllers));

        // otp
        app.post('/otp/resend', this.authControllers.resendOtp.bind(this.authControllers));
        app.post('/otp/verify', this.authControllers.verifyOTP.bind(this.authControllers));

        app.get('/employers/:email', this.userControllers.getEmployers.bind(this.userControllers));
        app.get('/user/:email', this.userControllers.getUser.bind(this.userControllers));
        app.post('/not/user/send', this.userControllers.emailToNotFoundUser.bind(this.userControllers))

        app.post('/request', this.userControllers.sendEmailToServiceProvider.bind(this.userControllers))
        app.get('/notification', this.userControllers.getNotification.bind(this.userControllers))

        // user routes
        app.get('/serviceProviders', this.userControllers.getServiceProviders.bind(this.userControllers));
        // app.get('/users/:email', this.userControllers.getUsers.bind(this.userControllers));
        app.get('/user/:username', this.userControllers.getUser.bind(this.userControllers));
        // app.post('/user', this.userControllers.addUser.bind(this.userControllers));
        app.post('/addServiceProvider', this.userControllers.addServiceProvider.bind(this.userControllers));
        app.post('/edit/serviceProvider', this.userControllers.editServiceProvider.bind(this.userControllers));
        // app.post('/user/duplicate', this.userControllers.isUserRegistered.bind(this.userControllers));
        app.delete('/user', this.userControllers.deleteServiceProvider.bind(this.userControllers));
        app.post('/record', this.userControllers.recordTime.bind(this.userControllers));
        app.get('/record/today', this.userControllers.getTodaysRecord.bind(this.userControllers));
        app.get('/record', this.userControllers.getRecordByPeriod.bind(this.userControllers));
        app.post('/searchByDateYear', this.userControllers.searchByDateYear.bind(this.userControllers));
        app.get('/getRecord/:username', this.userControllers.getRecord.bind(this.userControllers));
    }
}

export default Routes;