import {RateTypeValue, Mode, StatusModel} from './enums';
import { UserSchedule } from './swagger';

type UserInfo = {
  firstName: string;
  lastName: string;
  email: string;
}

type Schedule = {
  id?: number;
  day: string | undefined;
  startTime: string | undefined;
  endTime: string | undefined;
};

type ServiceProvider = {
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  rate: number;
  rate_type: string;
  schedule: Schedule[] | [];
  allow_edit: boolean;
};

type RawEmployer = {
  firstName: string;
  lastName: string;
  email: string;
  mode: number;
};

type FormattedEmployer = {
  label: string;
  value: string;
};

type ResultModel = {
  status: StatusModel;
  message: string;
};

type NotificationData = {
  id: string;
  senderFirstName: string;
  senderLastName: string;
  senderEmail: string;
  receiverEmail: string;
  rate: number | null;
  rateType: string | null;
  day: string | null;
  startTime: string | null;
  endTime: string | null;
  status: string;
  allowEdit: boolean;
  schedule: Schedule[];
  requestDate: Date;
};

type RateTypeSet = {
  label: RateTypeValue.HOURLY | RateTypeValue.DAILY;
  value: RateTypeValue.HOURLY | RateTypeValue.DAILY;
};

type ModeSet = {
  label: Mode.YES | Mode.NO;
  value: Mode.YES | Mode.NO;
};

type SignUpProps = {
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  confirmedPassword: string,
  isSignUp: boolean,
}

type SignInProps = {
  email: string,
  password: string
}

type PersonalInfoProps = {
  firstName: string;
  lastName: string;
  email: string;
};

type WorkShiftsProps = {
    firstName: string,
    lastName: string,
    email: string,
    rate: string,
    rateType: RateTypeValue.HOURLY | RateTypeValue.DAILY,
}

type ForgotPasswordProps = {
  email: string,
  isSignUp: boolean
}

type FormatRequest = {
  email: string,
  schedules: UserSchedule[]
}

type Record = {
  id?: number | null;
  startTime: Date | null;
  endTime: Date | null;
}

type DateInput = {
  from: Date | null,
  to: Date | null
}

export {
  UserInfo,
  PersonalInfoProps,
  RateTypeSet,
  ResultModel,
  Schedule,
  ServiceProvider,
  RawEmployer,
  FormattedEmployer,
  NotificationData,
  WorkShiftsProps,
  SignUpProps,
  SignInProps,
  ForgotPasswordProps,
  ModeSet,
  Record,
  DateInput
};
