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
      return res.status(200).send('Email and password match')
    }
  }

  async issueOTP(req: any, res: any) {
    console.log('issue token here')
    console.log(req.body)
    const OTP = await this.models.issueOTP(req.body.email);
    console.log('otp in controllers: ', OTP)
    if (!OTP) {
      res.status(400).json({ error: 'Failed to issue an OTP' })
      return;
    }
    res.status(200).json({ OTP });
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

  async validateOTP(req: any, res:any) {
    const isOTPValid = await this.models.validateOTP(req.body);
    isOTPValid ? res.status(200).json({ msg: 'OTP is valid' }) : res.status(400).json({ msg: 'OTP is not valid' });
  }
}

export default AuthControllers;
