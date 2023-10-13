import AuthControllers from "../controllers/authControllers";

class AuthRoutes {
    authControllers: AuthControllers;

    constructor() {
        this.authControllers = new AuthControllers();
    }

    applyRouting(app: any) {
        app.post('/signUp', this.authControllers.signUpOwner.bind(this.authControllers));
        app.post('/signIn', this.authControllers.signInOwner.bind(this.authControllers));
        app.post('/user/reset', this.authControllers.sendResetPasswordCode.bind(this.authControllers));
    }
}

export default AuthRoutes;