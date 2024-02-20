import AutheModels from "../models/authModels";

class AuthControllers {
  models: AutheModels;
  cookieOptions: object

  constructor() {
    this.models = new AutheModels();
    this.cookieOptions = {
      maxAge: 1000 * 60 * 10, // 10 minutes
      httpOnly: true,
      sameSite: "none",
      secure: true
    }
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
      return;
    }
    const isPasswordMatch = await this.models.isPasswordMatch(email, password);
    if (!isPasswordMatch) {
      res.status(400).json({ error: "Incorrect email address or password" });
      return;
    }
    res.sendStatus(200);
  }

  async handleOTP(req: any, res: any) {
    console.log('handle otp')
    const OTP = await this.models.handleOTP(req.body.email);
    if (!OTP) {
      res.status(400).json({ error: 'Failed to issue an OTP' })
      return;
    }
    res.status(200).json({ OTP });
  }

  async validateOTP(req: any, res: any) {
    const isOTPValid = await this.models.validateOTP(req.body);
    if (isOTPValid) {
      const token = await this.models.generateJWTToken(req.body.ownerEmail);
      console.log('token: ', token)
      // res.cookie('token', token, this.cookieOptions);
      res.status(200).json({ token });
      return;
    }
     res.sendStatus(400);
  }

  async resendOTP(req: any, res: any) {
    await this.models.resendOTP(req.body);
  }

  async sendResetPasswordCode(req: any, res: any) {
    const { email } = req.body;
    const response = await this.models.sendResetPasswordCode(email);
    response ? res.status(200) : res.status(400);
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
      res.status(400).json({ error: "You cannot use the previous password" });
      return;
    }
    res.status(200);
  }

  async resetPassword(req: any, res: any) {
    const response = await this.models.resetPassword(req.body);
    response ? res.status(200).send('Password has been reset!') : res.status(400).send('Failed to reset password');
  }



  async isSignedIn(req: any, res: any) {
    console.log('cookie', req.cookie) // undefined
    console.log('token in cookies', req.cookies.token)
    return req.cookies.token
  }
}

export default AuthControllers;

// OTP OK => cannot go back
