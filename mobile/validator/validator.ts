import {isEmail, isFloat, isEmpty, isStrongPassword} from 'validator';
import moment from 'moment';
import {PASSWORD_RULES} from '../config.js';

class Validator {
  static isNotEmpty(name: string): boolean {
    return !isEmpty(name);
  }

  static isValidEmail(email: string): boolean {
    return isEmail(email);
  }

  static isValidPassword(password: string): boolean {
    return isStrongPassword(password, PASSWORD_RULES);
  }

  static isPasswordMatch(password: string, confirmedPassword: string): boolean {
    return password === confirmedPassword;
  }

  static isValidRate(rate: string): boolean {
    return isFloat(rate, {
      min: 1.0,
      max: 3000.0,
    });
  }

  static isValidRateType(rateType: string) {
    return !isEmpty(rateType);
  }

  static isValidStartTime(start: Date, end: Date) {
    return moment(start).isBefore(moment(end))
  }

  static isValidEndTime(start: Date, end: Date) {
    return moment(end).isAfter(moment(start))
  }
}

export default Validator;
