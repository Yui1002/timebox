import AuthenticationModels from "../models/authenticationModels"

class AuthenticationControllers {
    models: AuthenticationModels;

    constructor() {
        this.models = new AuthenticationModels();
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
}

export default AuthenticationControllers;