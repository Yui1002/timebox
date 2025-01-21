enum Parameters {
  DEFAULT_DATE = '1950-01-01T00:00:00'
}

enum Days {
  MONDAY = 'Monday',
  TUESDAY = 'Tuesday',
  WEDNESDAY = 'Wednesday',
  THURSDAY = 'Thursday',
  FRIDAY = 'Friday',
  SATURDAY = 'Saturday',
  SUNDAY = 'Sunday',
}

enum TimeType {
  START = 'start',
  END = 'end'
}

enum Display {
  HIDE = 'Hide',
  SHOW = 'Show'
}

enum PromiseType {
  FULFILLED = 'fulfilled',
  REJECTED = 'rejected',
}

enum RateTypeValue {
  HOURLY = 'hourly',
  DAILY = 'daily'
}

enum Mode {
  YES = 'Yes',
  NO = 'No'
}

enum Screen {
  SIGN_IN = 'SignIn',
  SIGN_UP = 'SignUp',
  FORGOT_PASSWORD = 'ForgotPassword',
  HOME = 'Home',
  DRAWER_NAV = 'DrawerNav',
  VERIFY_OTP = 'VerifyOTP',
  RESET_PASSWORD = 'ResetPassword',
  RECORD = 'Record',
  PERSONAL_INFO = 'PersonalInfo',
  WORK_SHIFTS = 'WorkShifts',
  REVIEW = 'Review',
  REGISTER_WORK_SHIFTS = 'RegisterWorkShifts'
}

enum ErrMsg {
  INVALID_NAME = 'Invalid name',
  INVALID_EMAIL = 'Invalid email',
  INVALID_PASSWORD = 'Password must contain 8 characters, 1 number, 1 upper, 1 lower',
  MISMATCH_PASSWORD = 'Password does not match',
  PASSWORD_REUSE = 'You cannot reuse the previous password',
  SIGNIN_ERROR = 'Invalid email or password',
  DUPLICATE_EMAIL = 'Email already exists',
  EMAIL_NOT_FOUND = 'Email does not exist',
  OTP_SEND_ERR = 'Failed to send otp',
  OTP_VERIFICATION_ERR = 'OTP does not correct',
  DUPLICATE_REQUEST = 'Duplicate request',
  INVALID_RATE = 'Invalid rate',
  INVALID_RATE_TYPE = 'Invalid rate type',
  REQUEST_SEND_ERR = 'Failed to send a request',
  START_TIME_NOT_SELECTED = 'Start time is not selected',
  END_TIME_NOT_SELECTED = 'End time is not selected',
  INVALID_START_TIME = 'Start time has to occur before end time',
  INVALID_END_TIME = 'End time has to occur after start time'
}

enum ProgressBar {
  INFORMATION = 'Information',
  WORK_SHIFTS = 'Work Shifts',
  REVIEW = 'Review'
}

export { Days, TimeType, PromiseType, RateTypeValue, Screen, ErrMsg, Display, ProgressBar, Parameters, Mode }