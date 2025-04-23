enum RequestStatus {
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  PENDING = "PENDING",
}

enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

enum RateType {
  HOURLY = 'hourly',
  DAILY = 'daily',
  UNSPECIFIED = undefined,
}

//AMIT NOTE: What is mode?
enum Mode {
  False = 0,
  True = 1
}


export { RequestStatus, UserStatus, RateType, Mode };
