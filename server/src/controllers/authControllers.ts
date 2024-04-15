import AutheModels from "../models/authModels";

class AuthControllers {
  models: AutheModels;

  constructor() {
    this.models = new AutheModels();
  }

  async signUpOwner(req: any, res: any) {
    const isRegistered = await this.models.isOwnerRegistered(req.body.email);
    if (isRegistered) {
      res.status(400).json({ error: "This email is already used" });
    } else {
      const response = await this.models.signUpOwner(req.body);
      response
        ? res.sendStatus(200)
        : res.status(400).json({ error: "Failed to sign up" });
    }
  }

  async signInOwner(req: any, res: any) {
    const { email, password } = req.body;
    const isRegistered = await this.models.isOwnerRegistered(email);
    if (!isRegistered) {
      res.status(400).json({ error: "Incorrect email address or password" });
    } else {
      const isPasswordMatch = await this.models.isPasswordMatch(
        email,
        password
      );
      if (!isPasswordMatch) {
        res.status(400).json({ error: "Incorrect email address or password" });
        return;
      }
      res.status(200).send("successfully login");
    }
  }

  async signInNanny(req: any, res: any) {
    const { username } = req.body;
    const isNannyRegistered = await this.models.isNannyRegistered(username);
    if (!isNannyRegistered) {
      res.status(400).json({ error: "Incorrect username" });
      return;
    }
    res.status(200).send("successfully login");
  }

  async sendResetPasswordCode(req: any, res: any) {
    const { email } = req.body;
    const response = await this.models.sendResetPasswordCode(email);
    response ? res.sendStatus(200) : res.sendStatus(400);
  }

  async validateCode(req: any, res: any) {
    const isExpired = await this.models.validateCodeExpiration(req.body);
    if (!isExpired) {
      res.status(400).json({ error: "Code is expired. You must create a new one" });
      return;
    }
    const isMatch = await this.models.validateCodeMatch(req.body);
    if (!isMatch) {
      res.status(400).json({ error: "Code does not match" });
      return;
    }
    res.sendStatus(200)
  }

  async validatePassword(req: any, res: any) {
    const isPasswordSame = await this.models.isPasswordSame(req.body);
    if (isPasswordSame) {
      res.status(400).json({ error: "You cannot use the previous password"});
      return;
    }
    res.status(200);
  }

  async resetPassword(req: any, res: any) {
    const response = await this.models.resetPassword(req.body);
    response ? res.status(200).send('Password has been reset!') : res.status(400).send('Failed to reset password');
  }
}

export default AuthControllers;
