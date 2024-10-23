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
        app.get('/user/exists/:email', this.authControllers.isUserRegistered.bind(this.authControllers));
        app.get('/email/exists', this.authControllers.isEmailRegistered.bind(this.authControllers));
        app.post('/signUp', this.authControllers.signUp.bind(this.authControllers));
        app.post('/signIn', this.authControllers.signIn.bind(this.authControllers));
        app.post('/password/reset', this.authControllers.resetPassword.bind(this.authControllers));

        app.post('/otp/resend', this.authControllers.resendOtp.bind(this.authControllers));
        app.post('/otp/verify', this.authControllers.verifyOTP.bind(this.authControllers));

        app.get('/employers', this.userControllers.getEmployers.bind(this.userControllers));
        app.get('/user/:email', this.userControllers.getUser.bind(this.userControllers));

        app.post('/request', this.userControllers.sendRequest.bind(this.userControllers));
        app.get('/request/search', this.userControllers.searchEmail.bind(this.userControllers));
        app.post('/request/update', this.userControllers.updateRequest.bind(this.userControllers));
        app.get('/notification', this.userControllers.getNotification.bind(this.userControllers))

        app.get('/serviceProvider', this.userControllers.getServiceProvider.bind(this.userControllers));
        app.get('/serviceProviders', this.userControllers.getServiceProviders.bind(this.userControllers));
        app.delete('/serviceProvider', this.userControllers.deleteServiceProvider.bind(this.userControllers));
        app.get('/user/:username', this.userControllers.getUser.bind(this.userControllers));
        app.post('/edit/serviceProvider', this.userControllers.editServiceProvider.bind(this.userControllers));
        app.post('/record', this.userControllers.recordTime.bind(this.userControllers));
        app.get('/record/today', this.userControllers.getTodaysRecord.bind(this.userControllers));
        app.get('/record/period', this.userControllers.getRecordByPeriod.bind(this.userControllers));
        app.get('/record/day', this.userControllers.getRecordByDay.bind(this.userControllers));
        app.get('/record/duplicate', this.userControllers.checkRecordDuplicate.bind(this.userControllers));
    }
}

export default Routes;