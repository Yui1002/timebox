import validator from 'validator';
import {PASSWORD_RULES} from '../config.js';

class Validator {
  constructor() {}

  isEmpty(value: string): boolean {
    return value.length === 0
  }

  isValidEmail(email: string): boolean {
    return validator.isEmail(email)
  }

  isPasswordStrong(password: string): boolean {
    return validator.isStrongPassword(password, PASSWORD_RULES)
  }

  isPasswordMatch(password: string, confirmedPassword: string): boolean {
    return password === confirmedPassword;
  }
}

export default Validator;
