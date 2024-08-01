import AutheModels from "../models/authModels";
// import UserModels from '../models/userModels'

class AuthControllers {
  models: AutheModels;
  // userModels: UserModels;

  constructor() {
    this.models = new AutheModels();
    // this.userModels = new UserModels();
  }

  async isUserRegistered(req: any, res: any) {
    const { email } = req.params;
    const isUserRegistered = await this.models.isUserRegistered(email);
    if (isUserRegistered) {
      res.status(400).json({ error: "This email is already used" });
      return;
    }

    const otp = this.models.generateOtp();
    await this.models.storeOtp(email, otp);
    (await this.models.sendOtp(email, otp))
      ? res.status(200).json({ otp })
      : res.status(400).json({ error: "Failed to send otp" });
  }

  async isEmailRegistered(req: any, res: any) {
    const { email } = req.body;
    const emailRegistered = await this.models.isUserRegistered(email);
    emailRegistered ? res.status(200).send("success") : res.status(400);
  }

  async signUp(req: any, res: any) {
    (await this.models.signUp(req.body))
      ? res.sendStatus(200)
      : res.status(400).json({ error: "Failed to sign up" });
  }

  async signIn(req: any, res: any) {
    const { email, password } = req.body;
    const usersname = await this.models.getName(email);
    if (!usersname.length) {
      res.status(400).json({ error: "Incorrect email address or password" });
      return;
    }
    const isPasswordMatch = await this.models.isPasswordMatch(email, password);
    if (!isPasswordMatch) {
      res.status(400).json({ error: "Incorrect email address or password" });
      return;
    }
    // const employers = await this.userModels.getEmployers(email);
    // console.log(employers)
    res.status(200).send({
      firstName: usersname[0].first_name,
      lastName: usersname[0].last_name,
      // employers
    });
  }

  async resendOTP(req: any, res: any) {
    const { email } = req.body;
    const otp = this.models.generateOtp();
    await this.models.updateOtp(email, otp);
    (await this.models.sendOtp(email, otp))
      ? res.status(200).send({ otp })
      : res.status(400).json({ error: "Failed to send otp" });
  }

  async resetPassword(req: any, res: any) {
    const response = await this.models.resetPassword(req.body);
    response
      ? res.sendStatus(200)
      : res.status(400).json({ error: "Failed to reset password" });
  }
}

export default AuthControllers;
