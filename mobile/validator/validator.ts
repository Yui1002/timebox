import {
  isEmail,
  isFloat,
  isEmpty,
  isStrongPassword,
  isDate,
  isCurrency,
} from 'validator';
import moment from 'moment';
import {PASSWORD_RULES} from '../config.js';
import {SignUpProps} from '../types';
import {ErrMsg, RateTypeValue} from '../enums';
import {TimeType} from '../swagger';

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

  static isValidRate(rate: number): boolean {
    return rate >= 5.00 && rate <= 10000.00;
  }

  static isValidRateType(rateType: RateTypeValue): boolean {
    return rateType === RateTypeValue.HOURLY || rateType === RateTypeValue.DAILY;
  }

  static isValidStartTime(start: Date | string, end: Date | string) {
    return moment(start).isBefore(moment(end));
  }

  static isValidEndTime(start: Date | string, end: Date | string) {
    return moment(end).isAfter(moment(start));
  }

  static isValidDate(date: Date | string): boolean {
    return moment(date).isValid();
  }

  static isValidDuration(startTime: Date, endTime: Date) {
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
    startTime: Date | null,
    endTime: Date | null,
  ): ErrMsg | null {

    if (type === TimeType.Start) {
      if (!startTime || !this.isValidDate(startTime)) {
        return ErrMsg.INVALID_START_TIME;
      }
      if (endTime && this.isValidStartTime(startTime, endTime)) {
        return ErrMsg.INVALID_START_TIME;
      }
    } else if (type === TimeType.End) {
      if (!startTime) {
        return ErrMsg.START_TIME_NOT_SELECTED
      }
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
    if (!this.isValidRate(Number(rate))) {
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

  static validateWorkingRecordSelect(from: string, to: string): ErrMsg | null {
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
