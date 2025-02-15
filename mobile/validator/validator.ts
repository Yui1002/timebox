import {isEmail, isFloat, isEmpty, isStrongPassword, isDate, isCurrency} from 'validator';
import moment from 'moment';
import {PASSWORD_RULES} from '../config.js';
import {SignUpProps} from '../types';
import {ErrMsg, RateTypeValue, TimeType} from '../enums';

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
    return isCurrency(rate) && rate >= '10.00';
  }

  static isValidRateType(rateType: RateTypeValue) {
    return !isEmpty(rateType);
  }

  static isValidStartTime(start: Date, end: Date) {
    return moment(start).isBefore(moment(end));
  }

  static isValidEndTime(start: Date, end: Date) {
    return moment(end).isAfter(moment(start));
  }

  static isValidDate(date: Date): boolean {
    return moment(date).isValid();
  }

  static isValidDuration(startTime: Date, endTime: Date) {
    console.log(startTime, endTime);
    let diff = moment(endTime, 'h:mm A').diff(
      moment(startTime, 'h:mm A'),
      'hours',
    );
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
      return ErrMsg.INVALID_NAME;
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

  static validateSignIn(email: string, password: string): ErrMsg | null {
    if (!this.isValidEmail(email)) {
      return ErrMsg.INVALID_EMAIL;
    }

    if (!this.isValidPassword(password)) {
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

  static validatePassword(
    password: string,
    confirmedPassword: string,
  ): ErrMsg | null {
    if (!this.isValidPassword(password)) {
      return ErrMsg.INVALID_PASSWORD;
    }

    if (!this.isPasswordMatch(password, confirmedPassword)) {
      return ErrMsg.MISMATCH_PASSWORD;
    }

    return null;
  }

  static validateRecordTime(
    type: TimeType,
    startTime: Date,
    endTime: Date,
  ): ErrMsg | null {
    if (type === TimeType.START) {
      if (!startTime || !this.isValidDate(startTime)) {
        return ErrMsg.INVALID_START_TIME;
      }
      if (endTime && this.isValidStartTime(startTime, endTime)) {
        return ErrMsg.INVALID_START_TIME;
      }
    } else if (type === TimeType.END) {
      if (!endTime || !this.isValidDate(endTime)) {
        return ErrMsg.INVALID_END_TIME;
      }
      if (startTime && !this.isValidEndTime(startTime, endTime!)) {
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

  static validateWorkShifts(
    shifts: any,
    day: string,
    startTime: Date,
    endTime: Date,
  ): ErrMsg | null {
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

  static validateWorkingRecordSelect(
    selected: string,
    from: string,
    to: string,
  ): ErrMsg | null {
    if (!this.isNotEmpty(selected)) {
      return ErrMsg.EMPLOYER_NOT_SELECTED;
    }

    if (!this.isValidEndTime(from, to)) {
      return ErrMsg.INVALID_TIME;
    }
    return null;
  }

  static validatePeriod(startTime: Date, endTime: Date) {
    if (
      !this.isValidStartTime(startTime, endTime) ||
      !this.isValidEndTime(startTime, endTime)
    ) {
      return ErrMsg.INVALID_TIME;
    }
  }
}

export default Validator;
