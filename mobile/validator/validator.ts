import validator, {isByteLength} from 'validator';
import {PASSWORD_RULES} from '../config.js';

class Validator {
  static isNotEmpty(name: string): boolean {
    return !validator.isEmpty(name);
  }

  static isValidEmail(email: string): boolean {
    return validator.isEmail(email);
  }

  static isValidPassword(password: string): boolean {
    return validator.isStrongPassword(password, PASSWORD_RULES);
  }

  static isPasswordMatch(password: string, confirmedPassword: string): boolean {
    return password === confirmedPassword;
  }

  static isValidRate(rate: string): boolean {
    return validator.isFloat(rate, {
      min: 1.00,
      max: 3000.00
    });
  }

  static isValidRateType(rateType: string) {
    return !validator.isEmpty(rateType);
  }
}

export default Validator;
