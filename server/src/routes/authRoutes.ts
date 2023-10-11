import AuthenticationControllers from "../controllers/authenticationControllers";

class AuthRoutes {
    authControllers: AuthenticationControllers;

    constructor() {
        this.authControllers = new AuthenticationControllers();
    }

    applyRouting(app: any) {
        app.post('/signUp', this.authControllers.signUpOwner.bind(this.authControllers));
        app.post('/signIn', this.authControllers.signInOwner.bind(this.authControllers));
    }
}

export default AuthRoutes;