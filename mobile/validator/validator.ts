import {isEmail, isFloat, isEmpty, isStrongPassword, isDate} from 'validator';
import moment from 'moment';
import {PASSWORD_RULES} from '../config.js';
import { SignInProps, SignUpProps } from '../types';
import { ErrMsg, RateTypeValue, TimeType } from '../enums';


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

  static isValidRateType(rateType: RateTypeValue) {
    return !isEmpty(rateType);
  }

  static isValidStartTime(start: string, end: string) {
    return moment(start).isBefore(moment(end))
  }

  static isValidEndTime(start: string, end: string) {
    return moment(end).isAfter(moment(start))
  }

  static isValidDate(date: string): boolean {
    return isDate(date);
  }

  static isValidDuration(startTime: string, endTime: string) {
    let diff = moment(endTime, 'h:mm A').diff(moment(startTime, 'h:mm A'), 'hours');
    return diff >= 1;
  }

  static validateOTP(otp: string): ErrMsg | null {
    const regex = /^[0-9]{6,6}$/;
    const isValidOTP = regex.test(otp);
    if (!isValidOTP) {
      return ErrMsg.INVALID_OTP;
    } 
    return null;
  }

  
  static validateSignUp(props: SignUpProps): ErrMsg | null {
    if (!this.isNotEmpty(props.firstName) || !this.isNotEmpty(props.lastName)) {
      return ErrMsg.INVALID_NAME
    }

    if (!this.isValidEmail(props.email)) {
        return ErrMsg.INVALID_EMAIL;
    }

    if (!this.isValidPassword(props.password)) {
        return ErrMsg.INVALID_PASSWORD;
    }

    if (!this.isPasswordMatch(props.password, props.confirmedPassword)) {
      return ErrMsg.MISMATCH_PASSWORD;
    }

    return null;
  }

  static validateSignIn(props: SignInProps): ErrMsg | null {
    if (!this.isValidEmail(props.email)) {
      return ErrMsg.INVALID_EMAIL;
    }
    
    if (!this.isValidPassword(props.password)) {
      return ErrMsg.INVALID_PASSWORD;
    }

    return null;
  }

  static validateEmail(email: string): ErrMsg | null {
    if (!this.isValidEmail(email)) {
      return ErrMsg.INVALID_EMAIL;
    }
    return null;
  }

  static validatePassword(password: string, confirmedPassword: string): ErrMsg | null {
    if (!this.isValidPassword(password)) {
      return ErrMsg.INVALID_PASSWORD;
    }

    if (!this.isPasswordMatch(password, confirmedPassword)) {
      return ErrMsg.MISMATCH_PASSWORD;
    }

    return null;
  }

  static validateRecordTime(type: TimeType, startTime: string, endTime: string): ErrMsg | null {
    if (type === TimeType.START) {
      if (!this.isValidDate(startTime)) {
        return ErrMsg.INVALID_START_TIME;
      }
      if (endTime && this.isValidStartTime(startTime, endTime)) {
        return ErrMsg.INVALID_START_TIME;
      }
    } else if (type === TimeType.END) {
      if (!this.isValidDate(endTime)) {
        return ErrMsg.INVALID_END_TIME;
      }
      if (startTime && !this.isValidEndTime(startTime, endTime)) {
        return ErrMsg.INVALID_END_TIME;
      }
    }
    return null;
  }

  static validateRate(rate: string, rateType: RateTypeValue): ErrMsg | null {
    if (!this.isValidRate(rate)) {
      return ErrMsg.INVALID_RATE;
    }
    if (!this.isValidRateType(rateType)) {
      return ErrMsg.INVALID_RATE_TYPE;
    }
    return null;
  }

  static validateWorkShifts(shifts: any, day: string, startTime: string, endTime: string): ErrMsg | null {
    if (!this.isNotEmpty(day)) {
      return ErrMsg.DAY_EMPTY;
    }

    if (shifts && shifts.some((shift: any) => shift['day'] === day)) {
      return ErrMsg.DUPLICATE_DAY;
    }

    if (!this.isValidStartTime(startTime, endTime)) {
      return ErrMsg.INVALID_START_TIME;
    }

    if (!this.isValidEndTime(startTime, endTime)) {
      return ErrMsg.INVALID_END_TIME;
    }

    if (!this.isValidDuration(startTime, endTime)) {
      return ErrMsg.INVALID_DURATION;
    }

    return null;
  }
}


export default Validator;
